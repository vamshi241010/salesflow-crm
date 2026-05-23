import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, Star, IndianRupee } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLeads } from "../context/LeadsContext";
import { formatCurrency, getInitials } from "../data/mockData";
import {
  getThemeColors,
  getStatusStyles,
  getThemedAvatarColor,
  getStatCardIconStyles,
  getBarChartColors,
} from "../data/themeColors";

export default function Dashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { leads } = useLeads();
  const navigate = useNavigate();
  const [chartTab, setChartTab] = useState<"week" | "month">("week");

  const c = getThemeColors(isDark);
  const statIcons = getStatCardIconStyles(isDark);
  const barColors = getBarChartColors(isDark);
  const ss = getStatusStyles(isDark);
  if(!leads)return null;

  const stats = useMemo(() => {
    const closed = leads.filter((l) => l.status === "Closed").length;
    const interested = leads.filter((l) => l.status === "Interested").length;
    const totalValue = leads.reduce((sum, l) => sum + l.value, 0);
    return { total: leads.length, closed, interested, totalValue };
  }, [leads]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = { New: 0, Contacted: 0, Interested: 0, Closed: 0 };
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return [
      { name: "New", count: counts.New },
      { name: "Contacted", count: counts.Contacted },
      { name: "Interested", count: counts.Interested },
      { name: "Closed", count: counts.Closed },
    ];
  }, [leads]);

  const recentLeads = [...leads]
  .sort(
    (a, b) =>
      new Date(b.createdAt || "").getTime() -
      new Date(a.createdAt || "").getTime()
  )
  .slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-md px-3 py-2 text-sm"
          style={{
            backgroundColor: c.hoverBg,
            border: `1px solid ${c.border}`,
            color: c.textPrimary,
          }}
        >
          <p className="font-medium">{label}</p>
          <p style={{ color: c.textSecondary }}>Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: c.textHeading, fontSize: "22px" }}>
          Good morning, {user?.name || "User"}
        </h1>
        <p style={{ color: c.textSecondary, fontSize: "13px" }}>
          Here's what's happening with your pipeline today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          iconBg={statIcons.leads.bg}
          iconColor={statIcons.leads.color}
          value={String(stats.total)}
          label="Total Leads"
          trend="+2 this week"
          trendColor={c.success}
          trendIcon="↑"
        />
        <StatCard
          icon={CheckCircle}
          iconBg={statIcons.closed.bg}
          iconColor={statIcons.closed.color}
          value={String(stats.closed)}
          label="Closed Deals"
          trend="+1 this week"
          trendColor={c.success}
          trendIcon="↑"
        />
        <StatCard
          icon={Star}
          iconBg={statIcons.interested.bg}
          iconColor={statIcons.interested.color}
          value={String(stats.interested)}
          label="Interested"
          trend="In progress"
          trendColor={c.warning}
        />
        <StatCard
          icon={IndianRupee}
          iconBg={statIcons.revenue.bg}
          iconColor={statIcons.revenue.color}
          value={formatCurrency(stats.totalValue)}
          label="Total Revenue"
          trend="Pipeline value"
          trendColor={c.purple}
        />
      </div>

      {/* Bar Chart */}
      <div
        className="rounded-lg p-6 mb-6"
        style={{ backgroundColor: c.cardBg, border: `1px solid ${c.border}` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium" style={{ color: c.textPrimary, fontSize: "15px" }}>
            Leads by Stage
          </h2>
          <div className="flex rounded-md overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
            {(["week", "month"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setChartTab(tab)}
                className="px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: chartTab === tab ? c.activeNavBg : "transparent",
                  color: chartTab === tab ? c.accent : c.textSecondary,
                }}
              >
                {tab === "week" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barCategoryGap="25%">
            <CartesianGrid stroke={c.border} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: c.textSecondary, fontSize: 12 }}
              axisLine={{ stroke: c.border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: c.textSecondary, fontSize: 12 }}
              axisLine={{ stroke: c.border }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)" }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Leads Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: c.cardBg, border: `1px solid ${c.border}` }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-base font-medium" style={{ color: c.textPrimary, fontSize: "15px" }}>
            Recent Leads
          </h2>
          <button
            onClick={() => navigate("/leads")}
            className="text-xs font-medium"
            style={{ color: c.accent }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            View all →
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}` }}>
              {["NAME", "COMPANY", "STATUS", "DEAL VALUE", "ASSIGNED TO"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-2.5 font-semibold"
                  style={{
                    color: c.textSecondary,
                    fontSize: "11px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentLeads.map((lead) => {
              const ac = getThemedAvatarColor(lead.name, isDark);
              const statusStyle = ss[lead.status];
              return (
                <tr
                  key={lead._id}
                  className="transition-colors"
                  style={{ borderBottom: `1px solid ${c.border}` }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = c.hoverBg)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                        style={{ backgroundColor: ac.bg, color: ac.text }}
                      >
                        {getInitials(lead.name)}
                      </div>
                      <span className="text-sm" style={{ color: c.textPrimary }}>
                        {lead.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: c.textBody }}>
                    {lead.company}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td
                    className="px-5 py-3 text-sm font-medium"
                    style={{ color: c.success }}
                  >
                    {formatCurrency(lead.value)}
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: c.textBody }}>
                    {lead.assignedTo}
                  </td>
                </tr>
              );
            })}
            {recentLeads.length === 0 && (
  <tr>
    <td
      colSpan={5}
      className="text-center py-10 text-sm"
      style={{ color: c.textSecondary }}
    >
      No recent leads found.
    </td>
  </tr>
)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
