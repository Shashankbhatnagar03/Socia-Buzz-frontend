import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";

import Icons from "../component/Icons";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import Comment from "../component/Comment";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const toast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const currentPost = posts[0];
  console.log(posts, "hello");
  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/v1/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }

        setPosts([data]);
      } catch (error) {
        toast("Error", "Something went wrong", "error");
      }
    };
    getPost();
  }, [toast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/v1/posts/${currentPost?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        toast("Error", data.error, "error");
        return;
      }
      toast("Success", "Post deleted", "success");
      navigate(`/${user?.username}`);
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
    return <Text>User not found!</Text>;
  }
  if (!currentPost) {
    return null;
  }
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Link to={`/${user.username}`}>
            <Avatar src={user.profilePic} size={"md"} name={user.name} />
          </Link>
          <Link to={`/${user.username}`}>
            <Flex>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} mt={1} />
            </Flex>
          </Link>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"grey.light"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <div onClick={handleDeletePost}>
              <DeleteIcon cursor={"pointer"} bgSize={20} />
            </div>
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text} </Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"grey.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap="3" my="3">
        <Icons post={currentPost} />
      </Flex>

      <Divider my={4} />

      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
