import { useEffect, useState } from "react";
import UserHeader from "../component/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../component/Post";
interface PostType {
  _id: string;
  text: string;
  replies: IReply[];
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

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const toast = useShowToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/v1/users/profile/${username}`);
        const data = await res.json();
        // console.log(data);
        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }

        setUser(data);
      } catch (error) {
        toast("Error", "User page not fetched", "error");
      } finally {
        setLoading(false);
      }
    };
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
    getUser();
    getPosts();
  }, [username, toast]);

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
