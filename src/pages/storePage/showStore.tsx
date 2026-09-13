import Table from "@/components/layout/table";
import z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { storeScema } from "@/schemas/store";
import { useDeleteStore, useGetStores } from "@/API/store";
import DeleteStore from "./deleteStore";
import { ArrowDownUp, Pencil, Trash2 } from "lucide-react";
import { usepermissions } from "@/stores/usePermissions";
import { Can } from "@/components/functions/can";
import Padding from "@/components/layout/padding";
import IconButton from "@/components/layout/iconButton";
import { toast } from "sonner";

type storeFormData = z.infer<typeof storeScema>;

const ShowStore = () => {
  const navigate = useNavigate();

  const [showDel, setShowDel] = useState(false);
  const [storeId, setStoreId] = useState<number>();
  const [storeName, setStoreName] = useState("");

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
      to: "/stores/addstore",
      search: {
        from: "/stores",
      },
    });
  };
  const [search, setSearch] = useState("");

  const { data, isFetching } = useGetStores(sortBy, sortOrder, page, search);

  const stores = data?.data ?? [];
  const pagination = data?.pagination;

  const { mutateAsync: deleteStore } = useDeleteStore();

  const bulkDelete = async (ids: string[]) => {
    const results = await Promise.allSettled(
      ids.map((id) => deleteStore({ id: Number(id) })),
    );
    const failed = results.filter((res) => res.status === "rejected").length;
    if (failed) {
      toast.error(`Failed to delete ${failed} of ${ids.length} stores`);
    } else {
      toast.success(`Deleted ${ids.length} stores successfully`);
    }
  };

  const columns: ColumnDef<storeFormData>[] = [
    {
      accessorKey: "id",
      size: 5,
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
      size: 20,
      header: () => <span>Name</span>,
      cell: ({ row }) => {
        const id = row.original.id;
        const name = row.original.name;
        return (
          <span
            className="cursor-pointer font-semibold text-primary hover:underline"
            onClick={() =>
              navigate({
                to: "/stores/store/$id",
                params: {
                  id,
                },
                search: {
                  from: "/stores",
                },
              })
            }
          >
            {name}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      size: 20,
      header: () => <span>Email</span>,
    },
    {
      accessorKey: "phone",
      size: 20,
      header: () => <span>Phone</span>,
    },
    {
      accessorKey: "owner",
      size: 5,
      header: () => <span>Owner</span>,
    },
    {
      accessorKey: "rating",
      size: 5,
      header: () => <span>Rating</span>,
    },
    {
      accessorKey: "isActive",
      size: 5,
      header: () => <span>Active</span>,
    },
    {
      accessorKey: "edit",
      size: 5,
      header: () => null,
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Can permission={usepermissions.updateStores}>
            <IconButton
              variant="default"
              label="Edit"
              onClick={() =>
                navigate({
                  to: "/stores/edit/$id",
                  params: {
                    id,
                  },
                  search: {
                    from: "/stores",
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
      size: 5,
      header: () => null,
      cell: ({ row }) => {
        const id = row.original.id;
        const name = row.original.name;

        return (
          <Can permission={usepermissions.deleteStores}>
            <IconButton
              variant="destructive"
              label="Delete"
              onClick={() => {
                setShowDel(true);
                setStoreId(id);
                setStoreName(name);
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
          data={stores}
          pagination={pagination}
          page={page}
          setPage={setPage}
          title="stores"
          textButton="Add Store"
          onClick={goToAdd}
          setSearch={setSearch}
          permissionAdd={usepermissions.createStores}
          isSearching={isFetching}
          getRowId={(row) => String(row.id)}
          onBulkDelete={bulkDelete}
        />
      )}

      {showDel && storeId && (
        <DeleteStore
          storeId={storeId}
          storeName={storeName}
          setShowDel={setShowDel}
        />
      )}
    </Padding>
  );
};

export default ShowStore;
