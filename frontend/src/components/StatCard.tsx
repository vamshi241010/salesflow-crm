import type { LucideIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getThemeColors } from "../data/themeColors";

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  trend: string;
  trendColor: string;
  trendIcon?: string;
}

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  trend,
  trendColor,
  trendIcon,
}: StatCardProps) {
  const { isDark } = useTheme();
  const c = getThemeColors(isDark);

  return (
    <div
      className="rounded-lg p-5"
      style={{
        backgroundColor: c.cardBg,
        border: `1px solid ${c.border}`,
      }}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
          style={{ color: trendColor, backgroundColor: `${trendColor}15` }}
        >
          {trendIcon && <span>{trendIcon}</span>}
          {trend}
        </span>
      </div>

      {/* Value */}
      <div className="text-3xl font-bold mb-1" style={{ color: c.textPrimary }}>
        {value}
      </div>

      {/* Label */}
      <div
        className="text-xs uppercase tracking-wide font-medium"
        style={{ color: c.textSecondary }}
      >
        {label}
      </div>
    </div>
  );
}
