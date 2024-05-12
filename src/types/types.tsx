import { ReactNode } from "react";
import { Socket } from "socket.io-client";

export interface IUser {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
  bio: string;
  isFrozen: boolean;
  createdAt: string;
  followers: [string];
  following: [string];
}

export interface UserPostProps {
  likes: number;
  replies: number;
  postImg?: string;
  postTitle: string;
}
export interface PostType {
  _id: string;
  text: string;
  replies: IReply[];
  postedBy: string;
  likes: string[];
  img: string;
  createdAt: string;
}
export interface IReply {
  userId: string;
  text: string;
  userProfilePic: string;
  username: string;
  _id: string;
}

export interface ICommentProps {
  reply: {
    text: string;
    userId: string;
    userProfilePic: string;
    username: string;
    _id: string;
  };
  lastReply: boolean;
}

export interface IConversation {
  mock: boolean;
  participants: IParticipants[];
  lastMessage: {
    text: string;
    sender: string;
    seen: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
export interface IParticipants {
  profilePic: string;
  _id: string;
  username: string;
}
export interface IMessageProps {
  message: IMessage;
  ownMessage: boolean;
}

export interface IConversationProps {
  conversation: IConversation;
  isOnline: boolean;
}

export interface IMessage {
  conversationId: string;
  sender: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  seen: boolean;
  img: string;
}
export interface IMessageInputProps {
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

export interface SocketContextProps {
  socket: Socket | undefined;
  onlineUsers: string[];
}

export interface SocketContextProviderProps {
  children: ReactNode;
}

export interface IUserHeaderProps {
  user: IUser;
}

export interface SuggestedUserProps {
  user: IUser;
}
