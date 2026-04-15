#!/usr/bin/env python3
"""
CAL FIRE DINS Loader — econstruct Lead Gen
Downloads Palisades + Eaton Fire DINS shapefiles from CAL FIRE GIS portal,
converts to GeoJSON, resolves APN from LA County Assessor, and inserts into Supabase.

Run: python scripts/dins-loader.py
Schedule: GitHub Actions weekly Sunday 10pm PT + manual trigger
"""

import os
import sys
import json
import time
import logging
import requests
import geopandas as gpd
from datetime import datetime, timezone
from io import BytesIO
from zipfile import ZipFile

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("dins-loader")

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

SUPABASE_HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=representation",
}

# CAL FIRE DINS shapefile URLs (update if CAL FIRE changes URLs)
DINS_SOURCES = [
    {
        "name": "Palisades Fire",
        "url": "https://gis.data.ca.gov/datasets/calfire-forestry::palisades-fire-damage-inspection-dins.zip",
        "tag": "palisades_fire",
    },
    {
        "name": "Eaton Fire",
        "url": "https://gis.data.ca.gov/datasets/calfire-forestry::eaton-fire-damage-inspection-dins.zip",
        "tag": "altadena_fire",
    },
]

# Tier 1 target zip codes
TIER1_ZIPS = {"90272", "90402", "91001", "91104", "90265", "90210", "90077", "90049", "91302", "91364"}

DAMAGE_MAP = {
    "Destroyed": "destroyed",
    "Major Damage": "major",
    "Minor Damage": "minor",
    "Affected": "affected",
    "No Damage": "none",
    "Inaccessible": None,
}


def download_shapefile(url: str) -> gpd.GeoDataFrame:
    log.info(f"Downloading {url}")
    r = requests.get(url, timeout=120)
    r.raise_for_status()
    with ZipFile(BytesIO(r.content)) as z:
        z.extractall("/tmp/dins_shapefile")
    import glob
    shp = glob.glob("/tmp/dins_shapefile/**/*.shp", recursive=True)
    if not shp:
        raise FileNotFoundError("No .shp file found in archive")
    gdf = gpd.read_file(shp[0]).to_crs(epsg=4326)
    log.info(f"Loaded {len(gdf)} features")
    return gdf


def resolve_apn(lat: float, lng: float) -> str | None:
    """Resolve APN from LA County Assessor by coordinates."""
    try:
        time.sleep(0.5)
        r = requests.get(
            f"https://assessor.lacounty.gov/api/properties/nearby?lat={lat}&lng={lng}&radius=50",
            headers={"User-Agent": "econstruct-leadbot/1.0 (+https://econstructinc.com/bot)"},
            timeout=10,
        )
        if r.ok:
            data = r.json()
            return data.get("properties", [{}])[0].get("ain") or data.get("ain")
    except Exception as e:
        log.warning(f"APN lookup failed: {e}")
    return None


def get_zip_from_coords(lat: float, lng: float) -> str | None:
    """Reverse geocode to get zip code."""
    try:
        r = requests.get(
            f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lng}&format=json",
            headers={"User-Agent": "econstruct-leadbot/1.0"},
            timeout=10,
        )
        if r.ok:
            return r.json().get("address", {}).get("postcode")
    except Exception:
        pass
    return None


def upsert_lead(lead: dict) -> bool:
    """Upsert lead by APN. Returns True on success."""
    url = f"{SUPABASE_URL}/rest/v1/leads"
    r = requests.post(url, headers=SUPABASE_HEADERS, json=lead, timeout=15)
    return r.ok


def log_agent_run(status: str, records_pulled: int, records_created: int, records_updated: int, errors: list):
    url = f"{SUPABASE_URL}/rest/v1/agent_runs"
    headers = {**SUPABASE_HEADERS, "Prefer": "return=minimal"}
    requests.post(url, headers=headers, json={
        "agent_name": "dins-loader",
        "run_type": "scheduled",
        "status": status,
        "records_pulled": records_pulled,
        "records_created": records_created,
        "records_updated": records_updated,
        "errors": errors,
        "ended_at": datetime.now(timezone.utc).isoformat(),
    }, timeout=10)



def main():
    total_pulled = 0
    total_created = 0
    total_updated = 0
    all_errors = []

    for source in DINS_SOURCES:
        log.info(f"Processing {source['name']}")
        try:
            gdf = download_shapefile(source["url"])
        except Exception as e:
            msg = f"Download failed for {source['name']}: {e}"
            log.error(msg)
            all_errors.append(msg)
            continue

        for _, row in gdf.iterrows():
            total_pulled += 1
            try:
                geom = row.geometry
                lat = geom.centroid.y if geom else None
                lng = geom.centroid.x if geom else None

                # Get zip
                zip_code = str(row.get("AIN_Zip") or row.get("Zipcode") or "")[:5]
                if not zip_code and lat and lng:
                    zip_code = get_zip_from_coords(lat, lng)

                # Filter to Tier 1 zips
                if zip_code and zip_code not in TIER1_ZIPS:
                    continue

                damage_raw = str(row.get("DAMAGE_CAT") or row.get("damage_cat") or "")
                fire_damage_status = DAMAGE_MAP.get(damage_raw)
                if fire_damage_status is None:
                    continue  # Skip inaccessible or unknown

                # Resolve APN
                apn = str(row.get("AIN") or row.get("ain") or "")
                if not apn and lat and lng:
                    apn = resolve_apn(lat, lng)

                address = str(row.get("Address") or row.get("address") or "")

                lead = {
                    "source": "cal_fire_dins",
                    "sub_source": source["tag"],
                    "fire_damage_status": fire_damage_status,
                    "address": address or None,
                    "zip_code": zip_code or None,
                    "latitude": lat,
                    "longitude": lng,
                    "lifecycle_stage": "new",
                    "tags": [source["tag"], "cal_fire_dins"],
                }
                if apn:
                    lead["apn"] = apn

                success = upsert_lead(lead)
                if success:
                    total_created += 1
                else:
                    all_errors.append(f"Upsert failed for {address}")
            except Exception as e:
                all_errors.append(f"Row error: {e}")
                log.warning(f"Row error: {e}")

    status = "success" if not all_errors else ("partial" if total_created > 0 else "failed")
    log_agent_run(status, total_pulled, total_created, total_updated, all_errors[:50])
    log.info(f"Done: {total_created} created, {total_updated} updated, {len(all_errors)} errors")


if __name__ == "__main__":
    main()
