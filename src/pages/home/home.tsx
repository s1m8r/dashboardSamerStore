import { useGetUsers } from "@/API/user";
import { Package, StoreIcon, Trophy, Users2Icon } from "lucide-react";
import { useGetStores } from "@/API/store";
import { useGetProducts } from "@/API/product";
import Title from "@/components/layout/title";
import DesignCard from "@/components/layout/DesignCard";
import CardNew from "@/components/layout/cardNew";
import ChartBar from "@/components/layout/charts/barChart";
import ChartPie from "@/components/layout/charts/pieChart";
import { Colors } from "@/components/constants/colors";

const Home = () => {
  const { data: users } = useGetUsers();
  const { data: stores } = useGetStores();
  const { data: products } = useGetProducts("rating", "desc");
  const chartData =
    products?.data.map((item) => ({
      name: item.name,
      rating: item.rating,
    })) ?? [];
  const DataPin = products?.data.map((item) => ({
    name: item.name,
    badge: item.badge,
    fill: Colors[item.badge % Colors.length],
  }));
  return (
    <div className="w-full space-y-4 p-8">
      <Title
        children="Dashboard"
        description="Welcome to Dashboard Samer Store"
      />
      <DesignCard>
        <CardNew
          name="Users"
          count={users?.pagination.totalItems ?? 0}
          icon={<Users2Icon />}
          accent="primary"
        />
        <CardNew
          name="Stores"
          count={stores?.pagination.totalItems ?? 0}
          icon={<StoreIcon />}
          accent="emerald"
        />
        <CardNew
          name="Products"
          count={products?.pagination.totalItems ?? 0}
          icon={<Package />}
          accent="violet"
        />
        <CardNew
          name="Top Store"
          count={stores?.data[0]?.rating ?? 0}
          icon={<Trophy />}
          itemSelect={stores?.data[0]?.name ?? ""}
          accent="rose"
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
    </div>
  );
};

export default Home;
