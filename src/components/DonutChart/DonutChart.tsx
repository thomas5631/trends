import React from "react";
import Pie from "@visx/shape/lib/shapes/Pie";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";

interface ChartSlice {
  label: string;
  percentage: number;
}

export type DonutChartProps = {
  width: number;
  height: number;
  thickness: number;
  data: ChartSlice[];
};

export const DonutChart = ({
  width,
  height,
  data,
  thickness,
}: DonutChartProps) => {
  const radius = Math.min(width, height) / 2;
  const centerY = height / 2;
  const centerX = width / 2;
  const getBrowserColor = scaleOrdinal({
    domain: data.map((d) => d.label),
    range: [
        'rgba(255,255,0,0.7)',
        'rgba(255,0,255,0.6)',
        'rgba(0,255,255,0.5)',
        'rgba(255,0,0,0.4)',
        'rgba(0,0,255,0.3)',
        'rgba(0,255,0,0.2)',
        'rgba(0,0,0,0.1)',
      ],
  });

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        <Pie
          data={data}
          pieValue={(d: ChartSlice) => d.percentage}
          outerRadius={radius}
          innerRadius={radius - thickness}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) =>
            pie.arcs.map((arc) => (
              <g key={arc.data.label.toString()}>
                <path
                  d={pie.path(arc) || undefined}
                  fill={getBrowserColor(arc.data.label)}
                />
              </g>
            ))
          }
        </Pie>
      </Group>
    </svg>
  );
};
