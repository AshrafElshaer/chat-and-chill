import Image from 'next/image'
import React from 'react'

type Props = {
  src : string
  isOnline : boolean
}

const Avatar = ({isOnline,src}:Props) => {
  return (
    <div className="relative inline-block">
    <Image
      src={src}
      alt="user profile picture"
      width={40}
      height={40}
      className="inline-block rounded-full ring-2 ring-white dark:ring-gray-800"
    />
    {isOnline && (
      <span className="absolute right-0 top-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
    )}
  </div>
  )
}

export default Avatar