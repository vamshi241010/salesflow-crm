export function getThemeColors(isDark: boolean) {
  return {
    appBg:        isDark ? "#1D2125" : "#F0F2F7",
    sidebarBg:    isDark ? "#161A1D" : "#FFFFFF",
    cardBg:       isDark ? "#22272B" : "#FFFFFF",
    hoverBg:      isDark ? "#282E33" : "#F5F7FA",
    border:       isDark ? "#2C333A" : "#E2E8F0",
    textPrimary:  isDark ? "#DEE4EA" : "#1A202C",
    textSecondary:isDark ? "#8C9BAB" : "#64748B",
    textBody:     isDark ? "#B6C2CF" : "#475569",
    textHeading:  isDark ? "#DEE4EA" : "#0F172A",
    accent:       isDark ? "#579DFF" : "#2563EB",
    success:      isDark ? "#4BCE97" : "#16A34A",
    warning:      isDark ? "#F5CD47" : "#D97706",
    danger:       isDark ? "#F87168" : "#DC2626",
    purple:       isDark ? "#A06EF5" : "#7C3AED",
    buttonBg:     isDark ? "#0C66E4" : "#2563EB",
    buttonHover:  isDark ? "#0052CC" : "#1D4ED8",
    inputBg:      isDark ? "#1D2125" : "#FFFFFF",
    activeNavBg:  isDark ? "#1C2B41" : "#EFF6FF",
    tableHeaderBg:isDark ? "#1D2125" : "#F8FAFC",
    rowAlt:       isDark ? "#252B30" : "#F9FAFB",
    cardHoverBg:  isDark ? "#2D3540" : "#F0F7FF",
    editHoverBg:  isDark ? "#1C2B41" : "#EFF6FF",
    deleteHoverBg:isDark ? "#2B1A1A" : "#FEF2F2",
    contacted:    "#60C6D2",
    // dropdown / kanban
    dropdownBg:   isDark ? "#1D2125" : "#FFFFFF",
    shadow:       isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.12)",
  };
}

export function getStatusStyles(isDark: boolean): Record<string, { bg: string; text: string }> {
  if (isDark) {
    return {
      New:        { bg: "#1C2B41", text: "#579DFF" },
      Contacted:  { bg: "#1C3A3E", text: "#60C6D2" },
      Interested: { bg: "#3A2E0A", text: "#F5CD47" },
      Closed:     { bg: "#0D2B1F", text: "#4BCE97" },
    };
  }
  return {
    New:        { bg: "#DBEAFE", text: "#1D4ED8" },
    Contacted:  { bg: "#CFFAFE", text: "#0E7490" },
    Interested: { bg: "#FEF3C7", text: "#B45309" },
    Closed:     { bg: "#DCFCE7", text: "#15803D" },
  };
}

export function getStatusColor(status: string, isDark: boolean): string {
  const map: Record<string, { dark: string; light: string }> = {
    New:        { dark: "#579DFF", light: "#2563EB" },
    Contacted:  { dark: "#60C6D2", light: "#0E7490" },
    Interested: { dark: "#F5CD47", light: "#D97706" },
    Closed:     { dark: "#4BCE97", light: "#16A34A" },
  };
  return isDark ? map[status]?.dark ?? "#579DFF" : map[status]?.light ?? "#2563EB";
}

const darkAvatarColors = [
  { bg: "#1C2B41", text: "#579DFF" },
  { bg: "#0D2B1F", text: "#4BCE97" },
  { bg: "#3A2E0A", text: "#F5CD47" },
  { bg: "#2A1F42", text: "#A06EF5" },
  { bg: "#2B1A1A", text: "#F87168" },
  { bg: "#1C3A3E", text: "#60C6D2" },
];

const lightAvatarColors = [
  { bg: "#DBEAFE", text: "#1D4ED8" },
  { bg: "#DCFCE7", text: "#15803D" },
  { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#EDE9FE", text: "#6D28D9" },
  { bg: "#FEE2E2", text: "#B91C1C" },
  { bg: "#CFFAFE", text: "#0E7490" },
];

export function getThemedAvatarColor(name: string, isDark: boolean) {
  const colors = isDark ? darkAvatarColors : lightAvatarColors;
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function getStatCardIconStyles(isDark: boolean) {
  return {
    leads:    { bg: isDark ? "#1C2B41" : "#DBEAFE", color: isDark ? "#579DFF" : "#2563EB" },
    closed:   { bg: isDark ? "#0D2B1F" : "#DCFCE7", color: isDark ? "#4BCE97" : "#16A34A" },
    interested:{ bg: isDark ? "#3A2E0A" : "#FEF3C7", color: isDark ? "#F5CD47" : "#D97706" },
    revenue:  { bg: isDark ? "#2A1F42" : "#EDE9FE", color: isDark ? "#A06EF5" : "#7C3AED" },
  };
}

export function getBarChartColors(isDark: boolean) {
  return [
    isDark ? "#579DFF" : "#2563EB",
    "#60C6D2",
    isDark ? "#F5CD47" : "#D97706",
    isDark ? "#4BCE97" : "#16A34A",
  ];
}
