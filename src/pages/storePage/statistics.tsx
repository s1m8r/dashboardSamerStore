import { useGetProducts } from "@/API/product";
import { useGetStores } from "@/API/store";
import { Colors } from "@/components/constants/colors";
import CardNew from "@/components/layout/cardNew";
import ChartBar from "@/components/layout/charts/barChart";
import { LineChartItems } from "@/components/layout/charts/lineChart";
import ChartPie from "@/components/layout/charts/pieChart";
import ComboboxItems from "@/components/layout/combobox";
import DesignCard from "@/components/layout/DesignCard";
import Padding from "@/components/layout/padding";
import Title from "@/components/layout/title";
import { PackageIcon, Store, TrendingUp } from "lucide-react";
import { useState } from "react";

const StatisticsStores = () => {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState("");
  const [time, setTime] = useState("");
  const { data: stores } = useGetStores("rating", "desc", 1, search);
  const ratingStore = stores?.data.find((item) => item.name === select);
  const { data: product } = useGetProducts("storeName", "asc", 1, select);
  const { data: limit } = useGetProducts("id", "asc", 1, select, 9999999, time);
  const dataStores =
    stores?.data.map((item) => ({
      id: item.id!,
      name: item.name,
    })) ?? [];
  const chartStores =
    stores?.data.map((item) => ({
      rating: item.rating,
      name: item.name.slice(0, 12),
    })) ?? [];
  const DataProducts = product?.data.map((item) => ({
    name: item.name,
    badge: item.badge,
    fill: Colors[item.badge % Colors.length],
  }));

  const dataLimit =
    limit?.data.map((item) => ({
      createdAt: item.createdAt!,
    })) ?? [];

  return (
    <Padding>
      <Title
        children="Stores Analytics"
        description="View product ratings and badge distribution."
      />
      <ComboboxItems
        data={dataStores}
        setSearch={setSearch}
        setSelect={setSelect}
      />
      <DesignCard>
        <CardNew
          name="Stores"
          count={stores?.pagination.totalItems ?? 0}
          icon={<Store />}
        />
        <CardNew
          name="Top Rating"
          count={stores?.data[0]?.rating ?? 0}
          itemSelect={stores?.data[0]?.name ?? ""}
          icon={<TrendingUp />}
        />
        {select && (
          <CardNew
            name={`Rating`}
            count={ratingStore?.rating ?? 0}
            itemSelect={ratingStore?.name ?? ""}
            icon={<TrendingUp />}
          />
        )}
        <CardNew
          name="Products"
          count={product?.pagination.totalItems ?? 0}
          icon={<PackageIcon />}
        />
      </DesignCard>
      <div className="grid gap-6 xl:grid-cols-12 w-full">
        <div className="xl:col-span-8">
          <ChartBar
            chartData={chartStores}
            title="Stores Rating"
            descriptionTitle="Comparison of ratings across stores"
          />
        </div>
        <div className="xl:col-span-4">
          <ChartPie chartData={DataProducts ?? []} />
        </div>
      </div>
      <div className="min-w-full">
        <LineChartItems data={dataLimit} setTime={setTime} />
      </div>
    </Padding>
  );
};

export default StatisticsStores;
