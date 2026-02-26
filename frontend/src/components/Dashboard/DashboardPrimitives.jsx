import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";

const iconToneClasses = {
  campus: "dashboard-stat-icon-campus",
  info: "dashboard-stat-icon-info",
  warning: "dashboard-stat-icon-warning",
  success: "dashboard-stat-icon-success",
  danger: "dashboard-stat-icon-danger",
  neutral: "dashboard-stat-icon-neutral",
};

const trendToneClasses = {
  positive: "dashboard-stat-trend-positive",
  negative: "dashboard-stat-trend-negative",
  neutral: "dashboard-stat-trend-neutral",
};

const resolveTrend = (trend) => {
  if (typeof trend !== "number") return null;
  if (trend > 0) return { icon: ArrowUpRight, tone: "positive", label: `+${trend}%` };
  if (trend < 0) return { icon: ArrowDownRight, tone: "negative", label: `${trend}%` };
  return { icon: TrendingUp, tone: "neutral", label: `${trend}%` };
};

export const DashboardHero = ({ id = "dashboard", tone = "campus", className = "", children }) => (
  <section
    id={id}
    data-dashboard-section="true"
    className={`motion-section dashboard-hero dashboard-hero-${tone} ${className}`.trim()}
  >
    <div className="dashboard-hero-orb dashboard-hero-orb-primary" />
    <div className="dashboard-hero-orb dashboard-hero-orb-secondary" />
    <div className="dashboard-hero-inner">{children}</div>
  </section>
);

const DashboardStatCard = ({ item }) => {
  const Icon = item.icon;
  const trend = resolveTrend(item.trend);
  const TrendIcon = trend?.icon;

  return (
    <article className="dashboard-stat-card saas-card interactive-surface">
      <div className={`dashboard-stat-icon ${iconToneClasses[item.tone] || iconToneClasses.campus}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="dashboard-stat-label">{item.label}</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="dashboard-stat-value">{item.value}</p>
          {trend && TrendIcon && (
            <span className={`dashboard-stat-trend ${trendToneClasses[trend.tone]}`}>
              <TrendIcon size={12} />
              {trend.label}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export const DashboardStatGrid = ({ items, className = "" }) => (
  <section className={`motion-section motion-grid dashboard-stat-grid ${className}`.trim()}>
    {items.map((item) => (
      <DashboardStatCard key={item.label} item={item} />
    ))}
  </section>
);
