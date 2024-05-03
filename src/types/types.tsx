export interface IUser {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
  bio: string;
  createdAt: string;
  followers: [string];
  following: [string];
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
