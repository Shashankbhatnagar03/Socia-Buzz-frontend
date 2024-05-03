import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";

import Icons from "../component/Icons";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostType } from "../types/types";
import { formatDistanceToNow } from "date-fns";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import Comment from "../component/Comment";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [post, setPost] = useState<PostType>();
  const toast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/v1/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }

        console.log(data);
        setPost(data);
      } catch (error) {
        toast("Error", "Something went wrong", "error");
      }
    };
    getPost();
  }, [toast, pid]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/v1/posts/${post?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        toast("Error", data.error, "error");
        return;
      }
      toast("Success", "Post deleted", "success");
      navigate(`/${user?.username}`);
      // console.log(user);
    } catch (error) {
      toast("Error", "Error will deleting a post", "error");
    }
  };

  if (!user && loading)
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );

  if (!user) {
    // Display an error message or a loading indicator
    return toast("Error", "Error loading user data or User not found", "error");
  }
  if (!post) {
    return null;
  }
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.name} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={1} mt={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"grey.light"}
          >
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <div onClick={handleDeletePost}>
              <DeleteIcon cursor={"pointer"} bgSize={20} />
            </div>
          )}
        </Flex>
      </Flex>

      <Text my={3}>{post.text} </Text>

      {post.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"grey.light"}
        >
          <Image src={post.img} w={"full"} />
        </Box>
      )}

      <Flex gap="3" my="3">
        <Icons post={post} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"grey.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      {post.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={reply._id === post.replies[post.replies.length - 1]._id}
        />
      ))}
    </>
  );
};

export default PostPage;
