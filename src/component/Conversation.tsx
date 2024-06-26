import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { IConversationProps } from "../types/types";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsCircleFill, BsFillImageFill } from "react-icons/bs";
import { seletedConversationAtom } from "../atoms/messagesAtom";
const Conversation = ({ conversation, isOnline }: IConversationProps) => {
  const user = conversation.participants[0];
  const currentUser = useRecoilValue(userAtom);
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    seletedConversationAtom
  );
  const { colorMode } = useColorMode();
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.500", "grey.dark"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={() => {
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilepic: user.profilePic,
          username: user.username,
          mock: conversation.mock,
        });
      }}
      bg={
        selectedConversation?._id === conversation._id
          ? colorMode === "light"
            ? "gray.300"
            : "grey.dark"
          : ""
      }
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user.profilePic}
        >
          {isOnline ? <AvatarBadge boxSize={"1em"} bg={"green.500"} /> : ""}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>
          {user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser?._id === lastMessage.sender ? (
            <Box color={lastMessage.seen ? "blue.400" : ""}>
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ""
          )}
          {lastMessage.text.length > 15
            ? lastMessage.text.substring(0, 15) + "..."
            : lastMessage.text ||
              (!conversation.mock && <BsFillImageFill size={16} />)}
        </Text>
      </Stack>
      {currentUser?._id !== lastMessage.sender &&
        !lastMessage.seen &&
        !conversation.mock && (
          <Box ml="auto" color="red.500" mr={3}>
            <BsCircleFill size={8} />
          </Box>
        )}
    </Flex>
  );
};

export default Conversation;
