'use client';

import { useEffect, useRef } from 'react';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface CategoryChartsProps {
  materialCountByCategory: { category: string; count: number }[];
}

export default function CategoryCharts({ materialCountByCategory }: CategoryChartsProps) {
  const pieCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pieCanvasRef.current) {
      return;
    }

    const chart = new Chart(pieCanvasRef.current, {
      type: 'pie',
      data: {
        labels: materialCountByCategory.map((item) => item.category),
        datasets: [
          {
            data: materialCountByCategory.map((item) => item.count),
            backgroundColor: materialCountByCategory.map((_, index) => PIE_COLORS[index % PIE_COLORS.length]),
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
      },
    });

    return () => chart.destroy();
  }, [materialCountByCategory]);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm h-full">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8E8E93] mb-3">Distribución de materiales</p>
      <div style={{ height: 220 }}>
        <canvas ref={pieCanvasRef} />
      </div>
    </div>
  );
}
