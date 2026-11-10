import { useGetProducts } from "@/API/product";
import { useGetStores } from "@/API/store";
import CardNew from "@/components/layout/cardNew";

import ChartBar from "@/components/layout/charts/barChart";
import ChartPie from "@/components/layout/charts/pieChart";
import ComboboxItems from "@/components/layout/combobox";
import Title from "@/components/layout/title";
import { Boxes, PackageIcon, Store, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Colors } from "@/components/constants/colors";
import Padding from "@/components/layout/padding";
import DesignCard from "@/components/layout/DesignCard";
const StatisticsProduct = () => {
  const sortBy = "rating";
  const sortOrder = "desc";
  const sortByBadge = "badge";
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState("");

  const { data } = useGetProducts(sortBy, sortOrder, 1, select);
  const { data: badge } = useGetProducts(sortByBadge, sortOrder, 1, select);
  const { data: stores } = useGetStores("id", "asc", 1, search);
  const chartData =
    data?.data.map((item) => ({
      name: item.name,
      rating: item.rating,
    })) ?? [];
  const DataStores =
    stores?.data.map((item) => ({
      id: item.id!,
      name: item.name,
    })) ?? [];

  const DataPin = data?.data.map((item) => ({
    name: item.name,
    badge: item.badge,
    fill: Colors[item.badge % Colors.length],
  }));

  return (
    <Padding>
      <Title
        children="Products Analytics"
        description="View product ratings and badge distribution."
      />
      <ComboboxItems
        data={DataStores}
        setSelect={setSelect}
        setSearch={setSearch}
      />
      <DesignCard>
        <CardNew
          name="Stores"
          count={stores?.pagination.totalItems ?? 0}
          icon={<Store />}
        />
        <CardNew
          name="Products"
          count={data?.pagination.totalItems ?? 0}
          icon={<PackageIcon />}
        />
        <CardNew
          name="Top Badge"
          count={badge?.data[0]?.badge ?? 0}
          icon={<Boxes />}
          itemSelect={badge?.data[0]?.name ?? ""}
        />
        <CardNew
          name="Top Rating"
          count={chartData[0]?.rating ?? 0}
          icon={<TrendingUp />}
          itemSelect={chartData[0]?.name ?? ""}
        />
      </DesignCard>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <ChartBar
            chartData={chartData}
            title="Products Rating"
            descriptionTitle="Top Rated Products"
          />
        </div>

        <div className="xl:col-span-4">
          <ChartPie chartData={DataPin ?? []} />
        </div>
      </div>
    </Padding>
  );
};

export default StatisticsProduct;
