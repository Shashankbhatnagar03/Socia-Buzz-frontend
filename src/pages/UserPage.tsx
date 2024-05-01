import { useEffect, useState } from "react";
import UserHeader from "../component/UserHeader";
import UserPost from "../component/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const toast = useShowToast();
  const [loading, setLoading] = useState<boolean>(true);
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

    getUser();
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
      <UserPost
        likes={1200}
        replies={222}
        postImg="/post1.png"
        postTitle="Zukerberg lost 1.5 million"
      />
      <UserPost
        likes={222}
        replies={12}
        postImg="/post1.png"
        postTitle="Zxyzyzy"
      />
      <UserPost
        likes={12132}
        replies={1122}
        postImg="/post1.png"
        postTitle="cncmccmc c"
      />
      <UserPost likes={323} replies={323} postTitle="asdasdasd" />
    </>
  );
};
export default UserPage;
