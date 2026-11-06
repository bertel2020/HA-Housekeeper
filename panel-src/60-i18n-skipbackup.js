// Texts for the choice to run a plan without the safety backup.
Object.assign(TEXT.de, {
  bkTitleOk: "Vorher wird ein Backup angelegt", bkSubOk: "Housekeeper startet nur, wenn es gelingt.",
  bkTitleOld: "Dein letztes Backup ist {age} alt", bkSubOld: "Housekeeper legt vorher ein neues an. Ohne neues Backup wärst du auf dem alten Stand.",
  bkTitleNone: "Es ist noch kein Backup bekannt", bkSubNone: "Housekeeper legt vorher eines an. Ohne Backup gibt es für Entferntes keinen Weg zurück.",
  bkTitleSkip: "Kein neues Backup vor dem Plan", bkSubSkip: "Rückgängig per Housekeeper bleibt möglich, solange nichts verändert wurde. Scheitert es, hilft nur dein letztes Backup von vor {age}; was danach geändert wurde, fehlt dort.", bkSubSkipData: "Rückgängig per Housekeeper bleibt möglich, solange nichts verändert wurde. Gelöschten Verlauf bringt nur ein Backup zurück, und das letzte ist von vor {age}.",
  bkLast: "Letztes Backup: vor {age}", bkNoneFound: "Kein Backup in Home Assistant gefunden", bkWhere_local: "Nur lokal", bkWhere_remote: "Extern", bkWhere_both: "Lokal und extern", bkSwitch: "Ohne neues Backup ausführen",
  planAdvanced: "Erweitert", skipBackup: "Ohne Backup ausführen", skipBackupHint: "Nur einschalten, wenn du selbst ein aktuelles Backup hast.",
  skipBackupWarnTitle: "Kein Backup vor dem Plan", skipBackupWarn: "Falls etwas schiefgeht, kann Housekeeper es nicht über ein Backup wiederherstellen. Entfernte Entitäten und Geräte sind dann nicht mehr zurückzuholen.",
  confirmPlanNoBackup: "Ohne Backup bestätigen", skipBackupStep: "Übersprungen: du hast gewählt, ohne Backup zu laufen", skipBackupDone: "Bewusst übersprungen ({date})",
  err_skip_backup_database: "Dieser Plan schreibt in die Recorder-Datenbank. Dafür ist das Backup Pflicht.",
});
Object.assign(TEXT.en, {
  bkTitleOk: "A backup is made first", bkSubOk: "Housekeeper only starts if it succeeds.",
  bkTitleOld: "Your last backup is {age} old", bkSubOld: "Housekeeper makes a new one first. Without a new backup you would be back at the old state.",
  bkTitleNone: "No backup is known yet", bkSubNone: "Housekeeper makes one first. Without a backup there is no way back for what is removed.",
  bkTitleSkip: "No new backup before the plan", bkSubSkip: "Undo by Housekeeper stays possible as long as nothing was changed. If it fails, only your last backup from {age} ago helps; what changed since is missing there.", bkSubSkipData: "Undo by Housekeeper stays possible as long as nothing was changed. Deleted history only comes back from a backup, and your last one is from {age} ago.",
  bkLast: "Last backup: {age} ago", bkNoneFound: "No backup found in Home Assistant", bkWhere_local: "Local only", bkWhere_remote: "External", bkWhere_both: "Local and external", bkSwitch: "Run without a new backup",
  planAdvanced: "Advanced", skipBackup: "Run without a backup", skipBackupHint: "Turn on only if you have a recent backup of your own.",
  skipBackupWarnTitle: "No backup before the plan", skipBackupWarn: "If something goes wrong, Housekeeper cannot restore it from a backup. Removed entities and devices cannot be brought back.",
  confirmPlanNoBackup: "Confirm without backup", skipBackupStep: "Skipped: you chose to run without a backup", skipBackupDone: "Skipped on purpose ({date})",
  err_skip_backup_database: "This plan writes into the recorder database. The backup is required for that.",
});
