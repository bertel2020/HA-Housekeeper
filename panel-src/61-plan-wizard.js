// The plan as a wizard: Review, Confirm, Run, Result. The stage follows from the state of the plan, nothing is stored.
// Mixed into the panel in 99-register.js; the plan card itself is built in 18-cleanup.js.
Object.assign(TEXT.de, {
  wzLabel: "Schritte des Plans", wzReview: "Prüfen", wzConfirm: "Bestätigen", wzRun: "Ausführen", wzResult: "Ergebnis",
  wzSumEntries: "{n} Einträge", wzSumEntriesOne: "1 Eintrag", stepNOfM: "Schritt {n} von {total}", stepShown: "angezeigt", wzSumRun: "{done} von {total} erledigt", wzIdleTitle: "Nichts auszuführen", wzIdleBlocked: "Alle {n} Einträge sind blockiert. Die Gründe stehen bei den Einträgen.", wzIdleBlockedOne: "Der Eintrag ist blockiert. Den Grund siehst du beim Eintrag.",
  wzIdleNothingTitle: "Nichts zu ändern", wzIdleNothing: "Housekeeper hat geprüft und nichts gefunden, das sich ändern ließe. Du musst nichts tun.", verdictNothing: "Nichts zu ändern", wzIdleNone: "Dieser Plan enthält keine ausführbare Aktion.", wzBack: "Zurück",
});
Object.assign(TEXT.en, {
  wzLabel: "Steps of the plan", wzReview: "Review", wzConfirm: "Confirm", wzRun: "Run", wzResult: "Result",
  wzSumEntries: "{n} entries", wzSumEntriesOne: "1 entry", stepNOfM: "Step {n} of {total}", stepShown: "shown", wzSumRun: "{done} of {total} done", wzIdleTitle: "Nothing to run", wzIdleBlocked: "All {n} entries are blocked. The reasons are shown with the entries.", wzIdleBlockedOne: "The entry is blocked. Its reason is shown with the entry.",
  wzIdleNothingTitle: "Nothing to change", wzIdleNothing: "Housekeeper checked and found nothing that could be changed. You do not need to do anything.", verdictNothing: "Nothing to change", wzIdleNone: "This plan holds no action that can run.", wzBack: "Back",
});

class PlanWizardMixin {
  // 0 review, 1 confirm, 2 run (also while the check afterwards is still pending), 3 result.
  planStage(plan, confirming) {
    if (plan.status === "dry_run") return confirming ? 1 : 0;
    if (plan.status === "backup" || plan.status === "running") return 2;
    if (plan.status === "executed" && !plan.verification) return 2;
    return 3;
  }

  // The plan page shows the same six stages as the assistant (the first two are done by then) and, under them, the steps the backend runs in the stage that is shown.
  // The stage that is on is shown at first; a click on a stage that is done, on or failed shows that one instead, until the plan moves on.
  planTrack(plan, stage, confirming) {
    const steps = Object.fromEntries(this.planSteps(plan, confirming).map(s => [s.id, s]));
    const groups = [["wzReview", ["stepSelect", "stepAnalysis"]], ["wzConfirm", ["stepConfirm"]], ["wzRun", ["stepBackup", "stepRun"]], ["wzResult", ["stepVerify"]]];
    const total = plan.actions.length, done = plan.actions.filter(a => a.result?.state === "done").length;
    const summary = [
      this.t(total === 1 ? "wzSumEntriesOne" : "wzSumEntries", { n: this.formatNumber(total) }), "",
      stage >= 2 ? this.t("wzSumRun", { done: this.formatNumber(done), total: this.formatNumber(total) }) : "",
      "",
    ];
    const states = groups.map(([, ids], i) => {
      const list = ids.map(id => steps[id]);
      return list.some(x => x.state === "failed") ? "fail" : stage > i || (stage === 3 && i === 3 && list.every(x => x.state === "done")) ? "done" : stage === i ? "cur" : "todo";
    });
    const failedAt = states.indexOf("fail"), fallback = failedAt >= 0 ? failedAt : stage;
    const picked = this._planShow && this._planShow.id === plan.plan_id && this._planShow.at === stage && states[this._planShow.stage] !== "todo" ? this._planShow.stage : fallback;
    const names = this.stageNames();
    const items = [
      { label: names[0], state: "done" }, { label: names[1], state: "done" },
      ...groups.map(([name], i) => ({ label: this.t(name), state: states[i], attrs: states[i] === "todo" ? undefined : `data-plan-stage="${i}"`, note: i === picked ? this.t("stepShown") : "" })),
    ];
    const detail = ([name, ids], i) => {
      const subs = ids.map(id => steps[id]).map(step => {
        const live = step.id === "stepRun" && step.state === "current";
        const recent = live ? plan.actions.filter(a => a.result?.state === "done").slice(-3).reverse() : [];
        const extra = live ? `${this.planProgressBar()}${recent.length ? `<ul class="items">${recent.map(a => `<li><span class="ok">✓</span><span>${this.esc(a.name || a.object_id)}</span></li>`).join("")}</ul>` : ""}` : "";
        return `<li class="s-${step.state}"><span class="d" aria-hidden="true"></span><span><b>${this.t(step.id)}</b><span class="sr-only">: ${this.t(`step${{ done: "Done", current: "Current", todo: "Todo", skipped: "Skipped", failed: "Failed" }[step.state]}`)}</span>${step.note ? `<small>${this.esc(step.note)}</small>` : ""}${extra}</span></li>`;
      }).join("");
      return `<div class="stdetail"${i === picked ? "" : " hidden"}><p class="sthead"><b>${this.t(name)}</b>${summary[i] ? `<small>${this.esc(summary[i])}</small>` : ""}</p><ul class="stsubs">${subs}</ul></div>`;
    };
    const backup = plan.backup ? `<p class="factnote">${this.t("backupRestoreHint")}</p>` : "";
    return `${this.stepper(items, this.t("wzLabel"))}<div aria-live="polite">${groups.map(detail).join("")}</div>${backup}`;
  }

  // The rows of a plan come in pages like every other long list.
  planRowsShown(plan, rowList, texts = []) {
    // One search box for the plan on screen: its text is dropped when another plan opens.
    if (this._planqFor !== plan.plan_id) { this._planqFor = plan.plan_id; this.lvState("planrows", "", "asc").q = ""; }
    const found = this.searchList("planrows", rowList.map((html, i) => ({ html, text: texts[i] || "" })), r => r.text);
    const pg = this.paginate(`planrows-${plan.plan_id}`, found.rows.map(r => r.html));
    return found.bar + found.none + pg.rows.join("") + pg.footer;
  }

  planProgressBar() {
    const p = this.planProgress;
    if (!p?.total) return "";
    const share = Math.max(0, Math.min(100, Math.round((p.done / p.total) * 100)));
    return `<div class="wzprog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${share}"><i style="width:${share}%"></i></div>`;
  }

  bindPlanWizard(root) {
    root.querySelectorAll("[data-plan-filter]").forEach(el => el.onclick = () => { this.planFilter = el.dataset.planFilter; this.render(); });
    root.querySelectorAll("[data-plan-stage]").forEach(el => el.onclick = () => {
      if (!this.plan) return;
      this._planShow = { id: this.plan.plan_id, stage: Number(el.dataset.planStage), at: this.planStage(this.plan, Boolean(this.confirmation)) };
      this.render();
    });
    root.querySelector("[data-plan-back]")?.addEventListener("click", () => { this.confirmation = null; this.confirmWord = ""; this.render(); });
  }
}
