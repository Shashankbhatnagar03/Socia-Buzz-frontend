import { useEffect, useState } from "react";
import UserHeader from "../component/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import Post from "../component/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";

const UserPage: React.FC = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const toast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  useEffect(() => {
    const getPosts = async () => {
      try {
        if (!user) return;
        setFetchingPosts(true);
        const res = await fetch(
          `https://sociabuzz-backend.onrender.com/api/v1/posts/user/${username}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        // console.log(data);
        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        toast("Error", "Error will fetching user data", "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [username, toast, setPosts, user]);

  if (!user) {
    if (loading) {
      return (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      );
    } else {
      return (
        <Box display="flex" justifyContent="center">
          <Heading size="lg" mr={10} color={"red.400"}>
            User not Found!
          </Heading>
        </Box>
      );
    }
  }

  return (
    <>
      <UserHeader user={user} />

      {!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} userId={post.postedBy} />
      ))}
    </>
  );
};
export default UserPage;
