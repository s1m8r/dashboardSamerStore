import Table from "@/components/layout/table";
import z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ProductScema } from "@/schemas/product";
import { useDeleteProduct, useGetProducts } from "@/API/product";
import { useGetTypes } from "@/API/types";
import DeleteProduct from "./deleteProduct";
import { usepermissions } from "@/stores/usePermissions";
import { Can } from "@/components/functions/can";
import Padding from "@/components/layout/padding";
import IconButton from "@/components/layout/iconButton";
import { ArrowDownUp, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type productFormData = z.infer<typeof ProductScema>;

const ShowProduct = () => {
  const navigate = useNavigate();

  const [showDel, setShowDel] = useState(false);
  const [productId, setProductId] = useState<number>();
  const [productName, setProductName] = useState("");

  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const order = (value: string) => {
    if (sortBy === value) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(value);
      setSortOrder("asc");
    }
  };
  const goToAdd = () => {
    navigate({
      to: "/products/addproduct",
      search: {
        from: "/products",
      },
    });
  };
  const [search, setSearch] = useState("");

  const { data, isFetching } = useGetProducts(sortBy, sortOrder, page, search);

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  const { data: types } = useGetTypes();
  const typeName = (value: string) =>
    types?.data.find((item) => item.value === value)?.name ?? value;

  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const bulkDelete = async (ids: string[]) => {
    const results = await Promise.allSettled(
      ids.map((id) => deleteProduct({ id: Number(id) })),
    );
    const failed = results.filter((res) => res.status === "rejected").length;
    if (failed) {
      toast.error(`Failed to delete ${failed} of ${ids.length} products`);
    } else {
      toast.success(`Deleted ${ids.length} products successfully`);
    }
  };

  const columns: ColumnDef<productFormData>[] = [
    {
      accessorKey: "id",
      header: () => (
        <span
          className="group flex items-center gap-1 cursor-pointer"
          onClick={() => order("id")}
        >
          <ArrowDownUp
            size={12}
            className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
          <span>ID</span>
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: () => <span>Name</span>,
    },
    {
      accessorKey: "storeName",
      header: () => <span>Store</span>,
    },
    {
      accessorKey: "description",
      header: () => <span>Description</span>,
      cell: ({ row }) => (
        <p
          className="line-clamp-2 max-w-xs"
          title={row.original.description}
        >
          {row.original.description}
        </p>
      ),
    },
    {
      accessorKey: "type",
      header: () => <span>Type</span>,
      cell: ({ row }) => <span>{typeName(row.original.type)}</span>,
    },
    {
      accessorKey: "price",
      header: () => <span>Price</span>,
    },
    {
      accessorKey: "rating",
      header: () => <span>Rating</span>,
    },
    {
      accessorKey: "badge",
      header: () => <span>Badge</span>,
    },
    {
      accessorKey: "edit",
      header: () => null,
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <Can permission={usepermissions.updateProducts}>
            <IconButton
              variant="default"
              label="Edit"
              onClick={() =>
                navigate({
                  to: "/products/edit/$id",
                  params: {
                    id,
                  },
                })
              }
            >
              <Pencil />
            </IconButton>
          </Can>
        );
      },
    },
    {
      accessorKey: "delete",
      header: () => null,
      cell: ({ row }) => {
        const id = row.original.id;
        const name = row.original.name;

        return (
          <Can permission={usepermissions.deleteProducts}>
            <IconButton
              variant="destructive"
              label="Delete"
              onClick={() => {
                setShowDel(true);
                setProductId(id);
                setProductName(name);
              }}
            >
              <Trash2 />
            </IconButton>
          </Can>
        );
      },
    },
  ];

  return (
    <Padding>
      {pagination && (
        <Table
          columns={columns}
          data={products}
          pagination={pagination}
          page={page}
          setPage={setPage}
          title="Products"
          onClick={goToAdd}
          textButton="Add Product"
          setSearch={setSearch}
          isSearching={isFetching}
          permissionAdd={usepermissions.createProducts}
          getRowId={(row) => String(row.id)}
          onBulkDelete={bulkDelete}
        />
      )}
      {showDel && productId && (
        <DeleteProduct
          productId={productId}
          productName={productName}
          setShowDel={setShowDel}
        />
      )}
    </Padding>
  );
};

export default ShowProduct;
