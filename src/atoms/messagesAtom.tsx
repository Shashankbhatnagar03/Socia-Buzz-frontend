import { atom } from "recoil";
import { IConversation } from "../types/types";

export const conversationsAtom = atom({
  key: "conversationsAtom",
  default: [] as IConversation[],
});

export const seletedConversationAtom = atom({
  key: "selectedConversationAtom",
  default: {
    mock: false,
    _id: "",
    userId: "",
    username: "",
    userProfilepic: "",
  },
});

export const unreadMessagesAtom = atom({
  key: "unreadMessagesAtom",
  default: 0,
});
