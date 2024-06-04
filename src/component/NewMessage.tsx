import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  seletedConversationAtom,
} from "../atoms/messagesAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import userAtom from "../atoms/userAtom";
import { IUser } from "../types/types";
// import { IConversation, IUser } from "../types/types";

const NewMessage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const setSelectedConversation = useSetRecoilState(seletedConversationAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUser] = useState<IUser[]>([]);
  const toast = useShowToast();
  const [filter, setFilter] = useState<string>("");
  const { colorMode } = useColorMode();

  useEffect(() => {
    const filteredConversation = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://sociabuzz-backend.onrender.com/api/v1/users/profiles/bulk/?filter=${filter}`,
          {
            credentials: "include",
          }
        );
        let data = await res.json();
        if (data.error) {
          toast("Error", "something went wrong", "error");
          return;
        }

        data = data.filter((user: IUser) => user._id !== currentUser._id);

        setUser(data);
      } catch (error) {
        toast("Error", "Something went wrong ", "error");
      } finally {
        setLoading(false);
      }
    };
    const timeOutId = setTimeout(filteredConversation, 500);

    return () => clearTimeout(timeOutId);
  }, [toast, filter, currentUser]);

  const handleUserClick = async (user: IUser) => {
    try {
      const messagingYourself = user._id === currentUser._id;
      if (messagingYourself) {
        toast("Error", "You cannot message yourself", "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === user._id
      );
      if (conversationAlreadyExists) {
        onClose();
        setSelectedConversation({
          mock: false,
          _id: conversationAlreadyExists._id,
          userId: user._id,
          username: user.username,
          userProfilepic: user.profilePic,
        });
        return;
      }
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
          seen: false,
        },
        _id: Date.now().toString(),
        participants: [
          {
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch {
      toast("Error", "Something went wrong", "error");
    }
  };
  return (
    <>
      <Button
        colorScheme="teal"
        size="md"
        borderRadius={"full"}
        onClick={onOpen}
      >
        Start New Message
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          boxSize={"xl"}
          maxW={"80%"}
          bg={
            colorMode === "dark"
              ? "rgba(16, 16, 16, 0.6)"
              : "rgba(237, 242, 247, 0.6)"
          }
          backdropFilter="blur(25px)"
        >
          <ModalHeader textAlign={"center"}>New Message</ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Box>
              <form>
                <InputGroup>
                  <InputLeftElement
                    cursor={"pointer"}
                    children={
                      loading ? (
                        <Spinner size={"sm"} />
                      ) : (
                        <SearchIcon color="gray.300" />
                      )
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Search for a user"
                    focusBorderColor="teal.400"
                    borderColor="gray.300"
                    size="md"
                    borderRadius={"full"}
                    onChange={(e) => {
                      setFilter(e.target.value);
                    }}
                  />
                </InputGroup>
              </form>
              <Divider my={4} />

              <Box maxHeight="400px" overflowY="auto">
                <VStack spacing={7} alignItems={"start"}>
                  {users &&
                    users.map((user) => {
                      return (
                        <>
                          <Fragment key={user._id}>
                            <Box
                              onClick={() => handleUserClick(user)}
                              cursor={"pointer"}
                            >
                              <Box display="flex" alignItems="center">
                                <Avatar
                                  src={user.profilePic}
                                  name={user.username}
                                  boxSize="50px"
                                />

                                <Box ml={4}>
                                  <Text fontWeight="bold">{user.username}</Text>
                                  <Text>{user.name}</Text>
                                </Box>
                                <Image src="/verified.png" w={4} h={4} mb={6} />
                              </Box>
                            </Box>
                          </Fragment>
                        </>
                      );
                    })}
                </VStack>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewMessage;
