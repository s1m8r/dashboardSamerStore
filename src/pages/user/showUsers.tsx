import Table from "@/components/layout/table";

import { useDeleteUser, useGetUsers, useUpdateUser } from "@/API/user";
import { registerSchema } from "@/schemas/user";
import z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import DeleteUser from "./deleteUser";
import { ArrowDownUp, Pencil, Trash2 } from "lucide-react";
import { Can } from "@/components/functions/can";
import { usepermissions } from "@/stores/usePermissions";
import Padding from "@/components/layout/padding";
import IconButton from "@/components/layout/iconButton";
import { toast } from "sonner";

type registerFormData = z.infer<typeof registerSchema>;
const ShowUser = () => {
  const navigate = useNavigate();
  const [showDel, setShowDel] = useState(false);
  const [userId, setUserId] = useState<number>();
  const [userName, setUserName] = useState("");
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
  const [search, setSearch] = useState("");
  const { data, isFetching } = useGetUsers(sortBy, sortOrder, page, search);
  const users = data?.data ?? [];
  const pagination = data?.pagination;
  const goToAdd = () => {
    navigate({
      to: "/users/adduser",
      search: {
        from: "/users",
      },
    });
  };

  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  const bulkDelete = async (ids: string[]) => {
    const results = await Promise.allSettled(
      ids.map((id) => deleteUser({ id: Number(id) })),
    );
    const failed = results.filter((res) => res.status === "rejected").length;
    if (failed) {
      toast.error(`Failed to delete ${failed} of ${ids.length} users`);
    } else {
      toast.success(`Deleted ${ids.length} users successfully`);
    }
  };

  const bulkActivate = async (ids: string[], active: boolean) => {
    const selected = users.filter((item) => ids.includes(String(item.id)));
    const results = await Promise.allSettled(
      selected.map((item) =>
        updateUser({ id: item.id!, data: { ...item, isActive: active } }),
      ),
    );
    const failed = results.filter((res) => res.status === "rejected").length;
    const label = active ? "Activated" : "Deactivated";
    if (failed) {
      toast.error(`Failed to update ${failed} of ${selected.length} users`);
    } else {
      toast.success(`${label} ${selected.length} users successfully`);
    }
  };
  const columns: ColumnDef<registerFormData>[] = [
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
      accessorKey: "firstName",
      size: 20,
      header: () => <span>First Name</span>,
    },
    {
      accessorKey: "lastName",
      size: 20,
      header: () => <span>Last Name</span>,
    },
    {
      accessorKey: "phone",
      size: 10,
      header: () => <span>Phone</span>,
    },
    {
      accessorKey: "age",
      size: 5,
      header: () => <span>Age</span>,
    },
    {
      accessorKey: "email",
      size: 25,
      header: () => <span>Email</span>,
    },
    {
      accessorKey: "address",
      size: 25,
      header: () => <span>Address</span>,
      cell: ({ row }) => {
        const country = row.original.address?.country;
        const city = row.original.address?.city;
        const street = row.original.address?.street;
        return (
          <div>
            {" "}
            {country},{city},{street}{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      size: 5,
      header: () => <span>Role</span>,
    },
    {
      accessorKey: "isActive",
      size: 5,
      header: () => <span>Active</span>,
    },
    {
      accessorKey: "x",
      size: 5,
      header: () => null,
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Can permission={usepermissions.updateUser}>
            <IconButton
              onClick={() =>
                navigate({
                  to: "/users/edit/$id",
                  params: {
                    id: id,
                  },
                  search: {
                    from: "/users",
                  },
                })
              }
              variant="default"
              label="Edit"
            >
              <Pencil />
            </IconButton>
          </Can>
        );
      },
    },
    {
      accessorKey: "y",
      size: 5,
      header: () => null,
      cell: ({ row }) => {
        const id = row.original.id;
        const name = row.original.firstName;
        return (
          <Can permission={usepermissions.deleteUser}>
            <IconButton
              onClick={() => {
                setShowDel(true);
                setUserId(id);
                setUserName(name);
              }}
              variant="destructive"
              label="Delete"
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
          data={users ?? []}
          pagination={pagination}
          page={page}
          setPage={setPage}
          title="users"
          textButton="Add User"
          onClick={goToAdd}
          setSearch={setSearch}
          permissionAdd={usepermissions.createUser}
          isSearching={isFetching}
          getRowId={(row) => String(row.id)}
          onBulkDelete={bulkDelete}
          onBulkActivate={bulkActivate}
        />
      )}

      {showDel && userId && (
        <DeleteUser
          userId={userId}
          userName={userName}
          setShowDel={setShowDel}
        />
      )}
    </Padding>
  );
};
export default ShowUser;
