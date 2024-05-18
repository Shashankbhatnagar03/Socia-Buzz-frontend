import { useState } from "react";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import Followers from "../component/Followers";
import Followings from "../component/Followings";

const FollowerAndFollowingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const lastSegment = pathname.split("/").pop();
  console.log(lastSegment);
  const [followersOrFollowing, setFollowersOrFollowing] = useState<string>(
    lastSegment === "followers" ? "followers" : "followings"
  );
  // const [user, setUser] = useState<IUser | null>(null);

  const { user, loading } = useGetUserProfile();

  const handleFollowersClick = () => {
    setFollowersOrFollowing("followers");
    navigate(`/${user?.username}/followers`);
  };

  const handleFollowingClick = () => {
    setFollowersOrFollowing("followings");
    navigate(`/${user?.username}/followings`);
  };

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
    <Box>
      <Box ml={2}>
        <Link to={`/${user.username}`}>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight={"bold"}>
            {user.name}
          </Text>
        </Link>
        <Flex gap={2} alignItems={"center"}>
          <Link to={`/${user.username}`}>
            <Text fontSize={"lg"} fontWeight={"light"}>
              @{user.username}
            </Text>
          </Link>
        </Flex>
      </Box>
      <Flex justifyContent="space-between" mt={2}>
        <Flex w={"full"} position={"relative"}>
          <Flex flex={1} justifyContent={"center"} pb="3" cursor={"pointer"}>
            <Button bg={"transparent"} onClick={handleFollowersClick}>
              <Text fontWeight={"bold"}> Followers </Text>
            </Button>
          </Flex>

          <Flex
            flex={1}
            justifyContent={"center"}
            pb="3"
            cursor={"pointer"}
            color={"grey.light"}
          >
            <Button bg={"transparent"} onClick={handleFollowingClick}>
              <Text fontWeight={"bold"}> Following</Text>
            </Button>
          </Flex>
          <Box
            position="absolute"
            bottom="0"
            left={followersOrFollowing === "followers" ? "0" : "50%"}
            w={followersOrFollowing === "followers" ? "50%" : "50%"}
            h="1.5px"
            bg="white"
            transition="all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)"
          />
        </Flex>
      </Flex>

      {followersOrFollowing === "followings" ? <Followings /> : <Followers />}
    </Box>
  );
};

export default FollowerAndFollowingPage;
