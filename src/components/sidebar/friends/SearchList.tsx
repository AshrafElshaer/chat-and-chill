import { useCallback, useEffect, useState } from "react";

import { api } from "@/utils/api";
import { useDebounce } from "@/hooks";

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
    <div className="h-1/2">
      <h4 className="my-2 w-full text-center text-sm">Add New Friend</h4>

      <SearchBar
        placeholder="Search by username or email"
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <ul className="scrollbar-hide flex flex-col gap-3 overflow-y-scroll">
        {searchError && (
          <li className="py-2 text-center text-red-500">
            Ops! {searchError.message}
          </li>
        )}
        {debouncedSearchTerm.length < 3 && (
          <li className="py-2 text-center">
            <p className="text-xs font-semibold text-lightGray">
              Username must be at least 3 characters
            </p>
          </li>
        )}

        {foundUsers.length === 0 && debouncedSearchTerm.length >= 3 && (
          <li className="py-2 text-center">
            <p className="text-sm font-semibold text-lightGray">
              No users found with that username or email
            </p>
          </li>
        )}

        {foundUsers.length !== 0 &&
          foundUsers.map((user) => <UserPreview key={user.id} user={user} />)}
      </ul>
    </div>
  );
};

export default SearchList;
