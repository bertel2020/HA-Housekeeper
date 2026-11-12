// The look shared by all cards. A card uses the colors of the chosen Home Assistant theme, not its own.
const CARD_CSS = `
  :host { display: block; }
  ha-card { overflow: hidden; }
  .hk-head { display: flex; gap: 12px; align-items: center; padding: 14px 16px; }
  .hk-head.line { border-bottom: 1px solid var(--divider-color); }
  .hk-head .hk-t { flex: 1; min-width: 0; }
  .hk-head .hk-t b { display: block; font-size: 16px; color: var(--primary-text-color); }
  .hk-head .hk-t small { color: var(--secondary-text-color); font-size: 12px; }
  .hk-compact .hk-head { padding: 10px 12px; }
  .hk-chip { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 99px; white-space: nowrap; background: var(--secondary-background-color); color: var(--secondary-text-color); }
  .hk-chip.warn { background: color-mix(in srgb, var(--warning-color) 18%, var(--card-background-color)); color: var(--primary-text-color); }
  .hk-chip.bad { background: color-mix(in srgb, var(--error-color) 16%, var(--card-background-color)); color: var(--primary-text-color); }
  .hk-foot { display: flex; gap: 14px; flex-wrap: wrap; padding: 10px 16px; font-size: 12.5px; color: var(--secondary-text-color); border-top: 1px solid var(--divider-color); }
  .hk-foot .hk-sp { flex: 1; }
  .hk-link { color: var(--primary-color); font-weight: 600; cursor: pointer; }
  .hk-note { padding: 14px 16px; color: var(--secondary-text-color); font-size: 13px; }
  .hk-dot { width: 38px; height: 38px; border-radius: 50%; flex: none; display: grid; place-items: center; font-size: 18px; font-weight: 700; color: #fff; }
  .hk-dot.ok { background: var(--success-color); }
  .hk-dot.warn { background: var(--warning-color); }
  .hk-dot.bad { background: var(--error-color); }
  .hk-btn { min-height: 36px; padding: 6px 12px; border-radius: 10px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font: inherit; font-weight: 600; font-size: 13px; cursor: pointer; white-space: nowrap; }
  .hk-btn[disabled] { opacity: .6; cursor: default; }
  .hk-tiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background: var(--divider-color); border-top: 1px solid var(--divider-color); }
  .hk-tiles + .hk-foot { border-top: 1px solid var(--divider-color); }
  .hk-tile { background: var(--card-background-color); padding: 12px 14px; min-width: 0; box-shadow: none; }
  .hk-tile.go { cursor: pointer; }
  .hk-tile .n { font-size: 26px; font-weight: 700; line-height: 1.1; color: var(--primary-text-color); }
  .hk-tile .l { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; }
  .hk-tile.zero .n { color: var(--secondary-text-color); font-weight: 600; }
  .hk-tile.warn { box-shadow: inset 0 3px 0 var(--warning-color); }
  .hk-tile.bad { box-shadow: inset 0 3px 0 var(--error-color); }
  .hk-compact .hk-tile { padding: 8px 10px; }
  .hk-compact .hk-tile .n { font-size: 20px; }
  @media (max-width: 520px) { .hk-tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .hk-up { color: var(--error-color); font-weight: 600; }
  .hk-down { color: var(--success-color); font-weight: 600; }
  .hk-banner { padding: 8px 16px; font-size: 12.5px; color: var(--secondary-text-color); background: var(--secondary-background-color); border-bottom: 1px dashed var(--divider-color); }
`;
