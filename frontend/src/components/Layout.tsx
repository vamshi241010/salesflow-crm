import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useTheme } from "../context/ThemeContext";
import { getThemeColors } from "../data/themeColors";

export default function Layout() {
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { isDark } = useTheme();
  const c = getThemeColors(isDark);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: c.appBg }}>
      <Sidebar />
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{
          marginLeft: isMobile ? "60px" : "240px",
          transition: "margin-left 0.2s ease",
        }}
      >
        <Topbar searchValue={search} onSearchChange={setSearch} />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: c.appBg }}>
          <Outlet context={{ globalSearch: search }} />
        </main>
      </div>
    </div>
  );
}
