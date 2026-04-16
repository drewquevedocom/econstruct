"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#B8963E", "#1C1C1E", "#6B6B6F", "#D4B96A", "#9A7B2F", "#E8E4DC"];

export default function LeadSourceChart({ data }: { data: Record<string, number> }) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  return (
    <div className="w-full max-w-[280px] mx-auto">
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: COLORS.slice(0, labels.length),
              borderWidth: 0,
            },
          ],
        }}
        options={{
          cutout: "65%",
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 12, padding: 16, font: { size: 12 } } },
          },
          responsive: true,
          maintainAspectRatio: true,
        }}
      />
    </div>
  );
}
