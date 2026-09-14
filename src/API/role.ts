import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "./axios";
import { roleSchema } from "@/schemas/role";
import z from "zod";
const queryKey = ["roles"];
type roleType = z.infer<typeof roleSchema>;
type roleResponseType = {
  data: roleType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const useGetRoles = (
  sortBy = "id",
  sortOrder = "asc",
  page = 1,
  search = "",
  enabled = true,
) => {
  return useQuery<roleResponseType>({
    queryKey: [...queryKey, sortBy, sortOrder, page, search],
    queryFn: async () => {
      const res = await api.get(
        `/api/roles?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&search=${search}`,
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
};

export const useAddRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: roleType) => {
      const res = await api.post("/api/roles", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export const useGetRole = (id?: number) => {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: async () => {
      const res = await api.get<roleType>(`/api/roles/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: roleType }) => {
      return api.put(`/api/roles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return api.delete(`/api/roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
