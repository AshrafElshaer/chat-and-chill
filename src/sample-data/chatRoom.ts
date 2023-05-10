const ChatRoom = [
  {
    id: 1,
    messages: [
      {
        id: 1,
        content: "Hello everyone!",
        senderId: 1,
        createdAt: "2023-05-08T12:34:56Z",
        chatRoomId: 1,
      },
      {
        id: 2,
        content: "Hi there!",
        senderId: 2,
        createdAt: "2023-05-08T12:35:22Z",
        chatRoomId: 1,
      },
      {
        id: 3,
        content: "How's everyone doing?",
        senderId: 3,
        createdAt: "2023-05-08T12:36:10Z",
        chatRoomId: 1,
      },
    ],
    users: [
      {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
        image:
          "https://nrsstdptogyfvsluloir.supabase.co/storage/v1/object/public/images/images/user-icon.png",
      },
      {
        id: 2,
        name: "Bob",
        email: "bob@example.com",
        image:
          "https://nrsstdptogyfvsluloir.supabase.co/storage/v1/object/public/images/images/user-icon.png",
      },
      {
        id: 3,
        name: "Charlie",
        email: "charlie@example.com",
        image:
          "https://nrsstdptogyfvsluloir.supabase.co/storage/v1/object/public/images/images/user-icon.png",
      },
    ],
  },
];
