// The history of an automation's success criteria (reached and missed per day), and the finding line.
// Mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  chTitle: "Verlauf der Ziele", chRange: "Zeitraum", chDays: "{days} Tage", chQuota: "erreicht", chMissed: "verfehlt in {days} Tagen", chLast: "letzter verfehlter Tag", chNone: "Noch keine Läufe mit Kriterium in diesem Zeitraum.", chNever: "keiner",
  chQuota7: "letzte 7 Tage: {percent} %", chBars: "Läufe pro Tag; rot: Tag mit verfehlten Läufen", chAxisFrom: "vor {days} Tagen", chAxisTo: "heute",
  "automation.goal_missed": "Ziel wird verfehlt", goalLine: "Ziel in den letzten {days} Tagen {missed} von {total} Mal verfehlt · Kriterium von dir gesetzt",
});
Object.assign(TEXT.en, {
  chTitle: "History of the goals", chRange: "Period", chDays: "{days} days", chQuota: "reached", chMissed: "missed in {days} days", chLast: "last day with a miss", chNone: "No runs with a criterion in this period yet.", chNever: "none",
  chQuota7: "last 7 days: {percent} %", chBars: "Runs per day; red: day with missed runs", chAxisFrom: "{days} days ago", chAxisTo: "today",
  "automation.goal_missed": "Goal is missed", goalLine: "Goal missed {missed} of {total} times in the last {days} days · criterion set by you",
});

class CriteriaHistoryMixin {
  critSum(days, range, offset = 0) {
    const sums = [0, 0];
    for (let i = offset; i < offset + range; i++) {
      const day = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      const counts = days[day];
      if (counts) { sums[0] += counts[0]; sums[1] += counts[1]; }
    }
    return sums;
  }

  critHistory(view) {
    const days = view?.days || {}, range = this.critRange || 30;
    const [ok, missed] = this.critSum(days, range);
    const options = [7, 30, 60].map(d => `<option value="${d}" ${d === range ? "selected" : ""}>${this.t("chDays", { days: d })}</option>`).join("");
    const head = `<div class="panelhead"><div><h3>${this.t("chTitle")}</h3></div><div class="actions"><label class="factnote" for="hk-ch-range">${this.t("chRange")}</label><select id="hk-ch-range" data-crit-range>${options}</select></div></div>`;
    if (!ok && !missed) return `${head}<div class="pad"><small>${this.t("chNone")}</small></div>`;
    const quota = Math.round(ok / (ok + missed) * 100);
    const [ok7, missed7] = this.critSum(days, 7);
    const lastMissed = Object.keys(days).filter(d => days[d][1] > 0).sort().pop();
    const peak = Math.max(1, ...Array.from({ length: range }, (_, i) => { const c = days[new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)]; return c ? c[0] + c[1] : 0; }));
    const bars = Array.from({ length: range }, (_, i) => {
      const c = days[new Date(Date.now() - (range - 1 - i) * 86400000).toISOString().slice(0, 10)];
      const total = c ? c[0] + c[1] : 0;
      return `<i class="${c && c[1] ? "m" : ""}" style="height:${total ? Math.max(8, Math.round(total / peak * 100)) : 4}%"></i>`;
    }).join("");
    const stat = (big, small) => `<div><div class="big">${big}</div><small class="factnote">${small}</small></div>`;
    return `${head}<div class="chcols">${stat(`${quota} %`, `${this.t("chQuota")}${ok7 + missed7 ? ` (${this.t("chQuota7", { percent: Math.round(ok7 / (ok7 + missed7) * 100) })})` : ""}`)}${stat(this.formatNumber(missed), this.t("chMissed", { days: range }))}${stat(lastMissed ? this.formatDate(`${lastMissed}T12:00:00Z`).split(",")[0] : this.t("chNever"), this.t("chLast"))}</div><div class="chbars" role="img" aria-label="${this.esc(this.t("chBars"))}">${bars}</div><div class="chaxis"><span>${this.t("chAxisFrom", { days: range })}</span><span>${this.t("chAxisTo")}</span></div>`;
  }

  goalLine(finding) {
    const ev = finding.evidence?.[0] || {};
    return this.t("goalLine", { days: ev.window_days ?? 7, missed: ev.missed ?? 0, total: (ev.missed ?? 0) + (ev.reached ?? 0) });
  }

  bindCriteriaHistory(root) {
    root.querySelector("[data-crit-range]")?.addEventListener("change", e => { this.critRange = Number(e.target.value) || 30; this.render(); });
  }
}
