import { useEffect, useState } from "react";
import UserHeader from "../component/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../component/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const toast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  useEffect(() => {
    const getPosts = async () => {
      try {
        setFetchingPosts(true);
        const res = await fetch(`/api/v1/posts/user/${username}`);
        const data = await res.json();
        console.log(data);
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
  }, [username, toast, setPosts]);

  console.log("here recoil ", posts);
  if (!user) {
    if (loading) {
      return (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      );
    } else {
      return <h1>User not Found</h1>;
    }
  }

  // console.log(user);
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
