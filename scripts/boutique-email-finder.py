"""
boutique-email-finder.py
Finds emails for boutique firms (architects, designers, adjusters) that
Apollo /people/match can't index. Strategy:
  1. Known domain mapping per firm
  2. Generate top-3 email pattern candidates per person
  3. SMTP verify each candidate (free, no API key)
  4. POST verified contacts directly into partner_leads via Supabase REST
"""

import smtplib
import socket
import dns.resolver
import requests
import json
import os
import time

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://dzudtdhmvnuipqyoogem.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

# ── Boutique firm contacts with known domains ────────────────────────────────
CONTACTS = [
    # ARCHITECTS
    {"first": "Richard", "last": "Blumenberg", "firm": "RLB Architecture", "domain": "rlbarchitecture.com", "type": "Architect"},
    {"first": "Dean", "last": "Larkin", "firm": "Dean Larkin Design", "domain": "deanlarkindesign.com", "type": "Architect"},
    {"first": "Erik", "last": "Peterson", "firm": "PHX Architecture", "domain": "phxarch.com", "type": "Architect"},
    {"first": "Mehran", "last": "Shahverdi", "firm": "MSH Design", "domain": "mshdesigninc.com", "type": "Architect"},
    {"first": "Zoltan", "last": "Pali", "firm": "SPF Architects", "domain": "spf-a.com", "type": "Architect"},
    {"first": "Paul", "last": "Williger", "firm": "Paul Brant Williger Architect", "domain": "pbwarchitect.com", "type": "Architect"},
    {"first": "Richard", "last": "Landry", "firm": "Landry Design Group", "domain": "landrydesigngroup.com", "type": "Architect"},
    {"first": "Paul", "last": "McClean", "firm": "McClean Design", "domain": "mcleandesign.com", "type": "Architect"},
    {"first": "Hagy", "last": "Belzberg", "firm": "Belzberg Architects", "domain": "belzbergarchitects.com", "type": "Architect"},
    {"first": "Robin", "last": "Donaldson", "firm": "Shubin Donaldson Architects", "domain": "shubindonaldson.com", "type": "Architect"},
    {"first": "Patrick", "last": "Tighe", "firm": "Tighe Architecture", "domain": "tighearchitecture.com", "type": "Architect"},
    {"first": "John", "last": "Enright", "firm": "Griffin Enright Architects", "domain": "griffinenrightarchitects.com", "type": "Architect"},
    {"first": "Erla", "last": "Ingjaldsdottir", "firm": "Minarc", "domain": "minarc.com", "type": "Architect"},
    {"first": "Paolo", "last": "Volpis", "firm": "Paolo Volpis Architect", "domain": "paolovolpis.com", "type": "Architect"},
    # INTERIOR DESIGNERS
    {"first": "Pamela", "last": "Shamshiri", "firm": "Studio Shamshiri", "domain": "studioshamshiri.com", "type": "Interior Designer"},
    {"first": "Ramin", "last": "Shamshiri", "firm": "Studio Shamshiri", "domain": "studioshamshiri.com", "type": "Interior Designer"},
    {"first": "Roman", "last": "Alonso", "firm": "Commune Design", "domain": "communedesign.com", "type": "Interior Designer"},
    {"first": "Alison", "last": "Palevsky", "firm": "Palevsky Co", "domain": "palco.la", "type": "Interior Designer"},
    {"first": "Todd", "last": "Nickey", "firm": "Nickey Kehoe", "domain": "nickeykehoe.com", "type": "Interior Designer"},
    {"first": "Nathan", "last": "Turner", "firm": "Nathan Turner Inc", "domain": "nathanturner.com", "type": "Interior Designer"},
    {"first": "Lindsey", "last": "Borchard", "firm": "Lindsey Borchard Design", "domain": "lindseyborchard.com", "type": "Interior Designer"},
    # ADJUSTERS
    {"first": "Avner", "last": "Gat", "firm": "Avner Gat Public Adjusters", "domain": "avnergat.com", "type": "Insurance Agent / Adjuster"},
    {"first": "Scott", "last": "Greenspan", "firm": "The Greenspan Co", "domain": "greenspanai.com", "type": "Insurance Agent / Adjuster"},
    {"first": "David", "last": "Eghbali", "firm": "Allied Public Adjusters", "domain": "alliedpa.com", "type": "Insurance Agent / Adjuster"},
    {"first": "Omar", "last": "Ghias", "firm": "AllCity Adjusting", "domain": "allcityadjusting.com", "type": "Insurance Agent / Adjuster"},
]


def email_patterns(first: str, last: str, domain: str) -> list[str]:
    f = first.lower()
    l = last.lower().replace(" ", "").replace("-", "")
    return [
        f"{f}@{domain}",
        f"{f}.{l}@{domain}",
        f"{f[0]}{l}@{domain}",
        f"{f}{l}@{domain}",
        f"info@{domain}",
        f"studio@{domain}",
    ]


def get_mx(domain: str) -> str | None:
    try:
        records = dns.resolver.resolve(domain, "MX", lifetime=5)
        return str(sorted(records, key=lambda r: r.preference)[0].exchange).rstrip(".")
    except Exception:
        return None


def smtp_verify(email: str, mx: str) -> bool:
    """Returns True if the SMTP server accepts the recipient."""
    try:
        with smtplib.SMTP(timeout=8) as smtp:
            smtp.connect(mx, 25)
            smtp.ehlo("econstructhomes.com")
            smtp.mail("verify@econstructhomes.com")
            code, _ = smtp.rcpt(email)
            return code == 250
    except Exception:
        return False


def insert_partner(contact: dict, email: str) -> bool:
    if not SUPABASE_KEY:
        print(f"  [DRY RUN] Would insert {email}")
        return True
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    payload = {
        "partner_name": f"{contact['first']} {contact['last']}",
        "company_firm": contact["firm"],
        "partner_type": contact["type"],
        "contact_email": email,
        "source": "Cold Outreach",
        "status": "New Lead",
        "referral_agreement_status": "Not Started",
        "referral_fee": 5000,
        "assigned_to": "Drew Quevedo",
        "notes": f"Email found via pattern matching — {contact['domain']}",
    }
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/partner_leads",
        headers=headers,
        json=payload,
    )
    return r.status_code in (200, 201)


def main():
    inserted = 0
    skipped = 0

    for c in CONTACTS:
        domain = c["domain"]
        print(f"\n-- {c['first']} {c['last']} @ {c['firm']} ({domain})")

        mx = get_mx(domain)
        if not mx:
            print(f"  No MX record for {domain} — skipping")
            skipped += 1
            continue
        print(f"  MX: {mx}")

        verified_email = None
        for email in email_patterns(c["first"], c["last"], domain):
            print(f"  Trying {email} ...", end=" ", flush=True)
            if smtp_verify(email, mx):
                print("OK ACCEPTED")
                verified_email = email
                break
            else:
                print("X")
            time.sleep(0.3)

        if verified_email:
            ok = insert_partner(c, verified_email)
            if ok:
                print(f"  → Inserted into partner_leads: {verified_email}")
                inserted += 1
            else:
                print(f"  → Insert failed for {verified_email}")
        else:
            print(f"  → No verified email found for {c['first']} {c['last']}")
            skipped += 1

    print(f"\n=== DONE === inserted={inserted} skipped={skipped} ===")


if __name__ == "__main__":
    main()
