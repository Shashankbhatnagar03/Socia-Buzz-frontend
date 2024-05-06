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
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { seletedConversationAtom } from "../atoms/messagesAtom";
import { IMessage } from "../types/types";
import userAtom from "../atoms/userAtom";

const MessageContainer = () => {
  const toast = useShowToast();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    seletedConversationAtom
  );
  const [loadingMessage, setLoadingMessages] = useState<boolean>(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const currentUser = useRecoilValue(userAtom);
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
            <Message
              key={message._id}
              message={message}
              ownMessage={currentUser._id === message.sender}
            />
          ))}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
