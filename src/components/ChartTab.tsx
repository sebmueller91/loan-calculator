"use client";

import { type CalculationResult } from "@/lib/calculations";
import { formatCurrency, formatDateShort, formatDate } from "@/lib/format";
import { useSettings } from "@/lib/settings";
import { t, getLocale } from "@/lib/i18n";

interface ChartTabProps {
  result: CalculationResult | null;
  onGoCalc: () => void;
}

export default function ChartTab({ result, onGoCalc }: ChartTabProps) {
  const { settings, currencySymbol } = useSettings();
  const lang = settings.language;
  const locale = getLocale(lang);
  const decimals = settings.decimalPlaces;

  if (!result || result.schedule.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <EmptyState
          title={t("chart.empty", lang)}
          body={t("chart.emptyHint", lang)}
          onAction={onGoCalc}
          actionLabel={lang === "de" ? "Zum Rechner" : "Go to Calculator"}
        />
      </div>
    );
  }

  const rows = result.schedule;
  const fmtCur = (v: number) => `${formatCurrency(v, locale, decimals)} ${currencySymbol}`;

  // Sample to ~80 points for clean curve
  const N = Math.min(80, rows.length);
  const step = rows.length / N;
  const samples: { i: number; date: Date; balance: number; paid: number }[] = [];
  let cum = 0;
  for (let i = 0; i < rows.length; i++) {
    cum += rows[i].interest + rows[i].principal + rows[i].extraPayment;
    if (i === 0 || i === rows.length - 1 || Math.floor(i / step) !== Math.floor((i - 1) / step)) {
      samples.push({ i: rows[i].month, date: rows[i].date, balance: rows[i].remainingDebt, paid: cum });
    }
  }

  // Chart geometry
  const W = 448, H = 240;
  const PAD = { l: 8, r: 8, t: 14, b: 28 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const maxBal = result.loanAmount;
  const maxPaid = result.totalPayment;

  const xAt = (idx: number) => PAD.l + (innerW * idx) / (samples.length - 1);
  const yBalAt = (v: number) => PAD.t + innerH * (1 - v / maxBal);
  const yPaidAt = (v: number) => PAD.t + innerH * (1 - v / maxPaid);

  // Smooth path via Catmull-Rom
  function smoothPath(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const tension = 0.18;
      const c1x = p1.x + (p2.x - p0.x) * tension;
      const c1y = p1.y + (p2.y - p0.y) * tension;
      const c2x = p2.x - (p3.x - p1.x) * tension;
      const c2y = p2.y - (p3.y - p1.y) * tension;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  const balPts = samples.map((s, i) => ({ x: xAt(i), y: yBalAt(s.balance) }));
  const paidPts = samples.map((s, i) => ({ x: xAt(i), y: yPaidAt(s.paid) }));

  const balPath = smoothPath(balPts);
  const paidPath = smoothPath(paidPts);
  const balArea = `${balPath} L ${PAD.l + innerW} ${PAD.t + innerH} L ${PAD.l} ${PAD.t + innerH} Z`;
  const paidArea = `${paidPath} L ${PAD.l + innerW} ${PAD.t + innerH} L ${PAD.l} ${PAD.t + innerH} Z`;

  // X-axis labels
  const xLabels = [0, Math.floor(samples.length / 2), samples.length - 1].map((i) => ({
    x: xAt(i),
    label: formatDateShort(samples[i].date, locale),
  }));

  // Crossover
  const crossIdx = samples.findIndex((s) => s.paid >= s.balance);
  const crossover = crossIdx >= 0 ? samples[crossIdx] : null;

  const startDate = rows[0].date;
  const endDate = rows[rows.length - 1].date;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-4.5 px-4 pt-1 pb-7">
        {/* Top stats */}
        <div className="grid grid-cols-2 gap-2.5">
          <StatTile
            color="var(--color-chart-a)"
            label={lang === "de" ? "Restschuld" : "Remaining Debt"}
            value={fmtCur(result.loanAmount)}
            sub={`${lang === "de" ? "Start" : "Start"} · ${formatDateShort(startDate, locale)}`}
          />
          <StatTile
            color="var(--color-chart-b)"
            label={lang === "de" ? "Gesamtzahlung" : "Total Payments"}
            value={fmtCur(result.totalPayment)}
            sub={`${lang === "de" ? "Ende" : "End"} · ${formatDateShort(endDate, locale)}`}
          />
        </div>

        {/* Chart card */}
        <div>
          <SectionLabel hint={lang === "de" ? "Gesamtlaufzeit" : "Over loan lifetime"}>
            {lang === "de" ? "Verlauf" : "Trajectory"}
          </SectionLabel>
          <Card>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-a)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--color-chart-a)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-b)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="var(--color-chart-b)" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                const y = PAD.t + innerH * tick;
                return (
                  <line key={tick} x1={PAD.l} x2={PAD.l + innerW} y1={y} y2={y}
                    stroke="var(--color-line)" strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />
                );
              })}

              {/* Areas */}
              <path d={balArea} fill="url(#balGrad)" />
              <path d={paidArea} fill="url(#paidGrad)" />

              {/* Lines */}
              <path d={balPath} fill="none" stroke="var(--color-chart-a)" strokeWidth="2.4" strokeLinecap="round" />
              <path d={paidPath} fill="none" stroke="var(--color-chart-b)" strokeWidth="2.4" strokeLinecap="round" />

              {/* Endpoints */}
              <circle cx={balPts[0].x} cy={balPts[0].y} r="4" fill="var(--color-chart-a)" />
              <circle cx={balPts[balPts.length - 1].x} cy={balPts[balPts.length - 1].y} r="4" fill="var(--color-chart-a)" />
              <circle cx={paidPts[paidPts.length - 1].x} cy={paidPts[paidPts.length - 1].y} r="4" fill="var(--color-chart-b)" />

              {/* Crossover marker */}
              {crossover && (() => {
                const cx = xAt(crossIdx);
                return (
                  <g>
                    <line x1={cx} x2={cx} y1={PAD.t} y2={PAD.t + innerH}
                      stroke="var(--color-text-secondary)" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
                    <circle cx={cx} cy={yBalAt(crossover.balance)} r="3.5" fill="var(--color-surface)" stroke="var(--color-text)" strokeWidth="1.4" />
                  </g>
                );
              })()}

              {/* X labels */}
              {xLabels.map((l, i) => (
                <text key={i} x={l.x} y={H - 8}
                  textAnchor={i === 0 ? "start" : i === xLabels.length - 1 ? "end" : "middle"}
                  fontSize="10" fill="var(--color-muted)" fontFamily="inherit">{l.label}</text>
              ))}
            </svg>

            {/* Legend */}
            <div className="flex justify-around mt-3 pt-3 text-xs text-text-secondary"
              style={{ borderTop: "1px solid var(--color-line)" }}>
              <LegendDot color="var(--color-chart-a)" label={lang === "de" ? "Restschuld" : "Remaining Debt"} />
              <LegendDot color="var(--color-chart-b)" label={lang === "de" ? "Gezahlt" : "Total Paid"} />
            </div>
          </Card>
        </div>

        {/* Crossover insight */}
        {crossover && (
          <Card soft>
            <div className="flex gap-3 items-start">
              <div className="text-primary mt-0.5">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v3" /><path d="M12 18v3" /><path d="M3 12h3" /><path d="M18 12h3" />
                  <path d="M5.5 5.5l2 2" /><path d="M16.5 16.5l2 2" /><path d="M5.5 18.5l2-2" /><path d="M16.5 7.5l2-2" />
                </svg>
              </div>
              <div className="text-[13px] text-text leading-relaxed">
                <strong className="font-serif font-semibold text-sm">
                  {lang === "de" ? "Kreuzungspunkt" : "Crossover"}
                </strong>
                {" — "}
                {lang === "de"
                  ? `Sie haben bis ${formatDate(crossover.date, locale)} (Monat ${crossover.i}) mehr bezahlt als Sie noch schulden.`
                  : `You'll have paid more than you still owe by ${formatDate(crossover.date, locale)} (month ${crossover.i}).`}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatTile({ color, label, value, sub }: { color: string; label: string; value: string; sub: string }) {
  return (
    <div style={{ background: "var(--color-surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--color-line)", padding: 14 }}>
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-[11px] font-semibold tracking-wider uppercase text-muted">{label}</span>
      </div>
      <div className="font-serif text-xl font-medium text-text mt-1.5" style={{ fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <div className="text-[11px] text-muted mt-0.5">{sub}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex justify-between items-baseline mb-2 px-1">
      <div className="text-[11px] tracking-widest uppercase text-muted font-semibold">{children}</div>
      {hint && <div className="text-[11px] text-muted">{hint}</div>}
    </div>
  );
}

function Card({ children, soft }: { children: React.ReactNode; soft?: boolean }) {
  return (
    <div style={{
      background: soft ? "var(--color-primary-soft)" : "var(--color-surface)",
      borderRadius: "var(--r-lg)",
      border: soft ? "none" : "1px solid var(--color-line)",
      padding: "var(--pad)",
    }}>
      {children}
    </div>
  );
}

function EmptyState({ title, body, onAction, actionLabel }: { title: string; body: string; onAction: () => void; actionLabel: string }) {
  return (
    <div className="flex flex-col items-center text-center px-7 py-14 gap-4">
      <div
        className="w-[72px] h-[72px] flex items-center justify-center text-primary"
        style={{ borderRadius: "var(--r-lg)", background: "var(--color-primary-soft)" }}
      >
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19V5" /><path d="M4 19h16" />
          <path d="M7 15c2-1 3-5 5-5s3 3 5 1.5 4-4.5 4-4.5" />
        </svg>
      </div>
      <div>
        <div className="font-serif text-[22px] font-medium text-text mb-1.5">{title}</div>
        <div className="text-sm text-text-secondary leading-relaxed">{body}</div>
      </div>
      <button
        onClick={onAction}
        className="mt-2 px-6 py-3 font-semibold text-[15px] cursor-pointer w-full"
        style={{
          background: "var(--color-primary)",
          color: "var(--color-primary-ink)",
          borderRadius: "var(--r-pill)",
          border: "none",
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}
