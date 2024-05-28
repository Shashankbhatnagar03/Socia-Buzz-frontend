import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import useShowToast from "../hooks/useShowToast";
import Post from "../component/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../component/SuggestedUsers";
import useGetBulkUsersDetails from "../hooks/useGetBulkUsersDetails";
import { PostType } from "../types/types";

const HomePage = () => {
  const { bulkUser } = useGetBulkUsersDetails();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch(
          "https://sociabuzz-backend.onrender.com/api/v1/posts/feed"
        );
        const data = await res.json();
        if (data.error) {
          toast("Error", data.error, "error");
        }

        const filteredPosts = data.filter((post: PostType) =>
          bulkUser.some((user) => user._id === post.postedBy && !user.isFrozen)
        );
        // console.log(data);
        // console.log(filteredPosts);
        setPosts(filteredPosts);
      } catch (error) {
        toast("Error", "Error will fetching feeds", "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [toast, setPosts, bulkUser]);
  return (
    <>
      <Flex gap={10} alignItems={"flex-start"}>
        <Box flex={70}>
          {!loading && posts.length === 0 && (
            <Flex justify={"center"} mt={10}>
              <h1>Follow some user to see the feed</h1>
            </Flex>
          )}

          {loading && (
            <Flex justify={"center"}>
              <Spinner size={"xl"} />
            </Flex>
          )}

          {posts.map((post) => (
            <Post key={post._id} post={post} userId={post.postedBy} />
          ))}
        </Box>
        <Box flex={30} display={{ base: "none", md: "block" }}>
          <SuggestedUsers />
        </Box>
      </Flex>
    </>
  );
};

export default HomePage;
