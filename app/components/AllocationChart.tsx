"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AllocationChartProps {
  fb: number;
  gg: number;
  tt: number;
}

export function AllocationChart({ fb, gg, tt }: AllocationChartProps) {
  const data = {
    labels: ["Facebook", "Google", "TikTok"],
    datasets: [
      {
        data: [fb, gg, tt],
        backgroundColor: ["#7c3aed", "#ffffff", "#27272a"],
        borderColor: "#050505",
        borderWidth: 10,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
