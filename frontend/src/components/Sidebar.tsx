import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Kanban, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getInitials } from "../data/mockData";
import { getThemeColors, getThemedAvatarColor } from "../data/themeColors";
import { useState, useEffect } from "react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/leads", icon: Users, label: "Leads" },
  { to: "/pipeline", icon: Kanban, label: "Pipeline" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const c = getThemeColors(isDark);
  const navigate = useNavigate();
  const userName = user?.name || "User";
  const avatar = getThemedAvatarColor(userName, isDark);
  const initials = getInitials(userName);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
        setMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarWidth = collapsed && !mobileOpen ? "60px" : "240px";
  const isCompact = collapsed && !mobileOpen;

  return (
    <>
      {/* Mobile toggle */}
      {collapsed && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-3 left-3 z-50 p-1.5 rounded-md md:hidden"
          style={{
            color: c.textSecondary,
            backgroundColor: c.cardBg,
            border: `1px solid ${c.border}`,
          }}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className="fixed left-0 top-0 bottom-0 flex flex-col z-40"
        style={{
          backgroundColor: c.sidebarBg,
          borderRight: `1px solid ${c.border}`,
          width: sidebarWidth,
          overflow: "hidden",
          transition: "width 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
        }}
      >
        {/* Logo */}
        <div className="px-4 py-5 flex items-center" style={{ minHeight: "56px" }}>
          <span className="text-base font-bold whitespace-nowrap" style={{ color: c.accent }}>
            {isCompact ? "⚡" : "⚡ SalesFlow"}
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 mt-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              {({ isActive }) => (
                <div
                  className="flex items-center w-full py-2.5 rounded-md relative"
                  style={{
                    backgroundColor: isActive ? c.activeNavBg : "transparent",
                    color: isActive ? c.accent : c.textSecondary,
                    borderLeft: isActive
                      ? `2px solid ${c.accent}`
                      : "2px solid transparent",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                    justifyContent: isCompact ? "center" : "flex-start",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = c.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!isCompact && (
                    <span className="text-sm ml-2.5">{item.label}</span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom user section */}
        <div className="px-2 pb-4" style={{ borderTop: `1px solid ${c.border}` }}>
          <div
            className="flex items-center gap-2.5 px-3 py-3 mt-3"
            style={{ justifyContent: isCompact ? "center" : "flex-start" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ backgroundColor: avatar.bg, color: avatar.text }}
            >
              {initials}
            </div>
            {!isCompact && (
              <span
                className="text-xs whitespace-nowrap"
                style={{ color: c.textPrimary }}
              >
                {userName}
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs rounded-md"
            style={{
              color: c.textSecondary,
              justifyContent: isCompact ? "center" : "flex-start",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = c.danger;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = c.textSecondary;
            }}
          >
            <LogOut size={16} />
            {!isCompact && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
