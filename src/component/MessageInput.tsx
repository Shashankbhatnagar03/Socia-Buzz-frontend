import {
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import { IMessageInputProps } from "../types/types";
import { EventHandler, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  seletedConversationAtom,
} from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { AiFillPicture } from "react-icons/ai";
import { IconButton } from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";

const MessageInput = ({ setMessages }: IMessageInputProps) => {
  const [messageText, setMessageText] = useState<string>("");
  const selectedConversation = useRecoilValue(seletedConversationAtom);
  const toast = useShowToast();
  const setConversation = useSetRecoilState(conversationsAtom);
  const imageRef = useRef<HTMLInputElement>(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [isSending, setIsSending] = useState<boolean>(false);
  // const colorScheme = useColorModeValue("teal", "blue");
  const handleSendMessage: EventHandler<React.SyntheticEvent> = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    if (isSending) return;
    setIsSending(true);

    try {
      const res = await fetch(`api/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          img: imgUrl,
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
              mock: false,
              lastMessage: {
                text: messageText,
                sender: data.sender,
                seen: false,
              },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
      setMessageText("");
      setImgUrl("");
      // console.log(messageText);
    } catch (error) {
      toast("Error", "Something went wrong", "error");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Box position="relative" w="full">
      <IconButton
        position="absolute"
        left="5px"
        aria-label="Upload image"
        icon={<AiFillPicture size={20} />}
        size="sm"
        top={1}
        variant="outline"
        isRound
        cursor={"pointer"}
        zIndex={1}
        borderColor={"transparent"}
        onClick={() => imageRef.current?.click()}
      ></IconButton>
      <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
      <form onSubmit={handleSendMessage}>
        <InputGroup>
          <Input
            w="full"
            pl="40px"
            placeholder="Type Message"
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
            focusBorderColor={useColorModeValue("gray.600", "gray.400")}
            _hover={"none"}
            border={"1px solid"}
            borderColor={useColorModeValue("gray.600", "gray.200")}
            borderRadius={25}
          />
          <InputRightElement onClick={handleSendMessage}>
            <IconButton
              aria-label="Send Message"
              size={"sm"}
              right={0.75}
              pl={1}
              cursor={"pointer"}
              icon={<IoSendSharp size={17} />}
              variant={"outline"}
              borderColor={"transparent"}
              borderRadius={"full"}
              isRound
            />
          </InputRightElement>
        </InputGroup>
      </form>

      <Modal
        isOpen={imgUrl ? true : false}
        onClose={() => {
          onClose();
          setImgUrl("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imgUrl} borderRadius={"3%"} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <IoSendSharp
                  size={24}
                  cursor={"pointer"}
                  onClick={handleSendMessage}
                />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MessageInput;
