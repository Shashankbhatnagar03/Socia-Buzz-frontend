import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  useColorMode,
  useMediaQuery,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome, AiOutlineMenu } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut, FiSearch, FiSettings } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { LuMessagesSquare } from "react-icons/lu";
import { useEffect, useState } from "react";
import { conversationsAtom } from "../atoms/messagesAtom";
import { useSocket } from "../context/SocketContext";
import messageNotificationSound from "../assets//sounds/messageNotification.mp3";
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const { socket } = useSocket();
  useEffect(() => {
    if (user) {
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
    }
  }, [socket, setConversations, conversations, user]);
  useEffect(() => {
    if (user) {
      const getConversation = async () => {
        // setLoadingConversations(true);
        try {
          const res = await fetch("/api/v1/messages/conversations");
          const data = await res.json();
          if (data.error) {
            return;
          }

          setConversations(data);
        } catch (error) {
          console.log(error as string);
          return;
        }
      };

      getConversation();
      console.log(1);
    }
  }, [setConversations, user]);
  useEffect(() => {
    if (user) {
      const unreadConversationsCount = conversations.filter(
        (conversation) =>
          !conversation.lastMessage.seen &&
          conversation.lastMessage.sender !== user?._id &&
          !conversation.mock
      ).length;
      // console.log(unreadConversationsCount);
      setUnreadMessages(unreadConversationsCount);
    }
  }, [conversations, user]);

  return (
    <>
      <Box
        top={0}
        zIndex="1000"
        bg={
          colorMode === "dark"
            ? "rgba(16, 16, 16, 0.6)"
            : "rgba(237, 242, 247, 0.6)"
        }
        backdropFilter="blur(13px)"
        position={"sticky"}
      >
        {user && (
          <Flex justifyContent={"space-between"} mt={6} mb={3}>
            <Link as={RouterLink} to="/" mt={4}>
              <Button
                size={"xs"}
                h={"2.5rem"}
                cursor={"pointer"}
                background={"transparent"}
                borderRadius={"full"}
              >
                <AiFillHome size={24} cursor={"pointer"} />
              </Button>
            </Link>

            <Image
              cursor={"pointer"}
              alt="logo"
              w={"60px"}
              h={"60px"}
              mt={2}
              ml={isLargerThan768 ? 20 : 0}
              src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
              onClick={toggleColorMode}
            />

            {isLargerThan768 ? (
              <Flex alignItems={"center"} gap={1}>
                <Link as={RouterLink} to={"/search"}>
                  <Button
                    size={"xs"}
                    h={"2.3rem"}
                    cursor={"pointer"}
                    background={"transparent"}
                    borderRadius={"full"}
                  >
                    <FiSearch size={23} cursor={"pointer"} />
                  </Button>
                </Link>
                <Link as={RouterLink} to={`/${user.username}`}>
                  <Button
                    size={"xs"}
                    h={"2.3rem"}
                    cursor={"pointer"}
                    background={"transparent"}
                    borderRadius={"full"}
                  >
                    <RxAvatar size={24} cursor={"pointer"} />
                  </Button>
                </Link>
                <Link as={RouterLink} to={`/chat`}>
                  <Button
                    size={"xs"}
                    h={"2.3rem"}
                    cursor={"pointer"}
                    background={"transparent"}
                    borderRadius={"full"}
                  >
                    <LuMessagesSquare size={24} cursor={"pointer"} />
                    {unreadMessages > 0 ? (
                      <Badge
                        position={"absolute"}
                        top={-1}
                        right={-1}
                        borderRadius={"full"}
                        colorScheme="red"
                      >
                        {unreadMessages}{" "}
                      </Badge>
                    ) : (
                      ""
                    )}
                  </Button>
                </Link>
                <Link as={RouterLink} to={`/settings`}>
                  <Button
                    size={"xs"}
                    h={"2.3rem"}
                    onClick={handleClick}
                    cursor={"pointer"}
                    background={"transparent"}
                    borderRadius={"full"}
                  >
                    <FiSettings
                      size={20}
                      style={{
                        transform: isClicked ? "rotate(75deg)" : "",
                        transition: "transform 0.5s ease-in-out",
                      }}
                    />
                  </Button>
                </Link>

                <Button
                  size={"xs"}
                  onClick={logout}
                  background={"transparent"}
                  borderRadius={"full"}
                  h={"2.3rem"}
                  cursor={"pointer"}
                >
                  <FiLogOut size={20} />
                </Button>
              </Flex>
            ) : (
              <>
                <IconButton
                  aria-label="Menu"
                  icon={<AiOutlineMenu />}
                  onClick={onOpen}
                  variant="outline"
                  mt={3}
                />
                <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                  <DrawerOverlay>
                    <DrawerContent
                      bg={
                        colorMode === "dark"
                          ? "rgba(16, 16, 16, 0.6)"
                          : "rgba(237, 242, 247, 0.6)"
                      }
                      backdropFilter="blur(13px)"
                    >
                      <DrawerCloseButton />
                      <DrawerHeader>Menu</DrawerHeader>
                      <DrawerBody>
                        <Flex flexDirection={"column"} gap={3}>
                          <Flex justifyContent={"space-around"}>
                            <Link
                              as={RouterLink}
                              to={"/search"}
                              onClick={onClose}
                            >
                              <Button
                                size={"xs"}
                                h={"2.3rem"}
                                cursor={"pointer"}
                                background={"transparent"}
                                borderRadius={"full"}
                                ml={3}
                              >
                                <FiSearch size={28} cursor={"pointer"} />
                              </Button>
                            </Link>
                            <Link
                              as={RouterLink}
                              to={"/search"}
                              onClick={onClose}
                              alignContent={"center"}
                            >
                              <Text>Search User</Text>
                            </Link>
                          </Flex>
                          <Flex justifyContent={"space-around"}>
                            <Link
                              as={RouterLink}
                              to={`/${user.username}`}
                              onClick={onClose}
                            >
                              <Button
                                size={"xs"}
                                h={"2.3rem"}
                                cursor={"pointer"}
                                background={"transparent"}
                                borderRadius={"full"}
                              >
                                <RxAvatar size={30} cursor={"pointer"} />
                              </Button>
                            </Link>
                            <Link
                              as={RouterLink}
                              to={`/${user.username}`}
                              alignContent={"center"}
                              onClick={onClose}
                            >
                              <Text>Profile</Text>
                            </Link>
                          </Flex>
                          <Flex justifyContent={"space-around"}>
                            <Link
                              as={RouterLink}
                              to={`/chat`}
                              onClick={onClose}
                            >
                              <Button
                                size={"xs"}
                                h={"2.3rem"}
                                cursor={"pointer"}
                                background={"transparent"}
                                borderRadius={"full"}
                              >
                                <LuMessagesSquare
                                  size={28}
                                  cursor={"pointer"}
                                />
                                {unreadMessages > 0 ? (
                                  <Badge
                                    position={"absolute"}
                                    top={-1}
                                    right={-1}
                                    borderRadius={"full"}
                                    colorScheme="red"
                                  >
                                    {unreadMessages}{" "}
                                  </Badge>
                                ) : (
                                  ""
                                )}
                              </Button>
                            </Link>
                            <Link
                              as={RouterLink}
                              to={`/chat`}
                              onClick={onClose}
                            >
                              <Text>Chat</Text>
                            </Link>
                          </Flex>
                          <Flex justifyContent={"space-around"} ml={2}>
                            <Link
                              as={RouterLink}
                              to={`/settings`}
                              onClick={onClose}
                            >
                              <Button
                                size={"xs"}
                                h={"2.3rem"}
                                onClick={handleClick}
                                cursor={"pointer"}
                                background={"transparent"}
                                borderRadius={"full"}
                              >
                                <FiSettings
                                  size={26}
                                  style={{
                                    transform: isClicked ? "rotate(75deg)" : "",
                                    transition: "transform 0.5s ease-in-out",
                                  }}
                                />
                              </Button>
                            </Link>
                            <Link
                              as={RouterLink}
                              to={`/settings`}
                              onClick={onClose}
                            >
                              <Text>Settings</Text>
                            </Link>
                          </Flex>

                          <Box>
                            <Flex justifyContent={"space-around"}>
                              <Button
                                size={"xs"}
                                onClick={logout}
                                background={"transparent"}
                                borderRadius={"full"}
                                h={"2.3rem"}
                                cursor={"pointer"}
                                ml={2}
                              >
                                <FiLogOut size={25} />
                              </Button>
                              <Link onClick={logout}>
                                <Text>Logout</Text>
                              </Link>
                            </Flex>
                          </Box>
                        </Flex>
                      </DrawerBody>
                    </DrawerContent>
                  </DrawerOverlay>
                </Drawer>
              </>
            )}
          </Flex>
        )}

        {!user && (
          <Flex justifyContent={"center"} mt={6} mb={3}>
            <Image
              cursor={"pointer"}
              alt="logo"
              w={"60px"}
              h={"60px"}
              src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
              onClick={toggleColorMode}
            />
          </Flex>
        )}
      </Box>
    </>
  );
};

export default Header;
