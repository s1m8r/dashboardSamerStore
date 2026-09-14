import TabsRouter from "@/components/layout/tabs";
import { Outlet, createFileRoute } from "@tanstack/react-router";
/* eslint-disable react-refresh/only-export-components */
export const Route = createFileRoute("/(protected)/(home)")({
  component: ProductsLayout,
});

function ProductsLayout() {
  const items = [
    {
      name: "Overview",
      path: "/",
    },
    {
      name: "Users",
      path: "/statisticsusers",
    },
    {
      name: "Stores",
      path: "/statisticsStores",
    },
    {
      name: "Products",
      path: "/statisticsproducts",
    },
  ];
  return (
    <main className="p-5 w-full">
      <TabsRouter items={items} />
      <Outlet />
    </main>
  );
}
