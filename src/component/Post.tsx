import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Icons from "./Icons";
import { MouseEventHandler, useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { IUser, UserPagePostProps } from "../types/types";

const Post = ({ post, userId }: UserPagePostProps) => {
  const [user, setUser] = useState<IUser | null>();
  const currentUser = useRecoilValue(userAtom);
  const toast = useShowToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useRecoilState(postsAtom);

  // console.log(userId);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/v1/users/profile/" + userId);
        const data = await res.json();
        // console.log(data, "maks");
        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        toast("Error", "Error will fetching data", "error");
        setUser(null);
      }
    };
    getUser();
  }, [userId, toast]);

  if (!user) return null;
  // console.log(post.createdAt, "Sss");

  const handleDeletePost: MouseEventHandler<HTMLDivElement> = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/v1/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        toast("Error", data.error, "error");
        return;
      }
      toast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      toast("Error", "Error will deleting a post", "error");
    }
  };
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={user.name}
            src={user.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg="grey.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name={post.replies[0].username}
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size="xs"
                name={post.replies[1].username}
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size="xs"
                name={post.replies[2].username}
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>

        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
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

              {/* do below implementation  */}
              {/* <Box className='icon-container' >
                    <Menu>
                        <MenuButton>
                        <BsThreeDots cursor={"pointer"}/>
                        </MenuButton>
                        <Portal>
                            <MenuList bg={"grey.dark"}>
                                <MenuItem bg={"grey.dark"} >Copy Link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>

                </Box> */}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
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

          <Flex gap={3} my={1}>
            <Icons post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
