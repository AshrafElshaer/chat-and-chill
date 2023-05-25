import { useCallback, useEffect, useState } from "react";

import { api } from "@/utils/api";
import useDebounce from "@/hooks/useDebounce";

import type { User } from "@prisma/client";

import SearchBar from "../SearchBar";
import UserPreview from "./UserPreview";

const SearchList = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState<User[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { error: searchError, mutate: searchUser } =
    api.user.searchUser.useMutation({
      onSuccess(data) {
        setFoundUsers(data);
      },
    });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  const startSearch = useCallback(() => {
    searchUser({ searchTerm: debouncedSearchTerm });
  }, [debouncedSearchTerm, searchUser]);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      startSearch();
    }

    if (debouncedSearchTerm.length <= 2) {
      setFoundUsers([]);
    }
  }, [debouncedSearchTerm, startSearch]);

  return (
    <>
      <SearchBar
        placeholder="Search by username or email"
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <ul className="max-h-1/2 scrollbar-hide flex flex-col gap-3 overflow-y-scroll">
        {searchError && <li>{searchError.message}</li>}
        {debouncedSearchTerm.length < 3 && (
          <li className="flex items-center justify-center px-4 py-2">
            <p className="text-xs font-semibold">
              Username must be at least 3 characters
            </p>
          </li>
        )}

        {foundUsers.length === 0 && debouncedSearchTerm.length >= 3 && (
          <li className="flex items-center justify-center px-4 py-2">
            <p className="text-sm font-semibold">
              No users found with that username or email
            </p>
          </li>
        )}

        {foundUsers.length !== 0 &&
          foundUsers.map((user) => <UserPreview key={user.id} user={user} />)}
      </ul>
    </>
  );
};

export default SearchList;
