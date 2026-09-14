import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "./axios";
import { storeSchema } from "@/schemas/store";
import z from "zod";

const queryKey = ["stores"];
type storeFormData = z.infer<typeof storeSchema>;
type storeResponseType = {
  data: storeFormData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const useGetStores = (
  sortBy = "id",
  sortOrder = "asc",
  page = 1,
  search = "",
) => {
  return useQuery<storeResponseType>({
    queryKey: [...queryKey, sortBy, sortOrder, page, search],

    queryFn: async () => {
      const res = await api.get(
        `api/stores?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&search=${search}`,
      );

      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};
export const useAddStores = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: storeFormData) => {
      const res = await api.post("api/stores", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export const useGetStore = (id?: number) => {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: async () => {
      const res = await api.get<storeFormData>(`api/stores/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: storeFormData }) => {
      return api.put(`api/stores/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return api.delete(`api/stores/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
