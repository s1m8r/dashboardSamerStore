import { Link, useNavigate } from "@tanstack/react-router";
import OnlyCard from "./onlyCard";
import { useGetProducts } from "@/API/product";
import TitleContent from "@/components/layout/titleContent";
import { Clock, Mail, MapPin, Phone, Star, Tag } from "lucide-react";
import { useState } from "react";

interface Props {
  type: "products" | "stores";
  id: number;
  name: string;
  image: string;
  email: string;
  phone: string;
  website: string;
  categories: string[];
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  zipCode?: string;
  rating: number;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
}
export default function ContentStore({
  id,
  type,
  name,
  image,
  email,
  phone,
  website,
  categories,
  country,
  state,
  city,
  street,
  zipCode,
  rating,
  sunday,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
}: Props) {
  const [page, setPage] = useState(1);
  const { data } = useGetProducts("id", "asc", page, name);
  const products = data?.data.filter((item) =>
    type === "products" ? Number(item.id) !== Number(id) : true,
  );
  const navigator = useNavigate();

  const address = [street, city, state, country].filter(Boolean).join(", ");
  const hours = [
    { label: "Sun", value: sunday },
    { label: "Mon", value: monday },
    { label: "Tue", value: tuesday },
    { label: "Wed", value: wednesday },
    { label: "Thu", value: thursday },
    { label: "Fri", value: friday },
    { label: "Sat", value: saturday },
  ];

  return (
    <>
      <TitleContent title={name} />

      <div className="mb-10 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="h-48 w-full shrink-0 rounded-xl bg-black p-4 ring-1 ring-border md:h-56 md:w-56">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  {name}
                </h2>
                <Link
                  to={website}
                  className="text-sm text-primary hover:underline"
                >
                  {name} website
                </Link>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">
                {rating}
                <Star className="size-4 fill-amber-500 text-amber-500" />
              </span>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    <Tag className="size-3" />
                    {category}
                  </span>
                ))}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0 text-primary" />
                {email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 shrink-0 text-primary" />
                {phone}
              </div>
              {address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground sm:col-span-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    {address}
                    {zipCode && ` · ${zipCode}`}
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Clock className="size-4" />
                Opening Hours
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {hours.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg bg-muted px-1 py-2 text-xs"
                  >
                    <div className="font-semibold text-foreground">{label}</div>
                    <div className="mt-1 text-muted-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TitleContent title="Products" isRegister={true} />
      {!products?.length && (
        <div className="flex h-20 items-center justify-center text-muted-foreground">
          No other items
        </div>
      )}
      {products && products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((item) => (
            <OnlyCard
              key={item.id}
              productId={item.id!}
              type="products"
              name={item.name}
              image={item.image}
              onClick={() => navigator({ to: `/products/product/${item.id}` })}
            />
          ))}
        </div>
      )}
    </>
  );
}
