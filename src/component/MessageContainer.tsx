import {
  Avatar,
  AvatarBadge,
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
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  seletedConversationAtom,
} from "../atoms/messagesAtom";
import { IMessage } from "../types/types";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageNotificationSound from "../assets//sounds/messageNotification.mp3";
import { Link } from "react-router-dom";

const MessageContainer = () => {
  const toast = useShowToast();
  const selectedConversation = useRecoilValue(seletedConversationAtom);
  const [loadingMessage, setLoadingMessages] = useState<boolean>(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        if (selectedConversation._id === message.conversationId) {
          setMessages((prev) => [...prev, message]);
        }

        if (!document.hasFocus()) {
          const sound = new Audio(messageNotificationSound);
          sound.play();
        }

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
        setConversations((prev) => {
          const updatedConversations = prev.map((conversation) => {
            if (conversation._id === selectedConversation._id) {
              return {
                ...conversation,
                lastMessage: {
                  ...conversation.lastMessage,
                  seen: true,
                },
              };
            }
            return conversation;
          });
          return updatedConversations;
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
  }, [
    socket,
    currentUser._id,
    messages,
    selectedConversation,
    setConversations,
  ]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (
          conversations.find(
            (conversation) =>
              conversation._id === selectedConversation._id &&
              conversation.mock === true
          )
        ) {
          return;
        }

        const res = await fetch(
          `/api/v1/messages/${selectedConversation.userId}`
        );
        const data = await res.json();
        if (data.error && !selectedConversation.mock) {
          toast("Error", data.error, "error");
          return;
        }

        setMessages(data);
      } catch (error) {
        toast("Error", "Something went wrong will fetching messages", "error");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [toast, selectedConversation]);
  return (
    <Flex
      flex="70"
      bg={useColorModeValue("gray.200", "grey.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      <Flex w={"full"} h={12} alignItems={"center"} gap={"2"}>
        <Link to={`/${selectedConversation.username}`}>
          <Avatar src={selectedConversation.userProfilepic} size={"sm"}>
            {onlineUsers.includes(selectedConversation.userId) ? (
              <AvatarBadge boxSize={"1em"} bg={"green.500"} />
            ) : (
              ""
            )}
          </Avatar>
        </Link>

        <Link to={`/${selectedConversation.username}`}>
          <Text display={"flex"} alignItems={"center"} cursor={"pointer"}>
            {selectedConversation.username}{" "}
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
        </Link>
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
