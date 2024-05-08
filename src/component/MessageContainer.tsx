import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  seletedConversationAtom,
} from "../atoms/messagesAtom";
import { IMessage } from "../types/types";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const MessageContainer = () => {
  const toast = useShowToast();
  const selectedConversation = useRecoilValue(seletedConversationAtom);
  const [loadingMessage, setLoadingMessages] = useState<boolean>(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        // console.log(message);
        if (selectedConversation._id === message.conversationId) {
          setMessages((prev) => [...prev, message]);
        }

        // console.log(messages, "s");

        setConversations((prev) => {
          const updatedConversations = prev.map((conversation) => {
            if (conversation._id === message.conversationId) {
              return {
                ...conversation,
                lastMessage: {
                  text: message.text,
                  sender: message.sender,
                  seen: false,
                },
              };
            }
            return conversation;
          });
          return updatedConversations;
        });
      });
      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      if (socket) {
        socket.emit("markMessageAsSeen", {
          conversationId: selectedConversation._id,
          userId: selectedConversation.userId,
        });
      }
    }
    socket?.on("messageSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return { ...message, seen: true };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      // setMessages([]);
      try {
        const res = await fetch(
          `/api/v1/messages/${selectedConversation.userId}`
        );
        const data = await res.json();
        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }

        // console.log(data, "message");
        setMessages(data);
        // console.log(setMessages)
      } catch (error) {
        toast("Error", "Something went wrong will fetching messages", "error");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
    // console.log(setMessages);
  }, [toast, selectedConversation.userId]);
  return (
    <Flex
      flex="70"
      bg={useColorModeValue("gray.200", "grey.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      <Flex w={"full"} h={12} alignItems={"center"} gap={"2"}>
        <Avatar src={selectedConversation.userProfilepic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}{" "}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />

      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        height={"400px"}
        overflowY={"auto"}
        px={2}
      >
        {loadingMessage &&
          [0, 1, 2, 3, 4].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={"1"}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={"7"} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={"7"} />}
            </Flex>
          ))}

        {!loadingMessage &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={currentUser._id === message.sender}
              />
            </Flex>
          ))}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;