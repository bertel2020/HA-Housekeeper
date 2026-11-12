# Changelog

> Deutsche Version: [CHANGELOG.de.md](CHANGELOG.de.md)

## 2.0.1 - 2026-11-12

### Changed

- **One selection bar:** Every list with a selection has the same bar.
  - “Clear selection” and a clickable count pill that shows only the picks; the actions appear from the first pick.
  - From three actions on there is an “Actions” menu (findings, inventory, exposure, auto-pause, object notes); the finding rows of an object page gather several actions in the same menu.
  - In the findings the page box sits in the column head, with “All n in the list”.
- **Dependencies:** The page shows which way a value flows.
  - Two blocks, “Where does it come from?” and “Where is it used?”, with a sentence per row, the origin as an indented chain, the location apart.
  - The graph goes up to four levels, the arrows follow the flow of data and the legend is always shown; a button on the “Dependencies” tab leads to the diagram.
  - Entities that an integration names in its settings or sub-entries count as used.
- **General interface:**
  - The filter “New since your last visit” keeps its text, now with the same text colour as the other filters.

### Fixed

- **Automations:** Runs that end on a condition by design are no longer reported as “never ok” (issue #49).

## 2.0.0 - 2026-11-11

Compared with 1.14.3. The pre-releases 2.0.0-beta.1 to beta.5 are summarised here.

### New

- **Findings by topic:** Every finding belongs to one of four topics: Down, Broken references, Failing automations, Unneeded. The impact (High to Info) says how urgent it is.
  - Topic tiles with an impact bar, a filter "Topic"; the overview and the findings page count objects instead of findings.
  - A missing target is a cause from the first reference on, the automations that refer to it are the follow-ups. Automations and scripts with repeated failures are findings of their own.
  - The column "Sicherheit" is now "Certainty", with four levels and a reason in the tooltip.
- **Since your last visit:** The findings page opens on what is new or got worse, for each user, plus the sensor "New findings". "Due" collects what wants another look.
- **Fix:** Every finding has a page of its own with four steps (Understand, Decide, Carry out, Check) and the ways of its topic.
  - Replace the target, remove the reference, catch the error, "Fix all n" for a missing target; the last error of an automation from the run log.
  - Anything is changed only through a plan with preview and confirmation. All flows show the same bar: Set up, Review, Confirm, Run, Result.
- **Cleanup as a tour:** From 25 open findings a guided tour in five stages goes through the list, from the most important to the quiet rest. Every answer can be taken back.
- **View "Simple" or "Full":** Under Settings you choose how much of Housekeeper you see; the choice applies to your user profile. Full is the interface as it was, a new installation starts in Simple. The view changes no rules.
- **Replace entities:** An assistant replaces one or several entities in one plan; "Replace a meter" and "Replace references" are part of it.
  - Five kinds per entity: Switch references, References and statistics, Statistics only, Statistics and ID, ID only. What is not possible for a pair is blocked and says why.
  - The new entity takes over history and ID by default only for real meters. The uses can be unfolded, and the old entity can be disabled or deleted afterwards.
- **Use in integrations:** Entities that an integration names in its settings or sub-entries (such as a room temperature sensor in a device's thermostat) count as certainly used; when the setting belongs to a sub-entry with exactly one device, the relation hangs on that device (integration, device, entity). They show up in dependencies, in the impact of a removal and in cleanup.
- **Helpers:** Housekeeper knows helpers (template, derivative, min/max …) better.
  - "Delete the helper" is a plan with a preview and a backup; Undo creates the helper again. Helpers can be exported to a file and imported again.
  - Plans and diagnosis name the sources of a helper; the replace assistant switches them too.
  - New quality rules for helpers and templates (off, hints).
- **Remove, disable, hide:** The page of a device offers "Remove device" or "Forget device locally", the page of an entity "Disable" and "Hide", each as a plan with preview and undo.
- **Change exposures:** Exposures for Assist, Alexa and Google can be removed by a plan (list, finding, row menu); "Stop exposing new ones automatically" and "Ask for the PIN again" are there too. Sensitive entities are taken back one at a time or together.
- **Credentials and access:** Both pages start with "To check", name the reason for a level and have more findings, such as admin reachable from outside without two-factor or accounts not signed in for a long time. Known cases can be marked "Intended".
- **Notes and rules:** An object note can end by itself. An effect line shows before saving what is hidden and when it comes back.
- **Backups:** A card on the confirmation shows the backup and its consequences; a plan can run without a new backup (not for recorder changes). Old Housekeeper backups can be tidied automatically every hour.
- **Batteries:** The list shows maker, model, integration, entity and area. "Rechargeable (I charge it)" is a type of its own with "Charge in …".
- **More languages:** French, Spanish, Portuguese, Italian, Slovak, Russian and Chinese (Simplified), in the interface, the setup and the messages. The translations are drafts; `docs/TRANSLATING.md` explains how to improve them.
- **Other:**
  - The sidebar entry "Housekeeper" can be hidden (Settings → Appearance); the panel stays reachable from the integration page.
  - AI access: new services `finding_fix_options` (read) and `finding_fix_plan` behind the switch "Fix findings" (off); only an administrator can confirm the plan in the panel.

### Changed

- **New names for the exits:** "Bekannt" is now "Ist so gewollt" (Intended), "Zurückgestellt" is now "Später" (Later), "Hidden" is now "False alarm", "Vermerk" is now "Object note", and in the exception rules "Ausblenden" is now "Do not report" (with a review date). Stored decisions and the service `finding_decide` stay as they are; "Intended" stays unlimited on the way from 1.x.
- **Menu in a new order:** Findings, Monitoring, Maintain, Operation, Security, Catalog. The exceptions have a page of their own, "Rules & goals" brings policies and maintenance goals together, old links lead to the new pages.
- **Dependencies, direction:** The relations of an object are in two blocks ("Where does it come from?", "Where is it used?"); every row says who does what to the object, in the Dependencies tab (two columns) and in the list; both show the origin as a chain integration → device → entity and the location (floor › area) apart from it. In the graph the arrows follow the flow of the data (device → entity → dashboard) and the columns have heads with their level, the legend explains arrows and levels, and the filter groups origin and usage.
- **Protection mode with three steps:** Watch, Change and Everything. "Quarantine only" is gone and is kept as "Watch".
- **Findings, handling:** The selection bar has an "Actions" menu; the rule for exactly one entity is gone (the object note covers it). Status, note and rule share one layout.
- **Plan:**
  - A plan holds 250 entities, larger selections run in rounds.
  - Blocked rows name the reason first and in red. For a meter swap with different statistic types, the row offers "Replace references" or "ID only".
- **Interface, general:** Actions per row are in the ⋮ menu, the tiles of "Fix" are the same size, step buttons and tabs have names for screen readers, default time limits are the same everywhere (365 days, critical objects 90).
- **Way back to 1.x:** Undo plans that change exposures (assistants, reload) first; 1.x does not know them and reports a conflict on undo. The new fields of the decisions are lost when going back.

### Fixed

- **Security:** Names and links from integration data are shown safely in the panel; the diagnostics download no longer contains titles and entity IDs, only counts.
- **Automations:** The last failed run of an automation and the run list in the comparison never found anything and do now.
- **Checks and scan:** The event log is also saved while running; memory and disk values at a threshold no longer flip every five minutes; the backup targets are queried every 45 instead of every 5 minutes; a scan with an unreadable source no longer forgets "first seen" dates.
- **Activity and tour:** Pages no longer skip entries, "Undo" applies only while the decision still stands as left, "Keep" no longer overwrites a note.
- **Exposures and reload:** A filter of another assistant no longer blocks the plan; an integration that takes long to load is no longer cancelled half way.
- **Other:** Typed thresholds stay until they are saved; battery and run data are loaded again after a new scan; the area suggestion compares with the sibling devices.

## 1.14.3 - 2026-11-08

### New

- **Note about version 2.0:** The overview points to the 2.0 beta once per browser (can be dismissed). Settings → Info keeps a link to the pre-releases.

## 1.14.2 - 2026-11-08

### New

- **Preview:** A preview opened from another page has a "Back to the choice" button. It drops the preview.

### Fixed

- **Undo:** With nothing selected, "Undo" reverts nothing instead of everything.
- **Rule "Unused label":** It now iterates the device objects instead of their IDs.
- **Storage page:** A kept folder count no longer breaks the page after a blueprint was added or removed.
- **Protection mode:** Setting the protection mode is limited to the session of the panel.

## 1.14.1 - 2026-11-04

### Fixed

- **Security:** Names and links from integration data are shown safely in the panel.
  - Area and entity names are no longer read as markup.
  - Links to documentation and repair hints only open with `http`, `https` or as a path.
- **Diagnostics:** The diagnostics download no longer contains integration titles or entity IDs, only their count.

## 1.14.0 - 2026-10-31

### New

- **Object note with an end:** An object note can end by itself once the object reports again.
  - A new note ends by itself by default.
  - The wait is a field of its own next to the option and is called “Wait”.

### Fixed

- **Flow of an automation:** An entity that only exists as a state (such as `zone.home`) is no longer reported as missing in the “Flow” tab.
- **New rule:** The cards of “For what” are no longer squeezed by the full-width input field.

## 1.13.0 - 2026-10-26

### New

- **Start times:** Housekeeper records how long Home Assistant took to start.
  - Under Storage & system the tab "Starts" shows the length of the last starts, per integration and with a tile for the last start.
  - An integration can be unfolded: how much slower or faster it was than usual, its entries, origin and the reason it did not load.
  - A start after a crash is marked, with the time Home Assistant had been down.
  - The start notice shows how long Home Assistant has been loading and unfolds the integrations that still load.
- **Auto-pause:** An integration that keeps failing to set up is paused and tried again after 1, 3 and 6 hours, then daily for up to 7 days. This applies to every data provider that is not excluded.
  - The page shows the switch, what is paused, what is collecting failed attempts and the rest folded away; a pause by hand is picked from the usual search with a confirmation.
  - A paused service stays a finding from where its outage began; the overview shows it under Maintenance.
- **Reliability:** The number of set-up retries of an integration is shown next to the episodes.

### Changed

- **Row menu:** Actions per row sit in the ⋮ menu instead of several buttons (marks, updates, plan journal, inventory, unreferenced, rule violations, object lists, reliability, integrations, changes, recurring problems, overview). Problems come first with a red edge.
- **Object page:** The head has one main button that fits the state, "Open in HA" and a menu.
- **General GUI:**
  - Settings: fields and controls sit on the right, fields share one width.
  - Rule violations: the reason is a quiet paragraph, the rename sits in one line with the recommended name.
  - Clean up: the tile "Unreferenced" shows the number of objects with statistics.
  - Storage & system answers at once on a first visit.
  - Names in the lists of the auto-pause page open the integration page.

### Fixed

- **Backup protection:** A backup that is still running is not reported as a failed last run.
- **Plan:** The expected end state names reloads, labels, areas, rewrites, enabling, hiding and deleted backups or automations.
- **Loops:** `turn_off` of a media player, light, switch, fan or climate can only make "off" fire; a list in `to` is read value by value.
- **General GUI:**
  - The head of a column with a row menu is empty instead of a tick-box symbol.
  - The status form of a finding is one block again.

## 1.12.1 - 2026-10-23

- **Conflicts and loops can be marked as known (issue #38):** In the table of the runs every entry has "Mark as known" and "Report again". A known entry stays in the list but no longer counts in the rating. The decision holds when the stage changes.
- **Marketplace:** From Home Assistant 2026.11 the texts say Marketplace instead of HACS.
- **General GUI:**
  - Recorder → Database: the "Measure space per entity" button sits in the head of the card of the largest tables.
  - Storage & system: the parts of "Others" stay folded and show their space as a bar.
- **Conflicts (issue #38):** Two automations that react to the same sensor with different states (`on` against `off`) or non-overlapping thresholds (`above: 5` against `below: 5`) are no longer reported as opposing.
- **Quality view (issue #39):**
  - Disabled automations and targets with a mark, an exception, a label or a deliberately switched-off entry are no longer rated as stale.
  - A run that ends at a condition inside the actions counts as a condition, not as a failure.
  - Commands that do not change the state (such as `snapshot`, `press`) no longer start a loop; unknown commands stay at "static".

## 1.12.0 - 2026-10-22

- **Space per entity and attribute (issue #36):** Under Recorder → Database the tables `states` and `state_attributes` unfold. On request Housekeeper measures in the background which entities take the space there, with progress and a stop button. For each entity it shows which attributes make up the space and which change so often that new attribute rows keep being made. Also reachable from the page of an entity and from the recorder load.
- **Repair hints can be switched one by one:** on the device page of Housekeeper there is a switch per hint under Configuration (orphaned entities, unavailable entities, broken references, scan problems, damaged database, backup problem, orphaned statistics). It takes effect at once.
  - New hints: backup problem (when backup protection reports a problem) and orphaned statistics.
  - A number per counting group sets from how many findings the hint appears (default 0: from one).
  - On by default are broken references, scan problems, damaged database and backup problem. Orphaned and unavailable entities and orphaned statistics are off. An installation that had the first two keeps them.

## 1.11.0 - 2026-10-20

### New

- **Labels:**
  - The label `housekeeper_keep` on a device or entity works like the mark “Do not remove”: it blocks every cleanup step but hides no finding. In Home Assistant it can be set on several objects at once.
  - Settings → Exceptions has a block with the three labels `housekeeper_keep`, `housekeeper_ignore` and `housekeeper_critical`: what each does, whether it exists in Home Assistant and how many objects carry it.
  - The inventory can be filtered by label.
- **Entities the integration no longer provides:** They are recognised as orphaned instead of "unavailable", YAML entities too, after the same wait as an outage. They can be removed straight away, without quarantine, but with preview, backup and restore, in Cleanup too; on the first day the preview asks whether the entity is really gone.
- **Duplicates:**
  - The reverse case is recognised as well: the old `sensor.x` is left over, the new `sensor.x_2` works (same device or same name).
  - When replacing, the working entity is filled in; suggestions for missing references open the replacement with that target.
- **Exceptions:** Rules by integration also cover the "integration cannot be loaded" finding, such as a printer's entry while the printer is off (discussion 28).
- **Entity “Activity”:** Shows whether Housekeeper is scanning, running a plan, waiting for Home Assistant to start or idle; fits on a dashboard next to the “Start scan” button.

- **Suggested marks:** A card above the findings list gathers entities that fail or lose their value regularly (in standby, say), those of one device that fail together in one row with the detected time window; the mark goes on these entities, the others stay watched. “Accept” sets the mark “Offline on purpose”, “Accept all” sets them all after a question. Time without a value counts for this, but not for the availability.

- **Database size on MariaDB/MySQL and PostgreSQL:** The size is asked from the server (issue #36), so growth per day and the retention hints work there too. MariaDB/MySQL reports an estimate. A new list shows the largest tables; on SQLite it is measured once a day.

- **Backup protection:** If you back up outside Home Assistant (for example with Docker), you can say so. The checks of Home Assistant backups, the problem in the overview and the event are then left out; space, the restore test and Housekeeper's own backups stay.

### Changed

- **Operation:**
  - Automation runs: figure and hint of a finding stand apart; “for one entry” instead of “for 1 entries”.
  - Reliability: states in words (“Retrying setup”); “All” counts every unstable entity and the list says it shows the most noticeable; “Mostly at 03–05 h” instead of “03–05”; the integrations table fits the window.
  - Storage & system: categories named in words with their share of the space in use.
  - Home functions: tiles per state, the description as plain text, the title only once.
  - An “All” tile is no longer marked as a filter anywhere; rows that cannot be picked say why.
- **Maintain:**
  - Backups: “3 days ago” instead of “3 days”; a remote target that the newest backup did not reach is named; “To check” names problems and hints; the sizes of the last backups are a column chart with tooltips.
  - Maintenance: tiles with nothing open say “nothing to do”; the tab is called “Goals”.
  - Batteries: unavailable batteries are listed and counted; low ones have a fold of their own, “Low now”, in the forecast; “now” instead of “below limit”; “Type missing” is a button everywhere.
  - Policies: empty columns go away, “Show hidden” sits below the list, rows that cannot be ticked say why.
- **Clean up:**
  - The page is called “Clean up” like its menu entry; the plan button reads “Create preview” everywhere, column and filter of the reasons “Reason”.
  - The text on orphaned statistics says what the tab does and points to Repair → Replace a meter.
  - Selection buttons appear with the first tick; dates as on the findings page; a statistic in the Energy dashboard says why it cannot be picked.
  - On a phone the rows are compact and the bar of every list is ordered.
- **Overview:**
  - “Maintenance” is a group of its own on the to-do card, set apart from “Urgent”.
  - The most important findings say what they are and since when, with the level as a chip.
  - In “Hints”, rows with 0 are quiet; “Unused” reads “Unused automation”, “Not used” reads “Not referenced”.
  - The hint on outage levels wraps instead of being cut off.
- **Outages on the overview:** Only outages at the level high are urgent; the others stand as “Further outages” among the open rows. An outage chain counts once, a device below an integration that is down not on top.
- **Recorder → Database:** The largest tables are a sortable list with names in words and their share; every database finding is a fold with its level (with a count for missing hours), holding the text, “What to do?” and the affected sensors; “Check database” sits in the page bar, its result as an “Integrity” tile.
- **Findings page:**
  - The tiles always count the open findings, whatever status is chosen, and all nine reasons always stand there (a quiet 0 without open findings). A click on a tile shows the open list; with another status chosen, a note above the list says so.
  - “All findings” stands on the left over both rows and names the follow-ups of outages inside the tile; faults and tidying up have a row each, all tiles of the same height. The group heads read as filters.
  - In the list, an object with a single finding is one row, the “Finding” column names the reason in words before the rule, and the head of an object selects all its findings.
  - On a phone the rows are compact.
  - The grouped list pages by the rows it shows, also with heads open; the groups under “Done” start folded.
- **Overview tiles:**
  - Next to the ring stand “Checked objects”, “Findings”, “Faults” and “Tidying up”, as on the findings page. “Findings” counts every open finding; “Unavailable” is gone.
  - On the findings page, the heads “Faults” and “Tidying up” filter the list to the whole group; the two overview tiles lead there.
  - The curves show at most the last 7 days, and number and curve always count the same.
  - Title, number and curve sit on the same lines in every tile of a row, also when one tile has more text.
- **State of the house:**
  - The ring shows a state in points out of 100 instead of a share in percent. Every object with a finding takes off once, by its worst level: high 2, medium 1, low 0.5, info nothing. The follow-ups of an outage count as objects of their own too.
  - The colour no longer comes from the number but from what is open: red for urgent topics, yellow for other open topics or objects with high or medium impact, green otherwise. A label next to the ring says it in words.
  - The “Checked objects” tile shows the same base as the calculation, and “X of Y with a finding” matches the sum of its rows.
  - The history line drops once at the switch, because older days are still calculated with the old weights.

- **Outages in standby:**
  - A device whose entities all lost their value (in standby, say) counts as "Device is down completely", no longer only when they are unavailable, with a single entity too. Its entities are listed as follow-ups below it, and one mark on the device hides them all. Disabled and orphaned entities and those that never had a value do not count.
  - A mark on the whole device is offered only when it is down completely, in the bulk action “Set a mark” too. When only some entities fail, the mark belongs on those (forum).
  - A device that is down because its integration is counts as a follow-up, not as a second problem. A mark on an integration or app also hides the outages of its devices and entities while it is down.
- **Findings list by object:**
  - In the “Grouped” view every finding stands below its object: entities with a device below the device, everything else below itself, from one finding on, with all kinds of findings below it. Causes stand above (app › integration › device, missing target › automation).
  - The head shows a summary, the highest severity, certainty and age as a span, and a mark; the groups stay with filters and search. “One by one” shows every finding as a row of its own.
  - The bar keeps status, view and “Open/close all” apart; “Causes only” is a type filter, and the line above the table says “N findings on M objects”.
- **Interface:**
  - In the cause diagnosis, the integration, device and working entity open their page on click.
  - In the header of the detail page, integration, device and area are links.
  - The row menu of a duplicate finding opens the working entity.
  - In the "Actions" tab, the step that resolves a finding is the first button in that finding's row (for example "Plan to remove" or "Replace by the working entity").
  - Findings list: rows with and without a fold arrow line up; “Set a mark on the device” is in the ⋮ menu of the cause instead of a button of its own; “Open” and the history line of the overview count grouped like the tiles; the row menu says “Add a logbook entry”, set apart from the decisions.
  - Suggested marks: a bar with the sum and “Mark all”, per row a small “Mark” button and a ✕ for “Do not ask again”, shorter text.
  - The line under the navigation shows AI access as an item of its own instead of a separate strip, puts the last plan and undo into one item, moves red and yellow to the front and names the protection mode ("standard") and the scan ("Scan complete") more clearly.
  - The tiles of the findings list show the grouped count as the big number (follow-ups of an outage hang on their cause) and the total with the follow-ups below it; the history line counts the same way.
  - The expected end state of a plan says when the recorder deletes the states left behind and that long-term statistics stay (or that everything stays when the automatic purge is off); "1 entity" instead of "1 entities (0 devices)".

- **Home Assistant quality scale:**
  - Every option in the options dialog explains what it does.
  - The home function sensors and the event entity have translated names, the event types translated states.
  - The user guide describes how to remove Housekeeper and how to troubleshoot and has example automations.
  - The user guide gives the correct default of 6 hours for the scan interval in the options.

### Fixed

- **Cleanup and labels:**
  - Under Cleanup → “Disable devices”, devices with the “Do not remove” mark, the label `housekeeper_ignore` or an exception rule no longer appear; devices with no entity at all (such as a Bluetooth proxy) are marked “No entities” (discussion).
  - The label `housekeeper_ignore` on a device also hides its findings and those of its entities, no longer only for entities and automations.
- **Priority:** "Never triggered" and "Not triggered for a long time" are no longer "High" for automations that control something critical (alarm, flooding) (discussion 33).
- **Inventory:** Automations, scripts and scenes appear once and are counted once, no longer also as an entity; the detail page links both (issue 34).
- **“Start scan” button:** It is no longer “unavailable” during a scan, so Housekeeper no longer reports it as flapping itself (issue 35).
- **Interface:**
  - The row menu (⋮) is no longer cut off at the edge of the card (issue 32).
  - Overview: the “System” tile linked with “Details in Recorder” but leads to Storage & system; both tiles now just say “Details”.
  - Overview: the calculation of the state opens from “Info” below the ring instead of “How does this come about?” in the text line.
  - Jump from “Outages” or “Further outages” of the overview: the filter is named after the row, and the list head says “19 outages with 496 findings”, counted as in the overview, instead of every object below.
  - Singular for outages: “1 follow-up”, “explains 1 more finding”, “1 entity affected”.
  - Grouped findings list: every head starts folded, also when a filter leaves only a few findings.
  - Grouped findings list: pages count the top-level heads; an open head shows everything below it on the same page. Every list also offers 250 per page.
  - Suggested marks: a list like the others, with columns, sorting, boxes and a selection bar (“Mark”, “Do not ask again”); one row alone through the ⋮ menu instead of a button and ✕ per row.
  - Incidents after updates: a list with event, time, findings and watch; a row unfolds its details. The findings of an incident no longer stand twice in the card, a button narrows the findings list to them. The watch shows its objects as small tables.
  - Tiles of Maintenance and Clean up: one status pill under the title each, with its noun (“2 updates”, “5 entities”) or a green “Nothing to do”; no extra line below the hint.
  - After setting a status (known, snoozed, hidden, show again) the findings list loads again; an outage marked as known leaves the list at once.
  - The ⋮ menu of a finding is the same for open and decided findings; only its top reads “Set status …” or “Show again” and “Change status …” (or the way to the mark, rule or label). Opening a menu closes any other open one.
  - Status for an outage: the form says that the entities behind it then count one by one and offers a mark instead.
  - Marks: an object that has run for 30 days without an outage asks “still needed?” in the list of marks (with a filter).
  - Statuses whose finding is away right now (for example because the device runs again) show as “resting” in the list of statuses, with “last seen …”, “still needed?” after 30 days and “object is gone”; the list is a table with a selection and “Remove decision”.
  - Reminders: “Done” stays in the row, “Edit” and “Delete” sit in the ⋮ menu; several can be marked as done at once through boxes.
  - Batteries, probably not replaceable: proposals are picked with boxes and confirmed with “Confirm (n)” instead of “Confirm all” with a question bar; “It is a battery” sits in the ⋮ menu.
  - Detail page, History: the plans are a small table like the Journal (date, state, result, follow-up); a click on a row opens the plan.
  - Home monitor, form: the type of the search results is a row of chips like the status chips of the findings instead of buttons.
  - Settings → Labels: copy icon right at the name, counts in words (“on 1 device, 5 entities”), the how-to once, effects in calmer type with indented wraps.
  - Jump from “New critical findings”: the filter is named after the row, and the list head says “n findings on m objects” instead of “n of all open findings”; the same for the filter “After updates”. “Login needed” no longer names follow-ups on the overview that its jump does not show.
  - "Open in HA" leads to the device page for scenes without an editor; "Open entity" is offered for scenes too.
  - For a device that is down, the diagnosis shows that all its entities are unavailable instead of “active and provides entities”; the risk row says it is about removing.
  - Recorder → Database: the page loads when opened directly or reloaded too; the export is there at once; growth shows its sign and its share of the size; series in the findings open their page; “What to do?” is folded; the check status names damage it found; the tiles at the top are no longer cut off on a phone.
- **Backup protection:**
  - Backups made by other tools (for example Google Drive Backup) show as “Other tool” instead of “Manual” in the table, because Home Assistant cannot tell whether they were scheduled.
  - The backup Housekeeper makes before a change no longer counts as the “Latest backup” or for targets, size or retention, even when it holds the database.
  - The targets of a backup show readable names (“Local”, “Network storage: …”, “Google Drive”) as pills instead of IDs; the account part is left out.

## 1.10.2 - 2026-10-19

### Fixed

- **Scan:**
  - A config entry whose title is a number made the first scan fail (“'int' object has no attribute 'lower'”).
  - A scene that lists something other than names no longer makes the scan fail; on an error the debug log says where it happened.
  - “Start scan” no longer stays unavailable after a scan.
- **Backup protection:** Backups made by other tools (for example Google Drive Backup) are recognised and count for the checks.

### Changed

- **Diagnostics:** The download now holds the flags of the backups (no names), which helps with reports about backup protection.

## 1.10.1 - 2026-10-19

### Fixed

- **Inventory and detail page:** If the reply holds a value Home Assistant cannot send as JSON (“Invalid JSON in response”), the page still loads (for example an unusual attribute of an entity); the log names the affected places.

## 1.10.0 - 2026-10-18

### New

- **AI access:**
  - New tab Settings → AI access, off by default: programs and AI agents that can call Home Assistant services (for example ha-mcp) read Housekeeper through the services `status`, `findings`, `object` and `audit`.
  - A second switch “Change the list” allows `finding_decide`, `mark`, `note_set` and `undo`; only Housekeeper's own lists change, never Home Assistant.
  - “Switch off automatically” uses chips (never, 1, 8, 24 hours).
  - Limits against loops: by default 200 changes in 5 minutes and 120 reads per minute, adjustable in the tab.
  - A log shows every call with user and result, and changes can be taken back there. It is a standard table like the other lists: search, filter by kind, sorting, pages, export (CSV, Markdown, JSON) and expandable rows with the parameters. Administrators only, never secrets.
- **Vacation mode:** An entity of your choice (e.g. `input_boolean.vacation`) turns on rules “only in vacation mode”. Also rules for single devices and entities, a grace period after the vacation (default 24 hours) and a bar while something is held back.
  - If nothing is chosen and a helper like `input_boolean.urlaubsmodus` or `vacation_mode` exists, it is offered as a suggestion in the field and counts once saved.
  - A calendar entity can get a keyword: an event with “Vacation” in its title in your normal calendar then switches the mode on, even while other events run. Without a keyword every event counts.
- **Exception rules:** Under Settings → Exceptions you leave out objects by area, label, integration or type (e.g. area “Storage”, all `media_player`). A rule hides their findings or reports an outage only after a number of days you set.
  - The rules sit in a table with a switch “Always” and “In vacation mode”, and below it the vacation mode.
  - The kind “All types” (preselected) finds areas, labels, integrations, devices and entities at once; saving makes one rule per kind.
  - The “Exceptions” tile in the settings shows the number of rules, the number of hidden findings and the vacation mode: on, off or “not set up”.

### Changed

- **HACS and Marketplace:** From Home Assistant 2026.11 HACS is built in as “Marketplace”. Housekeeper reads installed integrations, updates, archived and removed repositories from both.
- **Open in HA:** For entities with a device the button opens the device page instead of the whole entity list.
- **Links into Home Assistant:** All jumps into Home Assistant (apps, integrations, HACS, users, cloud) now open in a new tab instead of the current one.
- **Protection mode:** The protection mode names the effect instead of the level: “Everything allowed”, “No irreversible deletions”, “Quarantine only”, “Read only”.
- **Settings, tiles:** The tiles come in a new order (protection mode, exceptions, scan and messages, AI access, appearance, info) in three columns. Every tile shows its state, and the edge stripe follows it (e.g. AI access: off grey, reads green, changes amber).
- **Interface, error messages:** Errors appear in the same box with an icon everywhere (pages that do not load, and forms). The narrow error line in the save bars is invisible when there is no error.
- **Updates:** The pending updates sit in the usual table with search, sorting, filter by area and pages.

### Fixed

- **More info:** Closing the “More info” dialog keeps the panel on the detail page instead of jumping back to the list.
- **Copying:** The copy buttons (e.g. “Copy details for a bug report”) also work without HTTPS and report a failure instead of “Copied”.

## 1.9.0 - 2026-10-17

### Changed

- **Maintenance, backups:**
  - "Backup protection" and "Tidy up backups" are one "Backups" tab; the tidy-up is folded at the bottom, and the "Housekeeper backups" line leads there.
  - On top are a verdict (Reliable, Look first, Problem) and four figures; the check lines are sorted into four groups.
  - New checks: the content of the newest backup (failed apps or folders, missing database), the age of the copy on each external target and room for the next backup.
  - A strip shows the size of the last backups, so growth shows early.
- **Journal:**
  - The Journal has tabs: "Plans" and "Removed devices" (so far under Maintenance, now with a jump to the plan); older deletions of statistics are a third tab there when there are any.
  - A load error is shown instead of "No preview yet", and the page has "Refresh" and a time stamp.
  - The hint names the right limits (plans that ran up to a year, at most 300).
- **Maintenance, updates:**
  - The "Update preflight" tab is now called "Updates": a verdict (Ready, Look first, Stop), the check lines and the list of open updates, grouped into system, apps, HACS and devices, with a jump to Home Assistant.
  - The backup is judged like the backup protection does (schedule, last run); there is a new "Free space" line; HACS updates that HACS cannot install are marked.
  - The overview has an "n updates open" line (without effect on the ring).
  - A button checks the configuration (Home Assistant's own check, only on request); if it is invalid, the verdict says "Stop".
- **Less CPU load:**
  - The timing and the code of the background work are optimised.
  - The analyses of the recorder database run less often and spread out, the queries do less work (finished days are calculated only once, needless searches are skipped), and on slow systems the scans after outages are spaced further apart.
- **Storage & system:** The page loads faster: the walk over the folders runs beside the Supervisor query instead of after it, the disk use by category is reused for a few minutes like the folder sizes (refresh reads it again), and on opening the sizes read last show at once and are renewed in the background when due.
- **Findings, login needed:** An integration that asks for a new login is a finding ("Login needed", at least medium) with its affected entities as follow-ups, even while it stays loaded. It appears within about a minute and goes away after the login. On the overview it is a row of its own at the top of "What do I have to do?".
- **Apps & integrations, open in Home Assistant:** A collapsed info row above the list shows the devices found that still wait to be set up and the integrations that want to be reconfigured. It is a hint, not a finding, and is left out when nothing is open.
- **Reliability:**
  - Integrations that were down the whole period are listed first as "Down" (instead of without a value at the end) and have a tile of their own.
  - The tile "Avg per integration" counts each integration once and leaves out those down all the time; the column is called "Shared outages", and integrations with fewer than three entities say "too small" instead of 0.
  - The tiles and filters "Login needed" and "Not loaded" are gone; the login request stays a hint in the row and leads to the finding.
  - New window "30 days" (as with the house functions); the footnote names the color limits (green from 99.5 %, yellow from 95 %) and says that the day strip of a house function colors by duration.
  - The detail page of an integration shows figures, a day strip of the outage days (as with the house functions), the outage periods with start, duration and number of affected entities, and names the house functions that rely on the integration; the comparison names its unit (percentage points).
- **Credentials:**
  - Integrations that ask to sign in again carry a "Login needed" mark and have a tile of their own, as do disabled integrations that still hold credentials; more field names are recognised as credentials (such as cookie, session id, one-time code).
  - New "Accounts" tab with each user's role, two-factor and last login, an "Admins without two-factor" tile, and a "Long-lived tokens" tab with name, account and age; the tiles sit in rows of equal size.
- **Overview, inventory status:** Objects with a mark (e.g. “Offline on purpose”), including the entities of a marked device, sit in their own row “Marked (expected)” and no longer count as “Problematic” (issue 25).
- **Interface:**
  - The start notice is a compact card: four steps in one track, “38 of 41 integrations loaded” with a bar and the waiting time beside it, the names of the integrations still loading and, during the scan, the current phase.
  - It updates by itself (every 3 seconds) and goes away as soon as the final findings are in.
- **Exposure:**
  - Cameras, sirens, valves and doors now count as sensitive too.
  - New warning when Google Assistant may open locks, alarm panels or gates without a PIN, and a note when new entities are exposed to Alexa or Google automatically.
  - Another note names AI conversation agents and the MCP server that may control Home Assistant through Assist and so hand the Assist exposure to a language model or connected programs.
- **Access & data flow:**
  - More integrations are recognised, such as Bluetooth and Thread as radio, Frigate and UniFi Protect as camera, ESPHome and Matter as network; Ollama counts as local.
  - Integrations from HACS carry "custom code, full rights" and are at least medium risk.
  - For apps: protection mode off (high risk), open ports on the host and a column for the origin (official, community, local).
  - New "Reachable from outside" tab: Nabu Casa remote access, tunnel, proxy, DynDNS and VPN apps, the MCP server and open webhooks.

### Fixed

- **Interface, corrections:**
  - A blueprint opens its own page like other objects (with "Back to Maintenance" and a header card) instead of under the Maintenance tiles.
  - In the reminders list the expand arrow sits to the left of the name instead of above it.
  - Maintenance: the subtitle and hint name the tabs correctly, every tab can be found by search, the number on the Blueprints tab is there when the page opens, it says "1 note" and "3 notes", and the Maintenance goals tab shows a load error and has "Refresh".
  - The table "All counted runs" uses the full width like the other lists.
  - On "Access & data flow", "How is this counted?" sits inside the list like on the other security pages instead of in a card of its own below.
  - After a page reload the start notice no longer shows the old “5 minutes” for a moment but waits for the current figure.
  - The one-minute buffer no longer starts over because an integration loads briefly.
  - The “Observation after update” line now sits on the overview below the health ring instead of in the page header.
  - The “changes nothing by itself” info notice at the top of the findings page is gone; a short explanation now sits under “About Housekeeper” in the settings, and the “Mode” row is dropped there.
  - On narrow screens (phones) rows with buttons now wrap instead of squeezing the text into a one-letter column (e.g. the notice about outage levels on the overview).
  - Rows of the blueprint list can be clicked and open a detail page with overview, inputs, usage (with the values set there) and file data.
  - A maintenance goal leads to the matching list with the filter set (for example "Broken references" to the findings of that kind).
  - The availability of a house function shows its figures as tiles and a day strip across the full width with an axis; "1 incidents" now reads "1 incident".
  - In the day strip of the availability, a day with less than 1 % of impaired time is amber instead of red; the tooltip names the duration and a legend sits below.
  - The page of a house function is more compact: header, figures, day strip and the assigned objects share one card, scan and check sit in one line under the name. The objects are a table with pages (10 per page to begin with).
  - Editing a house function is tidier: general settings, objects, search and suggestions share one card, suggestions are “+” buttons, remove is an X. “Delete” is the soft red button as everywhere else (notes too). “Save” stays enabled and says what is missing.
  - Recorder: the tabs are called "Write load" (how often things are written), "Storage use" (how much space each entity takes) and "Database".
  - Recorder: "Recommended" for exclusion is decided by the same rule in write load and storage use (used nowhere, no statistics, at least 100 rows in the last 24 hours); before, an entity could be recommended in one tab and not in the other.
  - Recorder, database: size, growth per day, retention and "Purge automatically" are tiles above the list instead of a line of text below; what cannot be measured (for example with MySQL) stays as a short note.
  - Recorder, write load: new window "30 days" next to 24 hours and 7 days.
  - Hint texts on conflicts, backup targets and statistics successors no longer say “guess” where “possible” already says it.
  - Runs: the “How this is counted” footnote now names the limits of the notes (errors, never succeeds, overlap, no effect, very often, long runs) with the numbers from the backend.
  - The short overview of an integration (“Known”) shows “New login open” instead of “Loaded” when Home Assistant asks for a new login.
  - Reliability and write load: if the recorder keeps fewer days than the chosen window, a note says the numbers reach back no further.
  - Apps & integrations: the arrow that unfolds a row sits beside the name instead of above it; all names start on one line.
  - HACS: Housekeeper now reads every installed repository (cards and themes too) and learns from Home Assistant's repairs which ones HACS took out of its list.
  - Apps & integrations: new “HACS” tab with every installed repository (integrations, cards, themes), version, open update and a note when HACS took a repository out of its list or it is archived. A row opens the repository in HACS.
  - HACS: if a repository was removed from HACS, “What do I need to do?” gets a row for it, the integration page shows the reason and the HACS tab has a guide with a link to the repairs. An ignored repair shows as “ignored” in the tab.
  - Exposure, data flow, credentials and runs show a number in the menu when there is something to look at (the scan counts it).
- **Access & data flow:** Integrations whose trackers only report presence through a router or Bluetooth (such as the FRITZ!Box) no longer count as "location" with a high risk but show "presence on the network".
- **Exposure:** Alexa and Google Assistant switched off in the Nabu Casa settings no longer count as "exposed" and raise no findings; their tile says "switched off in Nabu Casa".

## 1.8.2 - 2026-10-16

### Changed

- **Interface, buttons:** Buttons that create a plan are named alike, “Create preview (N)”; the ones that delete are “Prepare deletion (N)” and softly red.
- **Interface, plan preview:** “Delete from the recorder” goes straight to the preview. The choice “Also delete the stored states” is a highlighted switch at the foot of the preview (on, only for plans that delete statistics). “Expected end state” is highlighted, names statistics and raw data separately and shows the “remain” lines only when they are not 0. The “acknowledged” box is gone: the confirm dialog is the confirmation. “Cancel” drops the preview completely and does not keep it in the journal.

### Fixed

- **Startup, warm-up:** It ends one minute after no integration is loading any more (5 minutes at most) instead of always running 5 minutes. The banner names the number of integrations still loading or the safety buffer.
- **Interface, corrections:** “Open in HA” (findings page, HACS buttons) opens Home Assistant in a new tab instead of the same one. Closing the “More info” dialog keeps you on the page you were on. “Merge selected” is disabled for more than 10 plans (instead of failing with a server error).

## 1.8.1 - 2026-10-16

### Changed

- **Interface:**
  - Findings: “Open entity” in the “⋯” menu and on the detail page opens Home Assistant’s “More info” dialog (“Open in Home Assistant” is now “Open in HA”). The page says at the top that Housekeeper changes nothing by itself (can be closed).
  - Findings page: The tiles count everything including follow-ups and name the follow-ups beside it. The chips “Grouped | One by one” replace “All one by one”. “Only causes with follow-ups” means the same in both views. Lists outside the findings page no longer show selection boxes. The “Unavailable” tile of the overview opens the findings filtered.
  - Plan: A new plan opens on a page of its own with “← Back to …” and goes straight into the preview. Four stages (review, confirm, run, result) in one track, the stage that is on is open. When the protection mode forbids the plan, the page says so before you confirm and links to the setting.
  - Journal: “Delete selected” removes several previews at once (plans that ran stay). Previews that were never started are removed by themselves after 24 hours.
  - Tables: The exact timestamp sits below “1,119 days ago” in small type (hidden with compact rows).
  - Cleanup: The “Not used” tile comes last and calls itself a hint.
  - Logbook: “Add to logbook” in the “⋯” menu of a finding; objects of the watch without a finding get the same menu.
  - Watch after updates: New repairs show title, severity and link. The “Fine again” groups no longer show today’s state. Events of one kind that follow each other closely are one entry with their count.

### Fixed

- **Interface, corrections:** Ticking “acknowledged” in a plan clears the error message, and “Confirm” is locked with a hint while no step would run. Selection boxes show only in the findings list, where the bar for the actions is. Objects without a finding have the same row menu, and “Add to logbook” no longer shares a name with “Set a mark”. The watch groups about the past no longer show findings with today’s state.
- **Scan with an unusual script:** When Home Assistant cannot read the references of a script or automation (for example because of a dict in an `entity_id` list), Housekeeper uses only that object's configuration and warns in the log instead of aborting the whole scan (issue 19). The warning about `device_registry.devices` in the log is gone (issue 22).

## 1.8.0 - 2026-10-15

### New

- **State when an update starts:** When an update of Home Assistant, the operating system or the Supervisor begins, Housekeeper scans at once. The watch afterwards compares with that state instead of the last scheduled scan.

- **Repairs after updates:** The watch after an update also reports repairs that have appeared since, and counts them as worse.

- **Backup list with details:** The list shows up to 20 backups (10 per page, selectable) with type (automatic, manual, by Housekeeper) and contents. A row unfolds: name, HA version, database, apps, folders, size per target and failed parts.

- **State as the share of objects in order:** The status now counts objects instead of points. The starting value is the number of rated objects, each object with a finding takes off by its worst level (high fully, medium half, low a fifth, info nothing), follow-ups of a cause do not count extra. There are no caps any more, every fix counts. The card “How is this number made?” shows, for example, “1575 of 2000 in order”; the ring and the curve show the share. The history of the state starts afresh.

- **Outages by duration:** Unavailable entities, devices, integrations and apps become a finding after 15 minutes and rise with their duration (info, low, medium, high). Info and low appear only on the findings page; the overview, the sensors and the repair hints count from medium on. The setting “Unavailable after days” is replaced by four adjustable thresholds (an old value is kept until you save the new ones). During an outage Housekeeper scans additionally at the thresholds without changing the history. Entities are therefore reported much earlier than the former 7 days.

- **Rating and hints:** The detail page shows the rating of a finding with its reasons and the next level. If an object fails regularly, the finding names the usual time of day and suggests a mark with a time window.

- **Findings page:** An explanation behind the heading, tiles in three groups that count like the list (the curves too, without follow-ups), a severity for every finding (info takes nothing off), follow-ups indented under their cause, the size of the view in the selection row and the filters “All one by one” and “Causes with follow-ups” with their counts. The tab “Technical” shows labels for all objects.

- **After updates and restarts:** A card on the findings page shows what began after an update or restart, one row per incident; updates close in time form one incident. The watch after a system update sits in the row of its incident, with its verdict (Running, Worse, Stable), apart for what has stopped working since and the findings that began with it. It starts only for updates of Home Assistant, the operating system and the Supervisor, can be ended early (after a confirmation; it is then judged by the measurements so far), and the band in the page head leads to it. A filter shows only the findings that began with an update.

- **Scan every 6 hours:** The default for the automatic scan is 6 instead of 24 hours (adjustable; a value you set yourself stays). The history keeps one point per day.

- **Protecting the database:** Before deleting in the recorder, Housekeeper checks the database fully (also on request and after deleting) and reports damage as a finding and a repair hint, pointing to `REINDEX` and the backup (issue 12). Hints on databases set aside, little disk space and unclean shutdowns are added; plans wait for a calm recorder. Nothing is deleted by this.

- **Safer plans:** The backup before a plan is verified and named. Outdated previews are marked and can be renewed, large removals show a clear note, and too many Housekeeper backups are reported. An unreadable saved file only makes its own part start empty.

- **Export everywhere:** The recorder page has an export button (CSV, Markdown, JSON) for everything a tab shows. All lists now use the same export menu instead of the download icon.

- **Seven new color schemes:** Aurora, Honey, Lagoon, Emerald, Frost, Midnight and Olive, each in light and dark. The scheme tiles are smaller and "Readability" now sits on the right.

### Changed

- **Update preflight only for before:** The manually saved starting state and the comparison afterwards are gone. The card checks the state before an update and says below what happens afterwards: the watch after updates takes over the time after.

- **Maintenance window removed:** The experimental maintenance window under Maintenance, off by default, is gone. If you had switched it on, its saved state is dropped. After an update, the watch shows what has failed since.

- **Interface:** Fixes and small improvements to lists, dialogs, labels and handling, an open panel that picks up scans from the background by itself (the overview used to show old numbers afterwards), among them the tiles of the findings page (in two rows on wide windows, all equally high and wide), the column picker of the lists (boxes in one line at the right edge), the threshold cards in Settings (grouped, uniformly built, with a “Default” link), the events for your own automations as a table with a copy button, the maintenance goals (only under Maintenance, no longer duplicated in Settings), the list of the latest backups (arrow next to the date, details aligned), the settings with four tabs instead of seven (Appearance, Scan and messages, Protection and exceptions, Info); saving the thresholds keeps the page open instead of jumping to the Home Assistant dashboard and the readability of incidents.

### Fixed

- **Unredeemed confirmations:** Expired confirmations are now forgotten and no longer pile up in memory (issue 18).

- **A confirmation belongs to the administrator who gave it:** Another administrator can no longer redeem it, and the history always names the one who confirmed and started (issue 17).

- **Deleting statistics only through a plan:** An old command deleted orphaned statistics without a preview or confirmation. The panel no longer used it; it is removed (issue 16).

- **Backup check:** Backups of single apps, such as those made before an app update, no longer count as backups of Home Assistant.

## 1.7.0 - 2026-10-14

### New

- **Home functions:** Group important functions of your home from directly selected entities, devices, automations, scenes, scripts, integrations and apps/add-ons. The shared object search groups results by type and suggests known dependencies; only explicitly added objects are monitored. Entities support update deadlines, minimum values and a grace period for unavailability. The compact editor has a description field that grows with its text, previews the latest scan evaluation and lets functions be temporarily disabled. The page distinguishes confirmed faults, check gaps, healthy and disabled functions; the overview highlights active problems and otherwise names the function impaired last. State changes are available as HA events and an event entity, with one sensor per function whose attributes also give the last fault, incidents, downtime minutes and availability of the last 30 days. Persistent HA notifications are configurable per function. Assigned objects are clickable, also while creating and editing. Each function has a history of state changes and edits (with search, filter and paging, also plans for the objects; quick back and forth is folded into one line) and shows the availability of the last 30 days with incidents and one square per day; the retention (1 to 365 days, default 30) also applies to the scan history and is set in Settings.

- **Mark with a time window:** A mark such as “Offline on purpose” can apply only at fixed hours or in the dark (position of the sun from Home Assistant), with a grace period after it (30 minutes by default). Outside the window the object is watched again, for example a solar-powered garden sensor by day.

- **Watch after updates:** After an update of Home Assistant or an integration, Housekeeper scans extra for a day (30 minutes, 2 and 6 hours later, and at the end) and compares with the state before the restart. A band shows how many objects are affected while it runs; the card on the findings page lists what failed since, was briefly disturbed or works again, and says "unknown" when no comparison is possible. This is a link in time, not a cause. The duration is in Settings (0 switches it off).

- **Own update status:** Under Settings, Info, Housekeeper compares the version actually loaded with the state stored by HACS. The card detects an available update, mismatching or missing HACS data and, in particular, an earlier commit installation for which HACS can miss the move to releases. It explains the appropriate next step and opens the Housekeeper repository directly in HACS; no additional GitHub request is made.

- **Switch entities in bulk from the inventory:** Entity rows of the Inventory have a checkbox. The bar above disables, enables, hides or shows them, up to 200 entities per plan, with a preview and undo. An entity that something certainly uses is not disabled; only what you disabled yourself is enabled again.

### Fixed

- **Interface:** Corrections and small improvements to lists, tables, dialogs and handling: more consistent lists and tables on every page (search, sorting, filters, pages and CSV export, the whole row clickable, compact rows), page selection in the inventory, an Actions tab with a fixed layout for every object (apps too), confirming or cancelling plans in one step, an Export menu in the inventory (list as CSV or guided export), column pickers with the name left and the checkbox right, cleanly aligned actions and better keyboard and screen reader support.

- **Storage and system:** The folder measurement stops after 20 seconds (for example on a slow network share under /config); the page then calls the sizes minimums.

- **Outages:** The detail page of a failed integration says how long the outage has lasted and when it becomes more serious.

- **Missing blueprint:** An automation or script whose blueprint no longer exists is reported as a finding; when several lack it, it shows as a shared cause in the list. The blueprints page now counts such paths too.

- **Start a scan from outside:** New service `ha_housekeeper.scan` (with “Wait for the end” it returns the counts) and a “Start scan” button for dashboards. Several calls make one scan, none starts right after a scan, and it is refused during a plan or while Home Assistant starts.

## 1.6.0 - 2026-10-13

### Changed

- **Uniform expand arrows:** All collapsible sections ("How is this counted?", file groups, details) now share the same small chevron that points right and turns down when opened, instead of the coarse default triangle.

- **Calmer list bar:** The search is 200 px wide, the filter is called "Severity" (High, Medium, Low, Info, None) and the sort shows its direction in the entry ("Severity ↓"). Saved views are one star button with a pick list, delete per entry and "Save view". "Compact rows" now works in the findings list too.

- **Integration outages graded by duration:** An integration that is not loaded is a finding at once and no longer waits for “Minimum days unavailable” (default 7 days). How long it has lasted sets the impact: under 1 hour “Info”, from 1 hour “Low”, from 1 day “Medium”, from the minimum days “High”. “Info” is new (1 point, at most 5); “Low” and “Medium” now take off 2 and 3 points instead of 1 and 2, so the score jumps once. In the list every row carries its impact as a chip and a “⋯” menu with “Mark as known”, “Snooze”, “Hide finding” (and “Prepare deletion” where it fits); the wide buttons under outages and the single “Prepare deletion” button are gone. The detail page shows the same actions for outages now. The row of an outage only says what is affected and how long it has lasted (“for 6 h · Medium in 18 h”); state and error text are on the detail page. Each row has two chips: the reason (grey outline, for example “Outage”, “Unused”) and the impact (coloured, High red down to Info grey); the date is gone from the row. The filters “Type” and “Impact” now apply to outages too; there is a new filter “Reason” (with “Outage” as a tile of its own). The “Housekeeping status” tile of the Findings page is gone; its history (“−27 in 2 days”) sits under the headline of the overview, and the link “How is the number made?” is removed.

### New

- **Gaps in the check are made up for:** If a scan could not read a source in full (dashboards, say, because Lovelace was not ready), Housekeeper starts a new scan after 5 minutes, at most three times in a row. The "Check" bar says that it will try again. A component that is missing altogether is not retried.

- **Mark for several objects:** The selection bar of the Findings page has a “Set a mark” button. It sets kind, reason and review date in one go on all ticked entities, devices, integrations and apps; other objects in the selection (for example automations) stay untouched.

### Fixed

- **Backup before a deletion without set-up backups:** Anyone who had not set up automatic backups in Home Assistant first had to create a backup location and an encryption key. Housekeeper now saves to the local storage of Home Assistant, without a password. The preview and the backup step say that it is local and not encrypted. An aborted plan names the reason in the red band ("Nothing was deleted and nothing was changed").

- **"Scene missing" for scenes an automation creates itself:** If an automation or script creates the scene with `scene.create`, the finding now says so: the scene only exists after that action has run.

- **Policies and other views after “Scan now”:** The list of affected entities stayed at the old state after a new scan until the page was reloaded. Policies, exposure, automation quality and blueprints now load again by themselves after a new scan (issue #11).

- **Menu on narrow windows:** The open menu list is taller than the window, for example with large fonts, and now scrolls, so the lower entries can be reached (issue #10).

- **Sort direction:** With equal values the ascending/descending arrow did not reverse the order; it now reverses the whole list.

- **Findings:** Choosing a status such as “New” or a filter hid the outages of integrations although they were counted. They are rows of their own in the list now.

## 1.5.1 - 2026-10-12

### Changed

- **More compact menu bar:** So the bar at the top gets narrower and has to switch to the “Menu” button less often, it was rebuilt: “Housekeeper” with the word “Overview” below it is now the way to the overview and replaces the “Overview” menu item, and Settings is only the gear in the bar (the name shows as a tooltip and in the list of the menu button). The search field is a little wider for that.
- **Findings as one list:** The Findings page no longer has the separate groups “Outages” and “Single findings”. Every row is an object with its type; one with follow-ups carries a red counter (“12 follow-ups”, below it “explains 12 more findings”) and opens its chain: app, integration, device, entities, each with its own counter. The filter “With follow-ups” shows only those entries, “Flat list” shows every finding on its own and names the cause (“Follow-up of …”).
- **Overview “What do I have to do now?” in three areas:** **Findings** shows the first five entries of the same list as the Findings page (a chain is one row with a red counter, “All findings (n)” leads to the list), **State** shows backup, disk and an outdated scan (urgent ones take points off the status) and **Maintenance** shows goals, reminders and quarantine: never urgent, folded with a count while something else needs attention. Missed goals read in plain text (“Weak batteries: now 2 · allowed: none”, goal missed). Areas without rows are left out.
- **“Done” tab:** “Fixed lately” is now “Done” and shows events instead of objects, for 7, 30 or 90 days: “Fixed by a plan” (with the kind of change, the number of objects, the time and whether it can be undone) and “Ended by itself”. The latter holds findings that vanished without a plan: “Back in order by itself” counts as done, “Object removed”, “Source not read” and “Reason unknown” do not, because nothing was fixed there. The number of objects of a plan is no longer capped at 300.
- **Status as a score:** The Housekeeping status is now a score out of 100. Every entry of the findings list takes points off by its impact (high 5, medium 2, low 1, each capped), urgent state topics such as the backup or a nearly full disk take 10 each; follow-ups of an outage do not count extra. Green from 90, yellow from 70, red below; an entry with high impact turns the ring at least yellow. The number of objects with a finding is shown beside it, and a click on the ring shows the calculation. The new value replaces the old one without a transition: the curve in the overview has a kink at this point.
- **Storage and runtime:** The "Storage & system" page no longer reads the folder sizes on every visit: a result is reused for up to 5 minutes, also across browsers, and "Refresh" reads again only after 30 seconds. The page shows when the sizes were measured. Settings, Info lists the duration of the last scan per phase, the longest first.
- **Detail pages:** What you decided about an object now shows in a band above the tabs: a finding marked as known, snoozed or hidden with kind, date and reason (with "Take back") and a mark (with "Change" and "Remove"). The card "Known about …" names the same decision instead of "The finding is hidden".
- **Changes:** The scan history first shows only the newest rows so the result of the comparison stays visible; "Show all" opens the whole list. The "Compare with" choice sits in the head of the history, stored scans carry the weekday in their title, and a sentence explains the bar.
- **End of a finding:** "Resolved findings" now counts only findings whose object still exists. A finding that disappears because its object was removed, the check (for example of a dashboard or the apps) could not read it, or a setting such as the outage duration changed is listed under "Ended without a repair" with the reason. The "resolved" number can therefore be smaller than before.
- **Recorder, load:** Rows, entities and events are three labelled figures instead of one sentence; what is not counted (hidden, disabled, down all the time) shows as marks of its own with an explanation.
- **Repair:** The “Repair sensor errors” card now has its title like the others, and the card titles carry the name of their tile (“Repair sensor errors”, “Replace a meter”).
- **Overview:** Three zones instead of two columns: status and tasks on top, “Top findings” (five rows at most) with the inventory status below it beside the notes in the middle, and system, database and comparison as state cards at the bottom. The “By object type” card is gone (the inventory shows the types). In the System card the value now sits on the right and the bar below it.
- **Inventory:** A ring with a table replaces the tiles and shows the object types: the five largest, the rest on request. A row filters the list and a second click lifts the filter; the unavailable and orphaned columns filter by type and state together.
- **Inventory:** The search and the type, state and origin filters sit in one row; on narrow screens they wrap.
- **Storage:** The disk, memory, CPU and swap tiles show a line of the last days (one value every five minutes, kept for seven days; the CPU also shows its peak). The first line appears an hour after installing.
- **Storage:** The two tiles “Usage” and “Other” are gone; three chips (By category, By folder, More) pick the list, each with its own heading.
- **Home Assistant start:** The banner names the step (Home Assistant loading, waiting time with a countdown, final scan with progress) instead of just “still starting”.
- **Blueprints and detail page:** Each blueprint kind is a section with its number (open only when there are findings); on the detail page of an entity or device "Rename and area" is folded.
- **Overview:** "Needs attention" comes before the state of the inventory.
- **Batteries in tabs:** The list stands alone; the forecast and the kinds of batteries are tabs of their own as soon as there is something to show.
- **Changes as sections:** Each category (status changes, new and resolved findings, new and removed objects) is a foldable section with its number; the tiles above open exactly that category.
- **Outages and recorder costs shorter:** With many causes the card can be folded, and the statistics under the recorder costs are a folded section with its number.
- **Runs without a second list:** The findings ("never succeeded", "fails" …) are shown in the table under the name; the "Flagged" tile filters them. The possible conflicts sit folded with their number under the table.
- **Recognisable tiles:** A number without a click is flat, a filter has a funnel and is marked (with a check) while it is on, a link to another page has an arrow. A second click lifts every filter, the list comes into view, and above the list "Filter on" with "Reset" says what is filtered.
- **Repair like cleanup:** The tasks are compact tiles on top and stay there while working; changing the task no longer needs "Back". The note about the confirmed plan sits behind the coloured (i) here too.
- **No copy button in the lists any more:** The square shown on hover covered names and IDs; the ID can be selected directly.
- **Automations: diagnosis on the detail page:** The "Diagnosis" column of the overview is gone; the row opens the detail page, which has a "Diagnosis" tab (views, success criteria, improve, trace tools). Scripts show their four views there.
- **Recorder costs as a table:** The entries are a sortable list with a bar for the share and columns for total, 24 hours, 7 days and average per day; clickable tiles (All, Suggestions, Excluded, Not used), filters and CSV export.
- **Protection mode starts read-only:** A new install begins in "read only"; you release changes on purpose under Settings → Security. Existing installs keep "full".
- **Reliability: setup failures:** The integrations table has a sortable "Setup failures" column and a tile for it; the detail page names a possible cause (device offline, access, starting too early, restart needed).
- **Reliability as tables:** Integrations and unstable entities are sortable lists (availability, outages, longest outage, last disruption, change; episodes, per day, duration, pattern) with clickable tiles, filters and CSV export.
- **Recorder: findings as a table:** The findings are a sortable list (rows per day, loudest hour, share without a new state) with clickable tiles and filters; clicking a row opens the details, and several entities can be ticked for exclusion.
- **Automations: new overview:** The "Overview" tab (formerly "Quality") lists every automation with state, runs, errors and the seven views, including disabled ones and ones that never ran. The list has search, filters, sorting by any column, paging and CSV export; a row opens the detail page. The tiles above are clickable and filter, and so are the tiles under "Runs".
- **Calmer page headers:** Storage & system, Access & data flow, Credentials, Reliability, Exposure, Policies, Runs, Recorder and Maintenance show the subtitle under the title and a slim line with "As of" and "Refresh"; the tab tiles are flatter.

### New

- **Own battery types:** A type you enter for one sensor stays saved and is offered for every sensor. Below the battery list you can add, rename and delete own types; built-in and used types stay. The shopping list counts them as before.
- **Outages as a chain:** A stopped app, the integration that depends on it, a device of that integration and its entities now form a chain: the cause stands on top and carries the follow-ups. A device whose entities are all unavailable (at least three) is a finding of its own, “Device is down completely”, and can be marked as known, snoozed or hidden like an integration. A missing entity, device or area that at least two automations, scripts or dashboards point to stands as one cause, like a missing service. The Findings page still shows this as a flat list; the presentation follows.
- **Search for pages and filters:** The search at the top now also finds pages (including the tabs of Settings, in German and English, with keywords such as “backup” or “dark”) and filters (“Findings: Known”, “Inventory: Unavailable” with the count) ahead of the objects; arrow keys and Enter work across all hits.
- **Check coverage:** Housekeeper now shows which sources the last scan read: a line in the overview ("Check: 5 of 6 sources", yellow with the names when something is missing) and a list in Settings, Info with the state and reason per source (registry, automations, dashboards, Energy dashboard, apps, long-term statistics, database). The scan health sensor names the sources that were not read. Objects of a source a scan could not read count neither as new nor as removed in the comparison; an ended finding names the source that was not read.
- **Saved views:** A sort alone (column or direction) can now be saved as a view. The button appears as soon as the search, a filter or the sort differs from the default list, and with a view chosen only when something differs from that view.
- **Settings, Info:** "What Housekeeper stores" now lists all of its own files with purpose, size and last change, in groups and with the total size. Only kind and size are shown, never contents.
- **Scan health:** If a scan fails or does not run for a long time, the panel shows a banner with the phase and the last successful scan; the numbers then come from an older state. A new diagnostic sensor "Scan health" (OK, outdated, failed, preliminary) is available for dashboards and automations, and a lasting problem raises a repairs hint.
- **Scripts in a tab of their own:** Under "Automations" the "Scripts" tab lists every script with runs, errors, four views and a "Called by" column (the automations and scripts that use the script), so scripts nobody calls are easy to find.
- **Helpers in the inventory:** The type filter has a "Helpers" choice (helpers with a config entry and helper entities) with the columns "Used by" and "Last changed" and a choice for helpers that are probably unused; mold indicator and Bayesian sensor are checked for missing sources.
- **Risk level with a reason:** In Access & data flow a legend explains what High, Medium and Low mean; pointing at a level shows the reason, and the detail page of an integration spells it out.
- **Custom cards with a status:** The list of dashboard resources shows whether the file is missing, whether a dashboard uses the card, or that this cannot be told.
- **Storage & system** (Operation): disk, RAM and CPU use and a "Usage" tab that switches between category and folders under `/config`. Apps and custom integrations are under "Apps & integrations".
- **Access & data flow** (Security): system access and cloud data flow of the integrations with a risk level, with a Supervisor also the rights of the apps.
- **Credentials** (Security): which integrations store passwords, tokens or keys and whether a value is set. Housekeeper never shows the values.
- **Outages instead of three lists:** An integration with a problem now appears under "Findings" even when no entity is flagged (block "Outages"). The overview has one row for it, "Needs attention" is now "Most important findings" (outages first), and the card "Integrations with problems" is gone.
- **Menu reordered:** New group "Security" (Exposure, Access & data flow, Credentials). Storage & system is under Operation. Clean up, Repair and Journal form the group "Clean up", "Explore" is now "Catalog" (Inventory, Dependencies, Changes). The bar has seven entries.
- **Overview shows the system:** a new "System" card with disk, memory and processor. A task appears once the disk is 75 % full, an urgent one at 90 %.
- **Tab "Access & data"** on the detail page of an integration: system access, data flow and credentials (never a value); a red line in its overview for a high system access.
- **Apps as objects:** With a Supervisor, installed apps are in the inventory (status, version, update) and have a detail page with rights, load and storage. No findings, no changes to apps.
- **Apps and integrations:** If an integration probably depends on an app (host name in its configuration), the app shows the tab "Relations". The match is always "probable".
- **Finding "App stopped":** If an app is stopped and an integration that probably depends on it fails, Housekeeper reports it.
- **Finding "Integration not loaded":** An active entry that has not been loaded for more than an hour now appears in the findings, with the cause from Home Assistant.
- **Marks for integrations and apps:** "Offline on purpose", "Seasonal" and "Spare device" hide the outage findings.
- **Outages:** The "Outages" card offers "Mark as known", "Snooze" and "Hide" for integrations that are not loaded; a finding no longer appears twice in the list.
- **Numbers in the menu:** Maintenance (missed goals) and Policies (violations) show a number; Inventory no longer does.
- **Blocked automations:** An automation whose triggers all point to failed entities is reported as a finding.
- **Missing services:** Automations and scripts that call a service that no longer exists are reported as a finding; if several call the same one, it appears as one cause in the outages.
- **Missing tags:** An automation that waits for a tag (NFC/QR) that no longer exists is reported as a finding.
- **Access policies:** Three new rules (off) point out a login without password for a public network (`trusted_networks`), an external URL with `http://` and trusted proxies with a public network. Ordinary private networks are not reported.
- **User policies:** Three new rules (off): users who have not logged in for a long time or never, old long-lived tokens (the age only, because Home Assistant does not record their use) and long-lived tokens of switched-off accounts. Never a token value.
- **Companion app policy:** New rule (off): a phone with the companion app from which no watched sensor has reported for at least 30 days, usually an old phone with a leftover entry.
- **HACS policies:** Two new rules (off): an integration installed through HACS whose GitHub repository is archived, and one with an update waiting that needs a newer Home Assistant. The integration page shows both in the HACS box.
- **Errors from the log:** For an integration that is not loaded and for failed entities, the page now says how often Home Assistant logged an error or warning for the integration and when last. Numbers and times only, never the text.
- **Replace references checks automations:** Home Assistant has to accept the changed automation and load it after the reload, otherwise the file stays as it was.
- **Automations without effect:** Findings for automations and scripts whose actions all target failed entities, and for conditions that can never be true. A blocked automation can be switched off with a plan.
- **Webhooks:** Access & data flow shows which automations a webhook can start and whether it can also be reached from outside.
- **Before/after:** The "Runs" tab compares errors before and after a change to the configuration.
- **Sidebar button:** opens Home Assistant's sidebar when it is hidden.
- **Apps & integrations** (Inventory): apps (with CPU, RAM and data) and core and custom integrations in tabs of their own, with version, status, entities and devices; the disk space of the apps and of the custom integrations is shown as a sum in the tile and the tab. The inventory also has a "Core / Custom" filter.
- **Page of an integration:** core and custom integrations have their own detail page with all entries, entities and devices, reliability, and access and data; for custom ones also the folder and its size.
- **HACS updates:** For custom integrations installed by HACS, the integration page and the "Apps & integrations" list show the installed and the newest version with a note about an update; the list can be filtered by it. For apps the list shows the newest version, an "App updates" tile and an "Update available" filter.
- **Other** (Storage & system): custom cards, blueprints and the remaining folders and files under `/config` share one tab.

### Fixed

- **Findings:** Outages (integration, device, app) can be ticked in the list again, to hide, mark as known or snooze them together.
- **Relations:** An entity that an automation names in many places now appears once in the list ("12 places", the places on hover). Objects without an inventory entry of their own (for example `sun.sun`) show "Not in inventory" instead of "Missing"; "Missing" only appears where a finding backs it.
- **Broken references:** "Add label" no longer shows there (Actions tab, finding selection bar). The cause is one sentence: "Automation X points to Y, which no longer exists."
- **Findings:** The heading “Actions” above the title was a leftover of the menu group that now consists of “Findings” only. It is gone, also as the path in the search.
- **Menu bar:** On windows too narrow for all menu items (roughly between 860 and 1400 pixels) the bar was cut off on the right. It now changes into the "Menu" button with a list below it as soon as it does not fit, and shows the full bar again when there is room.
- **Scan history:** "the last scan of each day" now counts the day in Home Assistant's time zone instead of UTC. Before, two scans of the same day could sit side by side while another day was missing; doubles already stored disappear on load.
- **Bulk actions on findings:** If a request fails in the middle of a selection, the failed findings stay selected and the form stays open; the message says "x of y done". A retry sends only the rest.
- **Saved views:** When the limit of ten views is reached, a new view no longer silently replaces the last one, but says so.
- **Appearance:** Disabled buttons only spin their icon while work is running, no longer when a selection is missing; green and amber follow the theme everywhere; the "By type" and backup tables show their column labels on a phone.
- **Overview:** "Weak batteries: goal missed" now leads to "Maintain → Batteries" instead of the inventory.
- **Recorder cleanup:** Deleting statistics and trimming history now run per entity: if one fails, the others carry on and the reason is shown on the affected one. Before, the run stopped at the first failure. It still stops on a shared problem (recorder busy or unavailable).
- **Replace references, rename:** When several steps of a plan touched the same automation or source, the run stopped after the first step with "A configuration was changed after the preview". The changes made by earlier steps of the same run no longer count as foreign changes.
- **Sub-page tiles:** The icon is now vertically centred in the tile and has more room to the text.
- **Webhooks:** An automation with several webhook triggers now counts as open as soon as one of them is reachable from outside (before, only the first one counted). Disabled automations are marked and do not count as open.
- **Plans:** A single failed status request no longer ends the progress display; it retries and says so. A failed cancel now reports that.
- **Repairs hints:** Only unavailable, orphaned and broken-reference findings raise a hint; other findings (for example an integration that is not loaded) no longer show up as "unavailable entities".
- **Runs: click on "Errors":** The card on top said "No matches" although the table below listed the automations with errors; the empty message is gone.
- Under an outage the "Outages" card showed at most 20 follow-up findings even when the number said more. It now has pages.

## 1.5.0 - 2026-10-12

Die Änderungen stehen vollständig unter 1.5.1. / The changes are listed in full under 1.5.1.

## 1.4.0 - 2026-10-11

Broken references in dashboards are now readable and grouped.

### New

- **Broken dashboard references:** Instead of a path such as `views/12/sections/1/cards/0/…` you see the tab, section and card type. The references of one card are a single expandable row, and the diagnosis has one row per card.
- **Suggestions:** For a missing entity Housekeeper names existing ones with a similar name (“Maybe: …”), in dashboards, automations, scripts, scenes and helpers.
- **Abandoned cards:** When more than half of a card's references are broken, Housekeeper points out that the whole card can be removed.

### Fixed

- Long values in the diagnosis are no longer cut off with “…”.

## 1.3.0 - 2026-10-11

A logbook for your own entries, object pages with "Actions" and "History" tabs, batteries with a forecast and coin cells in volts, policies right at the object and a reworked recorder.

### New

- **Logbook:** Your own entries are now a logbook: a dialog to write them, a tab under "Changes", a compact card per object and a suggestion after an action. A removed or forgotten device is written to the logbook, and the list of removed devices shows the entry. The "History" tab of a device has no note of its own (old notes are dropped).
- **History of an object:** Objects have a "History" tab with their logbook, the plans that named them and, for devices, their life; also what Housekeeper noticed.
- **Scan points:** From the history of the scans you can set a named scan point. It stays until deleted and serves as a comparison base.
- **Object pages:** Entity, device, integration, automation, script and scene read on the overview and change things in the "Actions" tab (forms as rows of one card, grouped by purpose). The "Known" card sums up everything with the source of each line; the technical data sit in two equal columns. The mark moved to the "Actions" tab.
- **Trim history** on the page of an entity too: states, short-term and long-term statistics to tick, or a stretch of states.
- **Removing with recorder data:** Removing entities chooses the recorder data per entity, with a default, a lock for the Energy dashboard and a summary in the plan.
- **Batteries:** one table with the forecast up to 90 days (windows) and the need of the next 30 days; each sensor carries the name of its device. The type comes from Battery Notes when present (its other entities are ignored). Sensors that are no replaceable battery are proposed from the device's other sensors and not counted. Coin cells in volts (CR2016, CR2032, CR2450) show a bar and a percent from a curve; "Empty in" says "no forecast" instead of "stable".
- **Policies:** violations open with a click on the row, with the reason and the fix (rename, assign an area, open object, hide). The bulk rename is gone. An object's overview shows its violations with the same fixes. Renaming starts with an empty field and suggestions as buttons (the best one "recommended", a click switches or clears).
- **New policy "Entity id with a device address":** reports ids made of an address (IP in private ranges, MAC, radio or Zigbee address such as `eltako_gw1_ff_c2_4a_89`), because they say nothing about the device and can change. The first suggestion is the name. Like all policies it is off at first.
- **Changed policy "Entity id with a trailing number":** counts only counters up to three digits (`_2` to `_999`) and skips address ids; `switch.schedule_878149` is no longer a finding.
- **Recorder:** tabs "Findings" (one card per entity with all its reasons and thresholds, filters, mark for exclusion) and "Events" (bars, share, rate per day). Recommended exclusions are easy to spot, "Suggestions only" hides the rest. Integrations show their loudest entities. Trimming old history says what goes and what stays.
- **Exchange device, change meter, replace references:** pick by typing instead of the browser list; check lines in the form, a summary of the pairs, modes as cards with their consequences and a timeline; the preview shows each source with its old and new line. Repairs of counters and ranges say what was checked and what changes.
- **Maintenance:** reminders with a due day and a history, as a table; reminders and logbook entries are made in a dialog. Deleting a reminder, entry, plan, view or template asks first. The confirmations in backup protection open from a button in the row.
- **Status:** the ring counts topics; only urgent ones take points off, a click explains the number.
- **Overview and graph:** without the tile card "What would you like to do?"; on a phone the three figures sit in one row and "Scan now" is smaller. The graph has a fixed height, a foldable legend, wrapping names and a note on a phone.
- **Export:** shows how many entities are selected and returns to the page it came from.

### Fixed

- "No replaceable battery" updates the list at once, volt sensors included; the battery table opens with every battery instead of only the low ones.
- A click on a rename suggestion in the policies did nothing.
- The frame of a dialog field covered its title; the chips in dialogs share size and pointer, and the chosen one is visible.
- Backup protection: pills sit in one line, the button under the text.
- The automation page no longer overlaps text or stacks the run bars.
- The impact texts now say that removing also deletes the statistics, and name the dynamic templates that are not checked.
- Lines above notes across the panel removed.

## 1.2.0 - 2026-10-10

More tidying right at the entity, a clearer recorder exclusion, and a panel that no longer freezes on errors.

### New

- **Rename and assign an area** on the detail page of an entity or device too, each as a plan with preview and undo; for many at once in the policy list.
- **Recorder exclusion:** a slim bar instead of a large box, with YAML to copy and the steps afterwards. "Recorder load" and "Recorder costs" show what the recorder already excludes; excluded entities can be picked to trim their old history.
- **Sparklines** in the tiles of the findings list; its own tab for Housekeeper backups in Maintenance.
- **Labels** for scripts and scenes too.
- **Settings:** the details for a bug report (versions, browser or app, last errors) can be copied; an issue template asks for them.
- **Export:** select all entities with one click.

### Fixed

- In Safari and the Companion app the panel stayed on "Scanning…" (#7).
- A new plan from the findings list or the detail page did not open the page at the plan (#8).
- A view that throws shows a message with a way back instead of freezing the panel; a failed action no longer replaces the page.
- A double click no longer creates a second plan.
- The "Exchange device" card showed the title of the recorder selection.
- Entity lists show name, ID and extra facts the same way everywhere; the policy list, the list tools and the separators are aligned cleanly.
- The status tile of the findings list shows the same quantity as its line.
- The backup before deleting in the recorder includes the database.

## 1.1.0 - 2026-10-10

Cleanup gets more capable: plans as a guided flow, trimming history, deleting backups and automations, renaming entities and assigning areas. Plus batteries with type and a shopping list.

### New

- **Plans as a guided flow:** check, confirm, run, result in four steps; a plan with nothing to run shows only the reason.
- **Trim history:** delete stored states of selected entities older than a chosen number of days (final, with a backup first).
- **Tidy Housekeeper backups:** list of its own backups with the rule "keep the last N and everything younger than M days"; backups of watched plans and the newest one with undo are protected.
- **Delete automations:** remove unused automations from `automations.yaml` as a plan, with preview, verification and undo.
- **Rename with references:** new entity ID, references in automations, scripts, scenes and dashboards follow; undo restores files and ID.
- **Assign an area:** for entities and devices without one, suggested from the device or the integration.
- **Batteries:** battery type per device with a 30-day shopping list, a detected battery change to log; batteries in volts count in the overview.
- **Automation goals:** history per automation and a finding when a goal is missed repeatedly.
- **Recorder:** an "In the recorder" card per entity and a selection for the exclusion in `configuration.yaml`.
- **Export** from the inventory as CSV, Markdown or JSON; own entries in the change history; sparklines in the header tiles.

### Fixed

- Recorder deletions wait for every block before counting.
- Housekeeper does not reload while a plan writes; a run cut off by a restart ends as partial or aborted.
- The status number is the same in every view.
- If the small backup fails, Housekeeper offers a full one as a new preview instead of starting it on its own.

## 1.0.5 - 2026-10-10

Two bugs fixed that were in 1.0.3 and 1.0.4, and four new maintenance goals.

### Fixed

- **Scan aborts (issue #5):** with Home Assistant 2026.10 the first scan failed on
  automations with templates ("Template is not a container or iterable"). Housekeeper now
  takes only real IDs from Home Assistant.
- **Ticking rows did not work:** ticking single rows in Findings, Cleanup and when
  deleting statistics raised an error.
- **Deleting statistics:** more than 200 selected series ended in an empty error. Each
  round now takes the first 200 and the rest stays selected; the button shows the count,
  and after "Run now" the page jumps to the progress.

### New

- **Maintenance goals:** sensors without a new report, recurring outages, automations with
  errors (30 days) and orphaned statistics.

## 1.0.4 - 2026-10-10

New detection for sensors that stopped reporting.

### New

- **"Stops reporting":** a sensor that keeps its last value but reports nothing new for
  longer than the limit appears as a finding. Default 48 hours (option `stale_hours`,
  0 = off), for sensors with measurements only; adjustable per sensor on the entity's
  overview, also for other entities.
- **Findings:** "Show again" in "Hidden", "Known" and "Snoozed".
- **Database:** the card shows the oldest entry in the recorder.

## 1.0.3 - 2026-10-09

Usability and readability.

### New

- **Clear result after a plan:** a band shows green, amber or red, how it went and
  whether undo works. The plan now waits for the check instead of staying on "Executed".
- **Orphaned statistics:** columns "First entry" and "Records", a checkbox in the list
  header, "Show selected only".
- **Confirmation:** one tick for all entries to review instead of one per row; aborted
  plans can be repeated; the audit report can be folded.
- **Handling:** Shift-click selects ranges, copy button on IDs, "Reset filters", keys `/`
  and `Esc`, arrow keys in lists, short messages, "Since your last visit" on the overview,
  "Read only"/"Can change" per page.
- Buttons weighted by effect, deleting is red.

### Changed

- Narrow screens: the assistant's step bar and reminders now fit.
- Duplicate tile row removed from "Orphaned statistics".

## 1.0.2 - 2026-10-09

New tile navigation and some fixes.

### New

- **Tiles with counts** in Cleanup, Reliability, Recorder, Policies, Exposure, Runs and
  Maintenance; the chosen tile is highlighted. Quarantine is its own area with release in
  the list.
- **Reminders** have their own view under "Maintain". Batteries are in one list, including
  those in volts; the forecast is folded into groups with device, room and date.
- Aborted plans can be repeated as a new preview with "Repeat plan". The audit report can
  be folded again.

### Changed

- If the small backup before a plan fails, Housekeeper tries the full automatic backup;
  the error text shows in the plan and in the log.
- Deleting statistics also deletes the stored states by default.
- The "Soon" group of the to-do list starts folded.

## 1.0.1 - 2026-10-09

Fixes and a tidier interface.

### Changed

- **Smaller backup before plans:** Housekeeper backs up Home Assistant only, without
  apps and folders, and the database only when the plan writes into it. The backup shows
  up as its own “Housekeeper …” backup, does not count towards your retention and not as
  the regular backup. Home Assistant does not delete these backups by itself.
- **Counter repair** almost always aborted on running counters with “The data changed
  after the preview”; fixed.
- The notes “Home Assistant is still starting” and “A plan is running” explain
  themselves now and go away on their own.
- Audit report: names and IDs are in plain text by default, with a tick to share it with
  placeholders.
- Interface: finding rows, journal, settings, colour scheme choice and buttons are laid
  out more consistently.

## 1.0.0 - 2026-10-09

First published version of HA Housekeeper. Make a
Home Assistant backup before cleaning up; there is no warranty (see the disclaimer
in the README).

### Included

- Inventory and findings: entities, devices, automations, scripts and scenes, orphaned
  and long-unavailable objects, broken references, duplicates, unused automations,
  batteries (percent and volts) and maintenance goals.
- Cleanup only after a confirmed plan with preview, quarantine, backup, verification
  and undo in the journal.
- Repair: counter glitches, sensor errors, meter change, replacing references,
  exchanging devices.
- Maintenance, protection mode, finding status, one search everywhere, colour schemes
  and German and English.
