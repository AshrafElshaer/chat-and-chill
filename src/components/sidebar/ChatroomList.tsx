import Link from 'next/link'
import ChatroomPreview from '../ChatroomPreview'

// type Props = {}

const ChatroomList = () => {
  return (
    <ul className="scrollbar-hide   h-[70vh] overflow-y-scroll font-medium md:h-[80vh]">
            <li>
              <Link href="/chatroom">
                <ChatroomPreview />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview />
              </Link>
            </li>
          </ul>
  )
}

export default ChatroomList