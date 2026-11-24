// The plans an agent made through the AI access: what an agent says about its plan, and the entry in the overview while one waits.
// The plan is only a preview; the text of the agent is shown, never acted on.
Object.assign(TEXT.de, {
  viaMcpReason: "Begründung des Agenten, Text nicht geprüft",
  todoAiPlans_1: "1 Vorschlag der KI wartet auf dich", todoAiPlans_n: "{n} Vorschläge der KI warten auf dich",
  todoAiPlansHint: "Pläne, die ein Agent über den KI-Zugriff angelegt hat. Sie laufen erst, wenn du sie im Journal bestätigst.",
  journalAllOrigin: "Alle Herkünfte", journalOriginAiOpen: "KI, wartet auf dich", journalOriginAi: "Von KI", journalOriginPanel: "Aus dem Panel",
});
Object.assign(TEXT.en, {
  viaMcpReason: "Reason of the agent, text not checked",
  todoAiPlans_1: "1 proposal of the AI is waiting for you", todoAiPlans_n: "{n} proposals of the AI are waiting for you",
  todoAiPlansHint: "Plans an agent made through AI access. They run only when you confirm them in the journal.",
  journalAllOrigin: "All origins", journalOriginAiOpen: "AI, waiting for you", journalOriginAi: "From AI", journalOriginPanel: "From the panel",
});

class AiProposalsMixin {
  // A plan of an agent that can still be confirmed: a preview, not run, not older than the 24 hours a preview lives.
  aiProposal(plan) { return plan.via === "mcp" && this.isOpenPreview(plan) && !this.planStale(plan); }

  // The reason an agent gave, as a quote under the hint of the plan page; plain text, nothing in it is followed.
  aiReasonBlock(plan) {
    if (!plan.via_reason) return "";
    return `<blockquote class="viareason">${this.esc(plan.via_reason)}<small>${this.t("viaMcpReason")}</small></blockquote>`;
  }

  // The entry of "What is to do": how many proposals wait; none while the journal is not loaded yet.
  // The journal is only fetched for this where an agent may make plans at all (the switch "Fix findings" is on).
  aiProposalsTodo() {
    const mcp = this.data?.meta?.mcp || {};
    if (mcp.enabled && mcp.fix) this.ensureJournal();
    const waiting = (this.journal || []).filter(plan => this.aiProposal(plan));
    if (!waiting.length) return null;
    return { key: "ai_plans", area: "care", tone: "warn", icon: "mdi:robot-outline", text: this.t(waiting.length === 1 ? "todoAiPlans_1" : "todoAiPlans_n", { n: this.formatNumber(waiting.length) }), hintText: this.t("todoAiPlansHint"), jump: 'data-jump="journal" data-jump-journal="ai_open"' };
  }
}
