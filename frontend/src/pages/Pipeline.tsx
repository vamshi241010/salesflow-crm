import { useState, useMemo, useRef, useEffect } from "react";
import { useLeads } from "../context/LeadsContext";
import { useTheme } from "../context/ThemeContext";
import { formatCurrency, getInitials, type Lead } from "../data/mockData";
import {
  getThemeColors,
  getStatusStyles,
  getStatusColor,
  getThemedAvatarColor,
} from "../data/themeColors";
// import api from "../api/axios";
const stages: Lead["status"][] = ["New", "Contacted", "Interested", "Closed"];

export default function Pipeline() {
  const { leads, moveLead } = useLeads();
  const { isDark } = useTheme();
  const c = getThemeColors(isDark);
  const columns = useMemo(() => {
    return stages.map((status) => {
      const items = leads.filter((l) => l.status === status);
      const total = items.reduce((sum, l) => sum + l.value, 0);
      return { status, items, total };
    });
  }, [leads]);
// const moveLead = async (
//   id: string,
//   newStatus: Lead["status"]
// ) => {

//   try {

//     const lead = leads.find((l) => l._id === id);

//     if (!lead) return;

//     await api.put(`/leads/${id}`, {
//       ...lead,
//       status: newStatus,
//     });

//     window.location.reload();

//   } catch (err) {

//     console.log(err);
//   }
// };
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: c.textHeading, fontSize: "22px" }}>
          Pipeline
        </h1>
        <p style={{ color: c.textSecondary, fontSize: "13px" }}>
          Track your leads through each stage of the sales funnel.
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            items={col.items}
            total={col.total}
            onMove={moveLead}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  status: Lead["status"];
  items: Lead[];
  total: number;
  onMove: (id: string, newStatus: Lead["status"]) => void;
  isDark: boolean;
}

function KanbanColumn({ status, items, total, onMove, isDark }: KanbanColumnProps) {
  const c = getThemeColors(isDark);
  const color = getStatusColor(status, isDark);
  const ss = getStatusStyles(isDark);
  const statusStyle = ss[status];

  return (
    <div
      className="rounded-lg flex flex-col"
      style={{
        backgroundColor: c.cardBg,
        border: `1px solid ${c.border}`,
        minHeight: "500px",
      }}
    >
      {/* Color bar */}
      <div className="rounded-t-lg" style={{ height: "3px", backgroundColor: color }} />

      {/* Header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs uppercase font-semibold tracking-wide"
            style={{ color: c.textSecondary }}
          >
            {status}
          </span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
          >
            {items.length}
          </span>
        </div>
        <span className="text-xs" style={{ color: c.textSecondary }}>
          {formatCurrency(total)} total
        </span>
      </div>

      {/* Cards */}
      <div className="px-3 pb-3 flex-1 space-y-2.5">
        {items.map((lead) => (
          <KanbanCard key={lead._id} lead={lead} onMove={onMove} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

interface KanbanCardProps {
  lead: Lead;
  onMove: (id: string, newStatus: Lead["status"]) => void;
  isDark: boolean;
}

function KanbanCard({ lead, onMove, isDark }: KanbanCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const c = getThemeColors(isDark);
  const ac = getThemedAvatarColor(lead.name, isDark);
  const dotColor = getStatusColor(lead.status, isDark);
  const otherStatuses = stages.filter((s) => s !== lead.status);

  const cardBg = c.hoverBg;
  const cardHoverBg = c.cardHoverBg;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div
      className="rounded-md cursor-pointer"
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${c.border}`,
        padding: "14px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = c.accent;
        e.currentTarget.style.backgroundColor = cardHoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.backgroundColor = cardBg;
      }}
    >
      {/* Row 1: Name + dot */}
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium" style={{ color: c.textPrimary }}>
          {lead.name}
        </span>
        <div
          className="w-2 h-2 rounded-full shrink-0 mt-1.5"
          style={{ backgroundColor: dotColor }}
        />
      </div>

      {/* Row 2: Company */}
      <div className="text-xs mt-1" style={{ color: c.textSecondary }}>
        {lead.company}
      </div>

      {/* Row 3: Value */}
      <div className="text-sm font-bold mt-2" style={{ color: c.success }}>
        {formatCurrency(lead.value)}
      </div>

      {/* Divider */}
      <div className="my-2.5" style={{ borderTop: `1px solid ${c.border}` }} />

      {/* Row 4: Avatar + Move to */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: ac.bg,
              color: ac.text,
              fontSize: "9px",
              fontWeight: 600,
            }}
          >
            {getInitials(lead.assignedTo)}
          </div>
          <span className="text-xs" style={{ color: c.textSecondary }}>
            {lead.assignedTo}
          </span>
        </div>

        {/* Move to dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            className="text-xs px-2 py-1 rounded"
            style={{
              color: c.textSecondary,
              border: `1px solid ${c.border}`,
              backgroundColor: "transparent",
              fontSize: "11px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.appBg)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Move to ▾
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 bottom-full mb-1 rounded-md py-1 z-20 min-w-28"
              style={{
                backgroundColor: c.dropdownBg,
                border: `1px solid ${c.border}`,
                boxShadow: c.shadow,
              }}
            >
              {otherStatuses.map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove(lead._id, s);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs"
                  style={{ color: c.textPrimary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = c.hoverBg)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: getStatusColor(s, isDark) }}
                  />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
