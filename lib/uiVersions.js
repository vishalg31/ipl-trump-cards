export const defaultUiVersion = "v2";

export const uiVersionOptions = [
  {
    id: "v1",
    label: "Version 1",
    description: "Neon minimal",
    status: "ready"
  },
  {
    id: "v2",
    label: "Version 2",
    description: "Premium trading card",
    status: "ready"
  },
  {
    id: "v3",
    label: "Version 3",
    description: "Reserved slot",
    status: "planned"
  },
  {
    id: "v4",
    label: "Version 4",
    description: "Reserved slot",
    status: "planned"
  }
];

export function normalizeUiVersion(version) {
  const selected = uiVersionOptions.find((item) => item.id === version);

  if (!selected || selected.status !== "ready") {
    return defaultUiVersion;
  }

  return selected.id;
}
