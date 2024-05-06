import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import { IMessageInputProps } from "../types/types";
import { FormEventHandler, MouseEventHandler, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  seletedConversationAtom,
} from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";

const MessageInput = ({ setMessages }: IMessageInputProps) => {
  const [messageText, setMessageText] = useState<string>("");
  const selectedConversation = useRecoilValue(seletedConversationAtom);
  const toast = useShowToast();
  const setConversation = useSetRecoilState(conversationsAtom);

  const handleSendMessage: FormEventHandler<HTMLFormElement> &
    MouseEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    if (!messageText) return;

    try {
      const res = await fetch(`api/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
        }),
      });
      const data = await res.json();

      if (data.error) {
        toast("Error", data.message, "error");
        return;
      }
      setMessages((messages) => [...messages, data]);
      setConversation((prevConversations) => {
        const updatedConversation = prevConversations.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
      setMessageText("");
      console.log(messageText);
    } catch (error) {
      toast("Error", "Something went wrong", "error");
    }
  };
  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w="full"
          placeholder="Type a Message"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
