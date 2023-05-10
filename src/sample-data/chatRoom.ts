export const chatroom = {
  id: 1234,
  users: [
    {
      id: 1,
      name: "User 1",
      image:
        "https://nrsstdptogyfvsluloir.supabase.co/storage/v1/object/public/images/images/user-icon.png",
    },
    {
      id: 2,
      name: "User 2",
      image:
        "https://nrsstdptogyfvsluloir.supabase.co/storage/v1/object/public/images/images/user-icon.png",
    },
  ],

  messages: [
    {
      id: 1,
      text: "Hi there! Is anyone here?",
      // user: {
      //   id: 1,
      //   name: "User 1",
      // },
      userId: 1,
      chatroomId: 1234,
      createdAt: "2023-05-09T10:00:00.000Z",
    },
    {
      id: 2,
      text: "Hey! I'm here. What's up?",
      // user: {
      //   id: 2,
      //   name: "User 2",
      // },
      userId: 2,
      chatroomId: 1234,
      createdAt: "2023-05-09T10:01:00.000Z",
    },
    {
      id: 3,
      text: "Not much, just wanted to chat. How about you?",
      // user: {
      //   id: 1,
      //   name: "User 1",
      // },
      userId: 1,
      chatroomId: 1234,
      createdAt: "2023-05-09T10:02:00.000Z",
    },
    {
      id: 4,
      text: "Same here. What do you want to talk about?",
      // user: {
      //   id: 2,
      //   name: "User 2",
      // },
      userId: 2,
      chatroomId: 1234,
      createdAt: "2023-05-09T10:03:00.000Z",
    },
    {
      id: 5,
      text: "I don't know, anything really. What's new in your life?",
      // user: {
      //   id: 1,
      //   name: "User 1",
      // },
      userId: 1,
      chatroomId: 1234,
      createdAt: "2023-05-09T10:04:00.000Z",
    },
    {
      id: 6,
      text: "Well, I just got a new job! I'm really excited about it.",
      // user: {
      //   id: 2,
      //   name: "User 2",
      // },
      userId: 2,
      chatroomId: 1234,
      createdAt: "2023-05-09T10:05:00.000Z",
    },
    {
      id: 7,
      text: "That's awesome! Congratulations. What kind of job is it?",
      // user: {
      //   id: 1,
      //   name: "User 1",
      // },
      userId: 1,
      chatroomId: 1234,
      createdAt: "2023-05-09T10:06:00.000Z",
    },
    {
      id: 8,
      text: "It's a software engineering job at a tech startup. I'm really looking forward to working there.",
      // user: {
      //   id: 2,
      //   name: "User 2",
      // },
      userId: 2,
      chatroomId: 1234,
      createdAt: "2023-05-09T10:07:00.000Z",
    },
  ],
};
