import { useState } from "react";
import { Search, Bell, Settings, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getInitials } from "../data/mockData";
import { getThemeColors } from "../data/themeColors";

interface TopbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function Topbar({ searchValue, onSearchChange }: TopbarProps) {
  const { user } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const c = getThemeColors(isDark);
  const userName = user?.name || "User";
  const initials = getInitials(userName);

  return (
    <header
      className="h-12 flex items-center justify-between px-6 shrink-0"
      style={{
        backgroundColor: c.appBg,
        borderBottom: `1px solid ${c.border}`,
      }}
    >
      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: c.textSecondary }}
        />
        <input
          type="text"
          placeholder="Search leads..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-4 py-1.5 text-sm rounded-full outline-none"
          style={{
            backgroundColor: c.hoverBg,
            border: `1px solid ${c.border}`,
            color: c.textPrimary,
            width: "280px",
            maxWidth: "calc(100vw - 400px)",
          }}
          onFocus={(e) => (e.target.style.borderColor = c.accent)}
          onBlur={(e) => (e.target.style.borderColor = c.border)}
        />
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-1">
        <TopbarIconButton c={c}>
          <Bell size={18} />
        </TopbarIconButton>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isDark ? "#282E33" : "#F5F7FA",
            border: `1px solid ${c.border}`,
            color: isDark ? "#F5CD47" : "#2563EB",
          }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <TopbarIconButton c={c}>
          <Settings size={18} />
        </TopbarIconButton>

        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ml-2 shrink-0"
          style={{ backgroundColor: c.buttonBg, color: "#FFFFFF" }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}

function TopbarIconButton({
  children,
  c,
}: {
  children: React.ReactNode;
  c: ReturnType<typeof getThemeColors>;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      className="p-2 rounded-md"
      style={{ color: hovered ? c.textPrimary : c.textSecondary }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}
