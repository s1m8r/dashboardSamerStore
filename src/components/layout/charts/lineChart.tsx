"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface data {
  createdAt: string;
}
interface Props {
  data: data[];
  setTime: React.Dispatch<React.SetStateAction<string>>;
}
export function LineChartItems({ data, setTime }: Props) {
  const chartConfig = {
    views: {
      label: "Page Views",
    },
    product: {
      label: "product",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  const chartData = Object.values(
    data.reduce<Record<string, { date: string; product: number }>>(
      (acc, item) => {
        const date = item.createdAt.split("T")[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            product: 0,
          };
        }

        acc[date].product++;

        return acc;
      },
      {},
    ),
  );

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("product");

  const total = React.useMemo(
    () => ({
      product: chartData.reduce((acc, curr) => acc + curr.product, 0),
    }),
    [chartData],
  );
  const items = [
    { label: "24 Hours", value: "1" },
    { label: "1 Week", value: "7" },
    { label: "1 Month", value: "30" },
    { label: "3 Months", value: "90" },
    { label: "6 Months", value: "180" },
    { label: "1 Year", value: "365" },
    { label: "10 years", value: "3650" },
  ];
  const [value, Setvalue] = React.useState("90");
  React.useEffect(() => {
    const from = new Date();
    from.setDate(from.getDate() - Number(value));
    setTime(from.toString());
  }, [value, setTime]);
  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Line Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last {value} days
            <Select value={value} onValueChange={Setvalue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardDescription>
        </div>
        <div className="flex">
          {["product"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis allowDecimals={false} hide />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
