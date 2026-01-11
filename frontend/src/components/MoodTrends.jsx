"use client";

import React, { useMemo } from "react";
import useMoodEntries from "@/hooks/useMoodEntries";


export default function MoodTrends() {
  const { entries } = useMoodEntries();

  // ---- helpers (local midnight buckets) ----
  const startOfLocalDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const dayKey = (d) => startOfLocalDay(d).toISOString().slice(0, 10);
  const dayLabel = (d) =>
    d.toLocaleDateString(undefined, { weekday: "short" }); // Sun
  const dayMD = (d) =>
    d.toLocaleDateString(undefined, { month: "numeric", day: "numeric" }); // 11/9

  const lastNDays = (n, end = new Date()) => {
    const out = [];
    const endDay = startOfLocalDay(end);
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(endDay);
      d.setDate(endDay.getDate() - i);
      out.push(d);
    }
    return out;
  };

  // Parse entries
  const parsed = useMemo(
    () =>
      (entries || [])
        .map((e) => ({ ...e, dateObj: new Date(e.date) }))
        .filter((e) => !isNaN(e.dateObj.getTime())),
    [entries]
  );

  // Aggregate last 7 calendar days -> signed %:
  //   Happy = +intensity, Sad = -intensity, Neutral = 0
  const last7 = useMemo(() => {
    const days = lastNDays(7);
    const map = new Map();
    for (const e of parsed) {
      const k = dayKey(e.dateObj);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(e);
    }
    return days.map((d) => {
      const k = dayKey(d);
      const list = map.get(k) || [];
      // average signed percent for the day
      let signedValues = [];
      for (const it of list) {
        const pct = Number(it.intensity) || 0;
        if (it.mood === "Happy") signedValues.push(+pct);
        else if (it.mood === "Sad") signedValues.push(-pct);
        else signedValues.push(0); // Neutral
      }
      const val =
        signedValues.length
          ? signedValues.reduce((s, v) => s + v, 0) / signedValues.length
          : null;
      const signed = val == null ? null : Math.round(val * 10) / 10;

      return {
        key: k,
        label: `${dayLabel(d)} ${dayMD(d)}`,
        dow: dayLabel(d),
        valueSigned: signed,            // may be null if no entry
        valueSignedDisplay: signed ?? 0, // numeric for rendering continuity
        pos: signed != null && signed > 0 ? signed : 0,
        neg: signed != null && signed < 0 ? signed : 0,
        date: d,
      };
    });
  }, [parsed]);

  // Most recent actual value (not null)
  const lastVal = useMemo(() => {
    for (let i = last7.length - 1; i >= 0; i--) {
      if (last7[i].valueSigned != null) return last7[i].valueSigned;
    }
    return null;
  }, [last7]);

  const trendColor =
    lastVal == null ? "#6B7280" : lastVal > 0 ? "#059669" /* green-600 */ : "#DC2626" /* red-600 */;

  return (
    <div className="mx-auto max-w-6xl px-6 pt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Mood Trends</h2>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-muted-foreground text-sm">Mood Trend</div>
          <div
            className="text-4xl font-bold mt-1"
            style={{ color: trendColor }}
          >
            {lastVal == null ? "–" : `${lastVal > 0 ? "+" : ""}${lastVal}%`}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Last 7 days</div>
      </div>

      {/* Always show signed line; green above 0, red below 0 */}
      <div className="mt-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={last7} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
            <defs>
              {/* green */}
              <linearGradient id="moodFillPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              {/* red */}
              <linearGradient id="moodFillNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 6" vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              minTickGap={12}
              tickFormatter={(v) => v.split(" ")[0]} // show only weekday
            />

            <YAxis
              domain={[-100, 100]}
              tickCount={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />

            {/* 0% baseline */}
            <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="4 4" />

            <Tooltip
              contentStyle={{ borderRadius: 8 }}
              formatter={(_v, _n, { payload }) => {
                const p = payload || {};
                if (p.valueSigned == null) return ["No entry", "Mood"];
                const s = p.valueSigned > 0 ? `+${p.valueSigned}%` : `${p.valueSigned}%`;
                return [s, "Mood"];
              }}
              labelFormatter={(_, i) =>
                last7[i]?.date?.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              }
            />

            {/* Positive area/line */}
            <Area
              type="monotone"
              dataKey="pos"
              stroke="#059669"
              strokeWidth={2.2}
              fill="url(#moodFillPos)"
              isAnimationActive={false}
              connectNulls
            />
            {/* Negative area/line */}
            <Area
              type="monotone"
              dataKey="neg"
              stroke="#DC2626"
              strokeWidth={2.2}
              fill="url(#moodFillNeg)"
              isAnimationActive={false}
              connectNulls
            />

            {/* Today marker + last dot (colored by sign) */}
            <ReferenceLine
              x={last7.length - 1}
              stroke="#111827"
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
              label={{
                value: "Today",
                position: "insideTopRight",
                fill: "#6B7280",
                fontSize: 12,
                offset: 8,
              }}
            />
            {lastVal != null && (
              <ReferenceDot
                x={last7.length - 1}
                y={lastVal}
                r={5}
                fill={lastVal > 0 ? "#059669" : "#DC2626"}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
