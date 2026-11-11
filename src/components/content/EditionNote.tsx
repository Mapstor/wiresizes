// Which NEC edition the site's code values come from, for the homepage and the two hubs (WSZ-005b). No number and no
// citation: the 2026 edition's dates stay off these pages while the nec-2026-edition registry link returns 404 (DEVLOG
// §5); WSZ-005c adds them, with the adoption by state, once that source link works again.
export function EditionNote({ className }: { className?: string }) {
  return (
    <p className={className}>
      Code values on this site come from the 2023 edition of the National Electrical Code (NEC) unless a page names another. States and
      cities adopt NEC editions on their own schedules, so the edition that applies is the one adopted where the work is done.
    </p>
  );
}
