import { useState, useMemo, } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useLeads } from "../context/LeadsContext";
import { useTheme } from "../context/ThemeContext";
import LeadModal from "../components/LeadModal";
import { formatCurrency, getInitials, type Lead } from "../data/mockData";
import { getThemeColors, getStatusStyles, getThemedAvatarColor } from "../data/themeColors";
export default function Leads() {
  const {
  leads,
  addLead,
  updateLead,
  deleteLead,
} = useLeads();
  const { isDark } = useTheme();
  const c = getThemeColors(isDark);
  const ss = getStatusStyles(isDark);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        !search ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.company.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [leads, search, statusFilter]);

  const totalValue = filtered.reduce((sum, l) => sum + l.value, 0);

  const handleSave = async (
  lead: Lead | Omit<Lead, "_id">
) => {
    if ("_id" in lead) {
     await updateLead(lead as Lead);
    } else {
      await addLead(lead);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingLead(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
  await deleteLead(id);
  setDeleteConfirm(null);
};

  const inputStyle: React.CSSProperties = {
    backgroundColor: c.inputBg,
    border: `1px solid ${c.border}`,
    color: c.textPrimary,
    borderRadius: "6px",
    padding: "8px 12px",
    outline: "none",
    fontSize: "14px",
  };
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: c.textHeading, fontSize: "22px" }}>
            Leads
          </h1>
          <p style={{ color: c.textSecondary, fontSize: "13px" }}>
            Manage and track all your sales leads.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
          style={{ backgroundColor: c.buttonBg, color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.buttonHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.buttonBg)}
        >
          <Plus size={16} />
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: c.textSecondary }}
          />
          <input
            type="text"
            placeholder="Search by name or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: "36px", width: "280px" }}
            onFocus={(e) => (e.target.style.borderColor = c.accent)}
            onBlur={(e) => (e.target.style.borderColor = c.border)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...inputStyle, width: "140px", cursor: "pointer" }}
          onFocus={(e) => (e.target.style.borderColor = c.accent)}
          onBlur={(e) => (e.target.style.borderColor = c.border)}
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: c.cardBg, border: `1px solid ${c.border}` }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: c.tableHeaderBg, borderBottom: `1px solid ${c.border}` }}>
              {["NAME", "COMPANY", "PHONE", "STATUS", "DEAL VALUE", "ASSIGNED TO", "ACTIONS"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-semibold"
                    style={{
                      color: c.textSecondary,
                      fontSize: "11px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead, i) => {
              const ac = getThemedAvatarColor(lead.name, isDark);
              const statusStyle = ss[lead.status];
              const altBg = i % 2 === 1 ? c.rowAlt : "transparent";
              return (
                <tr key={lead._id ?? lead.email}
                  style={{
                    borderBottom: `1px solid ${c.border}`,
                    backgroundColor: altBg,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = c.hoverBg)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = altBg)
                  }
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                        style={{
                          backgroundColor: ac.bg,
                          color: ac.text,
                          width: "34px",
                          height: "34px",
                        }}
                      >
                        {getInitials(lead.name)}
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: c.textPrimary }}
                      >
                        {lead.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: c.textBody }}>
                    {lead.company}
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: c.textBody }}>
                    {lead.phone}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3.5 text-sm font-medium"
                    style={{ color: c.success }}
                  >
                    {formatCurrency(lead.value)}
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: c.textBody }}>
                    {lead.assignedTo}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(lead)}
                        className="p-1.5 rounded"
                        style={{ color: c.accent }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = c.editHoverBg)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <Pencil size={15} />
                      </button>
                      {deleteConfirm === lead._id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: c.danger, color: isDark ? "#1D2125" : "#FFFFFF" }}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded text-xs"
                            style={{ color: c.textSecondary }}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(lead._id)}
                          className="p-1.5 rounded"
                          style={{ color: c.danger }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = c.deleteHoverBg)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "transparent")
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-sm"
                  style={{ color: c.textSecondary }}
                >
                  No leads found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Summary */}
        <div
          className="px-4 py-3 text-xs"
          style={{ color: c.textSecondary, borderTop: `1px solid ${c.border}` }}
        >
          Showing {filtered.length} leads · Total pipeline value:{" "}
          {formatCurrency(totalValue)}
        </div>
      </div>

      {/* Modal */}
      <LeadModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSave}
        lead={editingLead}
      />
    </div>
  );
}
