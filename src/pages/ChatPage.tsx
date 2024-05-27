import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SkeletonCircle,
  Spinner,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Conversation from "../component/Conversation";
import MessageContainer from "../component/MessageContainer";
import { EventHandler, useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  seletedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { IConversation } from "../types/types";
import { useSocket } from "../context/SocketContext";
import NewMessage from "../component/NewMessage";
import messageNotificationSound from "../assets//sounds/messageNotification.mp3";

const ChatPage = () => {
  const { colorMode } = useColorMode();
  const toast = useShowToast();
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [searchingUser, setSearchingUser] = useState<boolean>(false);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [conversationsTemp, setConversationsTemp] =
    useState<IConversation[]>(conversations);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    seletedConversationAtom
  );
  const [loadingConversationsTemp, setLoadingConversationsTemp] =
    useState<boolean>(true);

  const currentUser = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    setSelectedConversation({
      mock: false,
      _id: "",
      userId: "",
      username: "",
      userProfilepic: "",
    });
  }, []);
  useEffect(() => {
    socket?.on("newMessage", (message) => {
      // console.log("sdf");

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
      socket?.off("newMessage");
    };
  }, [socket, setConversations]);
  useEffect(() => {
    socket?.on("messageSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
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
    });
  }, [socket, setConversations, conversations]);
  useEffect(() => {
    const getConversation = async () => {
      setLoadingConversations(true);
      try {
        const res = await fetch("/api/v1/messages/conversations");
        const data = await res.json();
        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }

        setConversations(data);
      } catch (error) {
        toast(
          "Error",
          "Something went wrong will fetching conversations",
          "error"
        );
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversation();
  }, [toast, setConversations]);

  useEffect(() => {
    const filteredConversation = async () => {
      setLoadingConversationsTemp(true);
      try {
        // console.log(conversations);
        const filteredConversations = conversations.filter((conversation) => {
          const conversationUser = conversation.participants[0].username;
          return conversationUser.startsWith(filter);
        });
        setConversationsTemp(filteredConversations);
      } catch (error) {
        toast("Error", "Something went wrong ", "error");
      } finally {
        setLoadingConversationsTemp(false);
      }
    };
    const timeOutId = setTimeout(filteredConversation, 500);

    return () => clearTimeout(timeOutId);
  }, [toast, filter, conversations, setConversations]);

  const handleConversationSearch: EventHandler<React.SyntheticEvent> = async (
    e
  ) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/v1/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        toast("Error", searchedUser.error, "error");
        return;
      }

      //if user is trying to message themselves
      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        toast("Error", "You cannot message yourself", "error");
        return;
      }
      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (conversationAlreadyExists) {
        setSelectedConversation({
          mock: false,
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilepic: searchedUser.profilePic,
        });
        return;
      }
    } catch (error) {
      toast("Error", "Something went wrong ", "error");
    } finally {
      setSearchingUser(false);
    }
  };
  if (!conversations) return;
  return (
    <Box
      position={"absolute"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      transform={"translateX(-50%)"}
      left={"50%"}
      mt={10}
      p={4}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={35}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={"bold"}
            fontSize={"lg"}
            color={colorMode === "light" ? "grey.dark" : "grey.200"}
          >
            Your conversation
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <InputGroup>
                <InputLeftElement
                  cursor={"pointer"}
                  onClick={handleConversationSearch}
                  children={
                    searchingUser ? (
                      <Spinner size={"sm"} />
                    ) : (
                      <SearchIcon color="gray.300" />
                    )
                  }
                />
                <Input
                  borderRadius={"full"}
                  type="text"
                  placeholder="Search for a user"
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setFilter(e.target.value);
                  }}
                  focusBorderColor="teal.400"
                  borderColor="gray.300"
                  size="md"
                />
              </InputGroup>
            </Flex>
          </form>

          {!loadingConversations &&
            !loadingConversationsTemp &&
            conversationsTemp.length > 0 &&
            conversationsTemp.map((conversation) => {
              return (
                <Conversation
                  key={conversation._id}
                  conversation={conversation}
                  isOnline={onlineUsers.includes(
                    conversation.participants[0]._id
                  )}
                />
              );
            })}
          {!loadingConversations &&
            !loadingConversationsTemp &&
            conversationsTemp.length === 0 && (
              <Flex direction="column" align="center">
                <Text mb={4} mt={4}>
                  No Conversation Found
                </Text>
                <NewMessage />
              </Flex>
            )}
          {(loadingConversations || loadingConversationsTemp) &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={65}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            ml={"20"}
            mt={"10"}
            height={"400px"}
            gap={2}
          >
            <Text fontSize={"32"} fontWeight={"bold"}>
              Select a conversation{" "}
            </Text>
            <Text color={"grey.light"}>
              Choose from your existing conversations, start a new one, or just
              keep swimming.
            </Text>
            <Box mt={5}>
              <NewMessage />
            </Box>
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
