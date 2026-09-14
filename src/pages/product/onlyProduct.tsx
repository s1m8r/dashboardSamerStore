import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Package, Pencil, Star, Store, Tag, Trash2 } from "lucide-react";

import { useGetProduct } from "@/API/product";
import { useGetTypes } from "@/API/types";
import { useGetColors } from "@/API/colors";
import { Can } from "@/components/functions/can";
import { Button } from "@/components/ui/button";
import Padding from "@/components/layout/padding";
import TitleContent from "@/components/layout/titleContent";
import { Spinner } from "@/components/ui/spinner";
import { usepermissions } from "@/stores/usePermissions";
import { Route } from "@/routes/(protected)/products/product/$id";
import DeleteProduct from "./deleteProduct";

const OnlyProduct = () => {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: product } = useGetProduct(id);
  const { data: types } = useGetTypes();
  const { data: colors } = useGetColors();

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showDel, setShowDel] = useState(false);

  if (!product) {
    return (
      <Padding>
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      </Padding>
    );
  }

  const typeName =
    types?.data.find((item) => item.value === product.type)?.name ??
    product.type;
  const colorName = (value: string) =>
    colors?.data.find((item) => item.color === value)?.path ?? value;

  const gallery = [product.image, ...(product.images ?? [])].filter(Boolean);
  const mainImage = activeImage ?? gallery[0];
  const hasDiscount = (product.discountPercentage ?? 0) > 0;
  const finalPrice =
    product.price - (product.price * (product.discountPercentage ?? 0)) / 100;

  return (
    <Padding>
      <TitleContent title={product.name} />

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full shrink-0 md:w-72">
            <div className="h-64 w-full rounded-xl bg-black p-4 ring-1 ring-border">
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {gallery.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(src)}
                    aria-label={`View image ${index + 1}`}
                    className={`size-14 rounded-lg bg-black p-1 ring-1 transition ${
                      src === mainImage
                        ? "ring-primary"
                        : "ring-border hover:ring-muted-foreground"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  {product.name}
                </h2>
                <Link
                  to="/stores/store/$id"
                  params={{ id: product.storeId }}
                  search={{ from: "/products" }}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <Store className="size-4" />
                  {product.storeName}
                </Link>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">
                {product.rating}
                <Star className="size-4 fill-amber-500 text-amber-500" />
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-semibold tabular-nums text-foreground">
                ${finalPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-muted-foreground line-through tabular-nums">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    -{product.discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <Tag className="size-3" />
                {typeName}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <Package className="size-3" />
                Badge {product.badge}
              </span>
            </div>

            {product.colors?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Colors
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      <span
                        className="size-3 rounded-full ring-1 ring-border"
                        style={{ backgroundColor: color }}
                      />
                      {colorName(color)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-1 text-sm font-medium text-foreground">
                Description
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Can permission={usepermissions.updateProducts}>
                <Button
                  variant="default"
                  onClick={() =>
                    navigate({
                      to: "/products/edit/$id",
                      params: { id: product.id! },
                    })
                  }
                >
                  <Pencil />
                  Edit
                </Button>
              </Can>
              <Can permission={usepermissions.deleteProducts}>
                <Button variant="destructive" onClick={() => setShowDel(true)}>
                  <Trash2 />
                  Delete
                </Button>
              </Can>
            </div>
          </div>
        </div>
      </div>

      {showDel && (
        <DeleteProduct
          productId={product.id!}
          productName={product.name}
          setShowDel={setShowDel}
        />
      )}
    </Padding>
  );
};

export default OnlyProduct;
