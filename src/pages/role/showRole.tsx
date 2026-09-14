import Table from "@/components/layout/table";
import z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { roleSchema } from "@/schemas/role";
import { useDeleteRole, useGetRoles, useUpdateRole } from "@/API/role";
import DeleteRole from "./DeleteRole";
import { ArrowDownUp, Pencil, Trash2 } from "lucide-react";
import { usepermissions } from "@/stores/usePermissions";
import { Can } from "@/components/functions/can";
import Padding from "@/components/layout/padding";
import IconButton from "@/components/layout/iconButton";
import { toast } from "sonner";

type roleFormData = z.infer<typeof roleSchema>;

const ShowRole = () => {
  const navigate = useNavigate();

  const [showDel, setShowDel] = useState(false);
  const [roleId, setRoleId] = useState<number>();
  const [roleName, setRoleName] = useState("");

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
      to: "/roles/addrole",
      search: {
        from: "/roles",
      },
    });
  };
  const [search, setSearch] = useState("");

  const { data, isFetching } = useGetRoles(sortBy, sortOrder, page, search);

  const roles = data?.data ?? [];
  const pagination = data?.pagination;

  const { mutateAsync: deleteRole } = useDeleteRole();
  const { mutateAsync: updateRole } = useUpdateRole();

  const bulkDelete = async (ids: string[]) => {
    const results = await Promise.allSettled(
      ids.map((id) => deleteRole({ id: Number(id) })),
    );
    const failed = results.filter((res) => res.status === "rejected").length;
    if (failed) {
      toast.error(`Failed to delete ${failed} of ${ids.length} roles`);
    } else {
      toast.success(`Deleted ${ids.length} roles successfully`);
    }
  };

  const bulkActivate = async (ids: string[], active: boolean) => {
    const selected = roles.filter((item) => ids.includes(String(item.id)));
    const results = await Promise.allSettled(
      selected.map((item) =>
        updateRole({ id: item.id!, data: { ...item, isActive: active } }),
      ),
    );
    const failed = results.filter((res) => res.status === "rejected").length;
    const label = active ? "Activated" : "Deactivated";
    if (failed) {
      toast.error(`Failed to update ${failed} of ${selected.length} roles`);
    } else {
      toast.success(`${label} ${selected.length} roles successfully`);
    }
  };

  const columns: ColumnDef<roleFormData>[] = [
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
      size: 10,
      header: () => <span>Name</span>,
    },
    {
      accessorKey: "description",
      size: 10,
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
      accessorKey: "isActive",
      minSize: 2,
      header: () => <span>Active</span>,
    },
    {
      accessorKey: "edit",
      size: 2,
      header: () => null,
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <Can permission={usepermissions.updateRoles}>
            <IconButton
              variant="default"
              label="Edit"
              onClick={() =>
                navigate({
                  to: "/roles/edit/$id",
                  params: {
                    id,
                  },
                  search: {
                    from: "/roles",
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
          <Can permission={usepermissions.deleteRoles}>
            <IconButton
              variant="destructive"
              label="Delete"
              onClick={() => {
                setShowDel(true);
                setRoleId(id);
                setRoleName(name);
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
          data={roles}
          pagination={pagination}
          page={page}
          setPage={setPage}
          title="roles"
          textButton="Add Role"
          onClick={goToAdd}
          setSearch={setSearch}
          permissionAdd={usepermissions.createRoles}
          isSearching={isFetching}
          getRowId={(row) => String(row.id)}
          onBulkDelete={bulkDelete}
          onBulkActivate={bulkActivate}
        />
      )}

      {showDel && roleId && (
        <DeleteRole
          roleId={roleId}
          roleName={roleName}
          setShowDel={setShowDel}
        />
      )}
    </Padding>
  );
};

export default ShowRole;
