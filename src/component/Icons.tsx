import {
  Box,
  Button,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { IconsProps } from "../types/types";

const MAX_CHAR = 500;
const Icons = ({ post }: IconsProps) => {
  const user = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [liked, setLiked] = useState<boolean>(post.likes.includes(user?._id));
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [reply, setReply] = useState<string>("");
  const toast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();

  const handleLikeAndUnlike = async () => {
    if (!user)
      return toast("Error", "You must be logged in to like a post", "error");

    if (isLiking) return;

    setIsLiking(true);
    try {
      const res = await fetch(
        "https://sociabuzz-backend.onrender.com/api/v1/posts/like/" + post._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.error) return toast("Error", data.error, "error");

      if (!liked) {
        //add the id of the current user to likes aray
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, user._id] };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: p.likes.filter((id) => id !== user._id) };
          }
          return p;
        });
        setPosts(updatedPosts);
      }

      setLiked(!liked);
    } catch (error) {
      toast("Error", error as string, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async () => {
    if (!user)
      return toast(
        "Error",
        "You must be logged in to Reply to a post",
        "error"
      );

    if (isReplying) return;

    setIsReplying(true);
    try {
      const res = await fetch(
        "https://sociabuzz-backend.onrender.com/api/v1/posts/reply/" + post._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: reply }),
        }
      );

      const data = await res.json();
      if (data.error) return toast("Error", data.error, "error");

      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });
      setPosts(updatedPosts);
      toast("Success", "Reply posted Successfully", "success");
      onClose();
      setReply("");
    } catch (error) {
      toast("Error", error as string, "error");
    } finally {
      setIsReplying(false);
    }
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setReply(truncatedText);
      setRemainingChar(0);
    } else {
      setReply(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };
  return (
    <Flex flexDirection="column">
      <Flex
        cursor={"pointer"}
        gap={3}
        my={2}
        onClick={(e) => e.preventDefault()}
      >
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={handleLikeAndUnlike}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          onClick={onOpen}
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"grey.light"} fontSize="sm">
          {post.replies.length} Replies{" "}
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"grey.light"}></Box>
        <Text color={"grey.light"} fontSize="sm">
          {post.likes.length} likes
        </Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg={
            colorMode === "dark"
              ? "rgba(16, 16, 16, 0.6)"
              : "rgba(237, 242, 247, 0.6)"
          }
          backdropFilter="blur(25px)"
        >
          <ModalHeader></ModalHeader>
          <ModalCloseButton size={"sm"} />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Reply"
                value={reply}
                onChange={handleTextChange}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={isReplying}
              onClick={handleReply}
            >
              Reply
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
export default Icons;
