// Texts for the purge entries in the cleanup journal.
Object.assign(TEXT.de, {
  purgeJournal: "Gelöschte Statistiken", purgeJournalHint: "Ältere Löschungen von Recorder-Resten, aus der Zeit vor den Plänen. Neue Löschungen stehen als Plan im Journal.",
  purgeEntry: "{removed} gelöscht, {skipped} übersprungen", purgeWithStates: "mit Zuständen", purgeBackup: "Backup {job}", purgeNoBackup: "ohne Backup", purgeByYou: "von dir", purgeByOther: "von anderem Benutzer", purgeError: "Fehler: {error}", purgeNothing: "nichts gelöscht", purgeNotDeleted: "Nichts gelöscht: {reason}", purgeChunk: "{n} ausgewählt. Ein Plan nimmt höchstens {max}: dieser Durchgang nimmt die ersten {max}, die übrigen {rest} bleiben ausgewählt.", purgeOpenCount: "Vorschau erstellen ({n})", planObjects: "Objekte ({n})", purgeStatesOn: "An (empfohlen): Statistik und {n} gespeicherte Zustände werden gelöscht.", purgeStatesOff: "Aus: nur die Statistik wird gelöscht. Die Zustände bleiben im Verlauf und können die Statistik neu entstehen lassen.",
});
Object.assign(TEXT.en, {
  purgeJournal: "Deleted statistics", purgeJournalHint: "Older deletions of recorder leftovers, from before plans. New deletions appear as plans in the journal.",
  purgeEntry: "{removed} deleted, {skipped} skipped", purgeWithStates: "with states", purgeBackup: "backup {job}", purgeNoBackup: "no backup", purgeByYou: "by you", purgeByOther: "by another user", purgeError: "error: {error}", purgeNothing: "nothing deleted", purgeNotDeleted: "Nothing deleted: {reason}", purgeChunk: "{n} selected. A plan takes at most {max}: this round takes the first {max}, the other {rest} stay selected.", purgeOpenCount: "Create preview ({n})", planObjects: "Objects ({n})", purgeStatesOn: "On (recommended): the statistics and {n} stored states are deleted.", purgeStatesOff: "Off: only the statistics are deleted. The states stay in the history and can let the statistics reappear.",
});
Object.assign(TEXT.de, {
  purgePreview: "Vorschau erstellen", purgePlanHint: "Daraus wird ein Plan unter Bereinigen: Vorschau, Bestätigung je ID, Backup, Nachprüfung.",
  reason_irreversible: "Nur per Backup umkehrbar.", reason_with_states: "Löscht auch die gespeicherten Zustände.", reason_entity_exists: "Eine Entität trägt diese ID wieder.", reason_not_orphaned: "Die ID ist keine verwaiste Statistik.", reason_in_energy: "Das Energie-Dashboard nutzt diese Statistik.",
  check_statistics_gone: "Statistik ist gelöscht", result_purged: "Gelöscht", undo_irreversible: "nicht rückgängig: nur mit dem Backup", confirmedSummaryPurge: "{count} Statistiken werden gelöscht. Vorher legt Housekeeper ein Home-Assistant-Backup an. Das lässt sich nur mit dem Backup zurücknehmen.",
  abort_recorder_busy: "Der Recorder war 30 Sekunden lang mit einer Abfrage belegt; nichts wurde gelöscht.", abort_still_there: "Die Statistik war nach dem Löschen noch da.", abort_states_left: "Nach dem Löschen gab es noch gespeicherte Zustände.",
});
Object.assign(TEXT.en, {
  purgePreview: "Create preview", purgePlanHint: "This becomes a plan under Cleanup: preview, confirmation per ID, backup, verification.",
  reason_irreversible: "Reversible only from the backup.", reason_with_states: "Also deletes the stored states.", reason_entity_exists: "An entity carries this ID again.", reason_not_orphaned: "The ID is not an orphaned statistic.", reason_in_energy: "The Energy dashboard uses this statistic.",
  check_statistics_gone: "Statistic is deleted", result_purged: "Deleted", undo_irreversible: "not undone: only with the backup", confirmedSummaryPurge: "{count} statistics will be deleted. Housekeeper creates a Home Assistant backup first. It can only be taken back with that backup.",
  abort_recorder_busy: "The recorder was busy with a query for 30 seconds; nothing was deleted.", abort_still_there: "The statistic was still there after deleting.", abort_states_left: "Stored states were still there after deleting.",
});

// Simplified Chinese texts; merged into TEXT.
Object.assign(TEXT.zh, {
  "purgeJournal": "已删除的统计",
  "purgeJournalHint": "较早删除记录器残留数据的操作，早于计划功能。新的删除将以计划形式出现在日志中。",
  "purgeEntry": "已删除 {removed}，已跳过 {skipped}",
  "purgeWithStates": "含状态",
  "purgeBackup": "备份 {job}",
  "purgeNoBackup": "无备份",
  "purgeByYou": "由你操作",
  "purgeByOther": "由其他用户操作",
  "purgeError": "错误：{error}",
  "purgeNothing": "未删除任何内容",
  "purgeNotDeleted": "未删除任何内容：{reason}",
  "purgeChunk": "已选择 {n} 项。每个计划最多处理 {max} 项：本轮处理前 {max} 项，其余 {rest} 项保持选中。",
  "purgeOpenCount": "创建预览（{n}）",
  "planObjects": "对象（{n}）",
  "purgeStatesOn": "开启（推荐）：统计数据和 {n} 条已存储状态将被删除。",
  "purgeStatesOff": "关闭：仅删除统计数据。状态仍保留在历史记录中，可能导致统计数据重新出现。",
  "purgePreview": "创建预览",
  "purgePlanHint": "这将在「清理」下生成一个计划：预览、逐 ID 确认、备份、验证。",
  "reason_irreversible": "只能通过备份恢复。",
  "reason_with_states": "同时删除已存储的状态。",
  "reason_entity_exists": "已有实体重新使用此 ID。",
  "reason_not_orphaned": "该 ID 不是孤立统计。",
  "reason_in_energy": "能源仪表板正在使用此统计。",
  "check_statistics_gone": "统计已删除",
  "result_purged": "已删除",
  "undo_irreversible": "未撤销：只能通过备份恢复",
  "confirmedSummaryPurge": "将删除 {count} 项统计。Housekeeper 会先创建 Home Assistant 备份。只能通过该备份恢复。",
  "abort_still_there": "删除后统计仍然存在。",
  "abort_states_left": "删除后已存储状态仍然存在。",
});
