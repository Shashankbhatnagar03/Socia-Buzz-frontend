import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Conversation from "../component/Conversation";
import { SiWechat } from "react-icons/si";
import MessageContainer from "../component/MessageContainer";
import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  seletedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { IConversation } from "../types/types";
import { useSocket } from "../context/SocketContext";

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

  const currentUser = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();
  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await fetch("/api/v1/messages/conversations");
        const data = await res.json();
        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }

        // console.log(data);
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
      setLoadingConversations(true);
      try {
        const res = await fetch(
          `/api/v1/users/profiles/bulk/?filter=${filter}`
        );
        const data = await res.json();
        if (data.error) {
          toast("Error", "No conversation found", "error");
          return;
        }

        const filteredConversations = conversations.filter((conversation) => {
          const conversationUser = conversation.participants[0].username;
          return conversationUser.startsWith(filter);
        });
        setConversationsTemp(filteredConversations);
      } catch (error) {
        toast("Error", "Something went wrong ", "error");
      } finally {
        setLoadingConversations(false);
      }
    };
    const timeOutId = setTimeout(filteredConversation, 500);

    return () => clearTimeout(timeOutId);
  }, [toast, filter, conversations, setConversations]);

  const handleConversationSearch: FormEventHandler<HTMLFormElement> &
    MouseEventHandler<HTMLButtonElement> = async (e) => {
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
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={colorMode === "light" ? "grey.dark" : "grey.200"}
          >
            Your conversation
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setFilter(e.target.value);
                }}
              />
              <Button
                size={"sm"}
                isLoading={searchingUser}
                onClick={handleConversationSearch}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loadingConversations &&
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
          {!loadingConversations &&
            conversationsTemp.map((conversation) => (
              <Conversation
                key={conversation._id}
                conversation={conversation}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
              />
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <SiWechat size={100} />
            <Text fontSize={"20"}>
              Select a conversation to start messaging{" "}
            </Text>
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
