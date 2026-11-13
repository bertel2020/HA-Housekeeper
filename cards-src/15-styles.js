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
  .hk-note + .hk-note { padding-top: 0; }
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
  .hk-row { display: grid; gap: 12px; align-items: center; padding: 10px 16px; border-top: 1px solid var(--divider-color); }
  .hk-head.line + .hk-row { border-top: 0; }
  .hk-row.r3 { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) auto; }
  .hk-row.r2 { grid-template-columns: minmax(0, 1fr) auto; }
  .hk-name b { display: block; font-size: 13.5px; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hk-name small, .hk-right small { display: block; color: var(--secondary-text-color); font-size: 12px; }
  .hk-right { text-align: right; min-width: 70px; }
  .hk-right b { font-size: 14px; color: var(--primary-text-color); }
  .hk-q { display: inline-block; font-size: 11px; font-weight: 600; padding: 1px 7px; border-radius: 99px; background: var(--secondary-background-color); color: var(--secondary-text-color); margin-top: 2px; }
  .hk-bar { height: 8px; border-radius: 99px; background: var(--secondary-background-color); overflow: hidden; }
  .hk-bar i { display: block; height: 100%; border-radius: 99px; background: var(--success-color); }
  .hk-bar.warn i { background: var(--warning-color); }
  .hk-bar.bad i { background: var(--error-color); }
  .hk-area { padding: 8px 16px 2px; font-size: 12px; font-weight: 700; color: var(--primary-color); border-top: 1px solid var(--divider-color); }
  .hk-sec { padding: 10px 16px 4px; font-size: 11px; letter-spacing: .05em; text-transform: uppercase; color: var(--secondary-text-color); font-weight: 600; }
  .hk-sec.top { border-top: 1px solid var(--divider-color); }
  .hk-shop { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 14px; padding: 4px 16px 12px; align-items: baseline; }
  .hk-shop .q { font-weight: 700; font-size: 15px; text-align: right; min-width: 52px; color: var(--primary-text-color); }
  .hk-shop .q.mute { color: var(--secondary-text-color); }
  .hk-shop .w b { font-size: 13.5px; color: var(--primary-text-color); }
  .hk-shop .w small { color: var(--secondary-text-color); font-size: 12px; }
  @media (max-width: 520px) { .hk-row.r3 { grid-template-columns: minmax(0, 1fr) auto; } .hk-row.r3 .hk-bar { display: none; } }
  .hk-row.fn { grid-template-columns: 22px minmax(0, 1.2fr) minmax(0, 1fr) auto; }
  .hk-row.go { cursor: pointer; }
  .hk-st { width: 14px; height: 14px; border-radius: 50%; justify-self: center; background: var(--disabled-text-color, #bdbdbd); }
  .hk-st.ok { background: var(--success-color); }
  .hk-st.warn { background: var(--warning-color); }
  .hk-st.bad { background: var(--error-color); }
  .hk-name small.bad { color: var(--error-color); font-weight: 600; }
  .hk-name small.warn { color: var(--warning-color); font-weight: 600; }
  .hk-strip { display: flex; gap: 1px; height: 18px; }
  .hk-strip i { flex: 1; min-width: 2px; background: var(--success-color); opacity: .8; border-radius: 1px; }
  .hk-strip i.problem { background: var(--error-color); opacity: 1; }
  .hk-strip i.flapping { background: var(--warning-color); opacity: 1; }
  .hk-strip i.unverified { background: var(--disabled-text-color, #bdbdbd); opacity: .8; }
  .hk-strip i.none { background: var(--secondary-background-color); opacity: 1; }
  @media (max-width: 520px) { .hk-row.fn { grid-template-columns: 22px minmax(0, 1fr) auto; } .hk-row.fn .hk-strip { display: none; } }
  .hk-row.ap { grid-template-columns: minmax(0, 1fr) 34px; align-items: start; }
  .hk-next { font-size: 13px; font-weight: 600; color: var(--primary-text-color); margin-top: 4px; }
  .hk-row.ap .hk-bar { margin: 6px 0 2px; max-width: 280px; }
  .hk-kebab { width: 34px; height: 34px; border-radius: 10px; border: 1px solid transparent; background: none; color: var(--secondary-text-color); font-size: 18px; font-weight: 700; cursor: pointer; }
  .hk-kebab.open, .hk-kebab:hover { border-color: var(--divider-color); background: var(--secondary-background-color); color: var(--primary-text-color); }
  .hk-backdrop { position: fixed; inset: 0; z-index: 9; }
  .hk-menu { position: fixed; z-index: 10; min-width: 210px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--card-background-color); box-shadow: 0 8px 24px rgba(0, 0, 0, .25); padding: 6px; display: grid; }
  .hk-menu button { text-align: left; padding: 8px 10px; border: 0; border-radius: 8px; background: none; color: var(--primary-text-color); font: inherit; font-size: 13px; cursor: pointer; }
  .hk-menu button:first-child { font-weight: 600; background: var(--secondary-background-color); }
  .hk-menu button:hover { background: var(--secondary-background-color); }
  ha-card.hk-alert { border-top: 3px solid var(--warning-color); }
  .hk-tag { font-size: 12px; font-weight: 600; white-space: nowrap; }
  .hk-tag.bad { color: var(--error-color); }
  .hk-banner { padding: 8px 16px; font-size: 12.5px; color: var(--secondary-text-color); background: var(--secondary-background-color); border-bottom: 1px dashed var(--divider-color); }
`;
