import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import useShowToast from "../hooks/useShowToast";
import Post from "../component/Post";
interface PostType {
  _id: string;
  text: string;
  replies: [IReply];
  postedBy: string;
  likes: [string];
  img: string;
  createdAt: string;
}
interface IReply {
  userId: string;
  text: string;
  userProfilePic: string;
  username: string;
  _id: string;
}

const HomePage = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/posts/feed");
        const data = await res.json();
        if (data.error) {
          toast("Error", data.error, "error");
        }
        console.log(data, "sssd");
        setPosts(data);
      } catch (error) {
        toast("Error", "Error will fetching feeds", "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [toast]);
  // console.log(posts, "sd");
  return (
    <>
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
    </>
  );
};

export default HomePage;
