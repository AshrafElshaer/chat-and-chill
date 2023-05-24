import React,  { type ChangeEvent } from 'react'
import { Input , Icon} from '@/components'

type Props = {
    searchTerm: string;
    handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({handleSearchChange,searchTerm}: Props) => {
  return (
    <div className="relative my-4 px-2">
    <Icon iconName="search" className="absolute left-4 top-2 z-10" />
    <Input
      placeholder="Search or start new chat"
      value={searchTerm}
      onChange={handleSearchChange}
      className="w-full rounded-full bg-darkBg pl-12 text-primary"
    />
  </div>
  )
}

export default SearchBar