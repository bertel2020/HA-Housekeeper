// Mix the grouped methods into the panel element and register it.
for (const mixin of [ThemeMixin, StylesMixin, ListsMixin, OverviewMixin, FindingsMixin, ChangesMixin, SettingsMixin, CleanupMixin, InventoryMixin, GraphMixin, UnusedMixin, DiagnosisMixin, PropertiesMixin, MaintenanceMixin, BackupMixin, ReliabilityMixin, RunsMixin, StormsMixin]) {
  for (const name of Object.getOwnPropertyNames(mixin.prototype)) {
    if (name !== "constructor") Object.defineProperty(HAHousekeeperPanel.prototype, name, Object.getOwnPropertyDescriptor(mixin.prototype, name));
  }
}

if (!customElements.get("ha-housekeeper-panel")) customElements.define("ha-housekeeper-panel", HAHousekeeperPanel);
