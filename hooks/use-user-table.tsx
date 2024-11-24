import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TableData } from "@/types/user-types";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface APIResponse {
  users: TableData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useUserTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [committeeFilter, setCommitteeFilter] = useState<string[]>([]);

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch, roleFilter, committeeFilter]);

  const fetchUsers = async () => {
    const { data } = await axios.post<APIResponse>("/api/admin/table", {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: debouncedSearch,
      userRole: roleFilter,
      committeeType: committeeFilter,
    });

    return {
      ...data,
      pageCount: data.totalPages,
      pageIndex: data.page,
    };
  };

  const query = useQuery({
    queryKey: [
      "users",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedSearch,
      roleFilter,
      committeeFilter,
    ],
    queryFn: fetchUsers,
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    pagination,
    setPagination,
    search: searchInput,
    setSearch: setSearchInput,
    roleFilter,
    setRoleFilter,
    committeeFilter,
    setCommitteeFilter,
  };
}
