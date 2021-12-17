import React from "react";
import {
  XYChart as BaseXYChart,
  Tooltip,
  AreaStack,
  AreaSeries,
  Axis,
  Grid,
} from "@visx/xychart";

export type XYChartProps = {
  height?: number;
  groups: TopicPopularity[];
  activeTopics: string[];
  setActiveTopic?: (topic: string) => void;
  yLabel: string;
  xLabel: string;
};

interface TopicPopularity {
  date: string;
  [topic: string]: string;
}

const getDate = (d: TopicPopularity) => d.date;
const getCount = (topic: string) => (d: TopicPopularity) => d[topic];
const numTicks = 7;

export const XYChart = ({
  height,
  groups,
  activeTopics,
  setActiveTopic,
  yLabel,
  xLabel,
}: XYChartProps) => {
  const accessors = React.useMemo(
    () => ({
      x: getDate,
      y: getCount,
      date: getDate,
    }),
    []
  );

  return (
    <BaseXYChart
      height={height || 720}
      xScale={{ type: "band" }}
      yScale={{ type: "linear" }}
      onPointerUp={(d) => {
        setActiveTopic && setActiveTopic(d.key);
      }}
    >
      <Axis
        orientation="bottom"
        label={xLabel}
        numTicks={numTicks}
      />
      <Axis
        orientation="left"
        label={yLabel}
        numTicks={numTicks}
      />
      <Grid columns={false} numTicks={numTicks} />
      <AreaStack offset="none">
        {activeTopics.map((topic) => (
          <AreaSeries
            key={topic}
            dataKey={topic}
            data={groups}
            xAccessor={accessors.x}
            yAccessor={accessors.y(topic)}
            fillOpacity={0.4}
          />
        ))}
      </AreaStack>
      <Tooltip<TopicPopularity>
        showHorizontalCrosshair
        showVerticalCrosshair
        renderTooltip={({ tooltipData, colorScale }) => (
          <>
            {(tooltipData?.nearestDatum?.datum &&
              accessors.date(tooltipData?.nearestDatum?.datum)) ||
              "No date"}
            <br />
            <br />
            {Object.keys(tooltipData?.datumByKey ?? {}).map((topic) => {
              const count =
                tooltipData?.nearestDatum?.datum &&
                accessors.y(topic)(tooltipData?.nearestDatum?.datum);

              return (
                <div key={topic}>
                  <em
                    style={{
                      color: colorScale?.(topic),
                      textDecoration:
                        tooltipData?.nearestDatum?.key === topic
                          ? "underline"
                          : undefined,
                    }}
                  >
                    {topic}
                  </em>{" "}
                  {count == null || Number.isNaN(count) ? "0" : count}
                </div>
              );
            })}
          </>
        )}
      />
      )
    </BaseXYChart>
  );
};
