/** Whether the signed-in viewer may edit a ticket note, given the note's
 * stored actor string. Actor attribution changed twice during the July 2026
 * rollout, so exact-match against the viewer's profile name orphans older
 * notes:
 *  - Jul 23–24: the note form had a "Posting as Drew / Posting as Frank"
 *    dropdown — actors are bare first names ("Drew", "Frank").
 *  - Jul 24–30 (shared-password era): every note says "CRM User" — genuinely
 *    anonymous, belongs to no one. Any named teammate may fix those rather
 *    than freezing them forever; this is a 3-person internal tool.
 *  - Post real-auth: actors are profile full names ("Drew Quevedo").
 */
export function canEditTicketNote(noteActor: string, viewerName: string | null): boolean {
  if (!viewerName) return false;
  if (noteActor === viewerName) return true;
  if (noteActor === viewerName.trim().split(/\s+/)[0]) return true;
  if (noteActor === "CRM User") return true;
  return false;
}
