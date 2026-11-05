// Texts for the choice to run a plan without the safety backup.
Object.assign(TEXT.de, {
  planAdvanced: "Erweitert", skipBackup: "Ohne Backup ausführen", skipBackupHint: "Nur einschalten, wenn du selbst ein aktuelles Backup hast.",
  skipBackupWarnTitle: "Kein Backup vor dem Plan", skipBackupWarn: "Falls etwas schiefgeht, kann Housekeeper es nicht über ein Backup wiederherstellen. Entfernte Entitäten und Geräte sind dann nicht mehr zurückzuholen.",
  confirmPlanNoBackup: "Ohne Backup bestätigen", skipBackupStep: "Übersprungen: du hast gewählt, ohne Backup zu laufen", skipBackupDone: "Bewusst übersprungen ({date})",
  err_skip_backup_database: "Dieser Plan schreibt in die Recorder-Datenbank. Dafür ist das Backup Pflicht.",
});
Object.assign(TEXT.en, {
  planAdvanced: "Advanced", skipBackup: "Run without a backup", skipBackupHint: "Turn on only if you have a recent backup of your own.",
  skipBackupWarnTitle: "No backup before the plan", skipBackupWarn: "If something goes wrong, Housekeeper cannot restore it from a backup. Removed entities and devices cannot be brought back.",
  confirmPlanNoBackup: "Confirm without backup", skipBackupStep: "Skipped: you chose to run without a backup", skipBackupDone: "Skipped on purpose ({date})",
  err_skip_backup_database: "This plan writes into the recorder database. The backup is required for that.",
});
