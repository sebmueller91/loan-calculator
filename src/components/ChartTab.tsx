"use client";

import { type CalculationResult } from "@/lib/calculations";
import { formatDateShort, formatCurrencyShort } from "@/lib/format";
import { useSettings } from "@/lib/settings";
import { t, getLocale } from "@/lib/i18n";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ChartTabProps {
  result: CalculationResult | null;
}

export default function ChartTab({ result }: ChartTabProps) {
  const { settings, currencySymbol } = useSettings();
  const lang = settings.language;
  const locale = getLocale(lang);

  if (!result || result.schedule.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-text-secondary text-center">
        <div>
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <p className="font-medium">{t("chart.empty", lang)}</p>
          <p className="text-sm mt-1">{t("chart.emptyHint", lang)}</p>
        </div>
      </div>
    );
  }

  const schedule = result.schedule;
  const step = Math.max(1, Math.floor(schedule.length / 120));
  const chartData = schedule
    .filter((_, i) => i % step === 0 || i === schedule.length - 1)
    .map((entry) => ({
      date: formatDateShort(entry.date, locale),
      remainingDebt: entry.remainingDebt,
      totalPayment: entry.totalPayment,
    }));

  const remainingLabel = t("chart.remainingDebt", lang);
  const paymentsLabel = t("chart.sumPayments", lang);

  return (
    <div className="flex-1 flex flex-col bg-surface-alt p-4">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#64748b" }}
              interval={Math.max(0, Math.floor(chartData.length / 5) - 1)}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 10, fill: "#e74c3c" }}
              tickFormatter={(v) => formatCurrencyShort(v, locale)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10, fill: "#1a5276" }}
              tickFormatter={(v) => formatCurrencyShort(v, locale)}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => [
                `${formatCurrencyShort(Number(value) || 0, locale)} ${currencySymbol}`,
                name === "remainingDebt" ? remainingLabel : paymentsLabel,
              ]}
              labelStyle={{ fontSize: 12 }}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) =>
                value === "remainingDebt" ? remainingLabel : paymentsLabel
              }
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="remainingDebt"
              stroke="#e74c3c"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalPayment"
              stroke="#1a5276"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
