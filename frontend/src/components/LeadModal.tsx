import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getThemeColors } from "../data/themeColors";
import type { Lead } from "../data/mockData";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead | Omit<Lead, "_id">) => void;
  lead?: Lead | null;
}

const emptyForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  value: "",   // string only
  assignedTo: "",
  status: "New" as Lead["status"],
  notes: "",
};

export default function LeadModal({ isOpen, onClose, onSave, lead }: LeadModalProps) {
  const [form, setForm] = useState(emptyForm);
  const { isDark } = useTheme();
  const c = getThemeColors(isDark);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        company: lead.company,
        phone: lead.phone,
        email: lead.email,
        value: lead.value.toString(),
        assignedTo: lead.assignedTo,
        status: lead.status,
        notes: lead.notes || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.company.trim()) return;

    if (lead) {
  onSave({
    ...lead,
    ...form,
    value: Number(form.value),
  });
} else {
  onSave({
    ...form,
    value: Number(form.value),
  });
}
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: c.inputBg,
    border: `1px solid ${c.border}`,
    color: c.textPrimary,
    borderRadius: "6px",
    padding: "8px 12px",
    width: "100%",
    outline: "none",
    fontSize: "14px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    color: c.textSecondary,
    marginBottom: "4px",
    display: "block",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = c.accent;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = c.border;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl w-full max-w-lg mx-4"
        style={{
          backgroundColor: c.cardBg,
          border: `1px solid ${c.border}`,
          padding: "32px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ color: c.textPrimary }}>
            {lead ? "Edit Lead" : "Add Lead"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded"
            style={{ color: c.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget.style.color = c.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = c.textSecondary)}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row: Name + Company */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Company *</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>

          {/* Row: Phone + Email */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label style={labelStyle}>Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Deal Value */}
          <div className="mb-4">
            <label style={labelStyle}>Deal Value (₹)</label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Row: Assigned To + Status */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label style={labelStyle}>Assigned To</label>
              <input
                type="text"
                value={form.assignedTo}
                onChange={(e) => handleChange("assignedTo", e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={handleFocus as any}
                onBlur={handleBlur as any}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label style={labelStyle}>Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={handleFocus as any}
              onBlur={handleBlur as any}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md text-sm"
              style={{
                border: `1px solid ${c.border}`,
                color: c.textSecondary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md text-sm font-medium"
              style={{
                backgroundColor: c.buttonBg,
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.buttonHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.buttonBg)}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
