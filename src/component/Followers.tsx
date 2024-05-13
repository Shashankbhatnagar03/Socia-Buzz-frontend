import { useEffect, useState } from "react";
import useGetBulkUsersDetails from "../hooks/useGetBulkUsersDetails";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { IUser } from "../types/types";
import { Box, Flex, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";
import FollowerAndFollowingContainer from "./FollowerAndFollowingContainer";
import useShowToast from "../hooks/useShowToast";

const Followers = () => {
  const { user, loading } = useGetUserProfile();
  const { bulkUser, bulkUsersLoading } = useGetBulkUsersDetails();
  const [followers, setFollowers] = useState<IUser[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState<boolean>(true);

  const toast = useShowToast();
  useEffect(() => {
    const getFollowers = async () => {
      setLoadingFollowers(true);

      try {
        if (user && bulkUser) {
          const followers = bulkUser.filter(
            (u) =>
              user.followers.includes(u._id) &&
              u._id !== user._id &&
              u.isFrozen === false
          );
          setFollowers(followers);
        }
      } catch (error) {
        toast("Error", "Error while fetching followers", "error");
      } finally {
        setLoadingFollowers(false);
      }
    };
    getFollowers();
  }, [setFollowers, user, bulkUser, toast]);

  if (!loadingFollowers && followers.length === 0) {
    return <h1>User is not following anyone.</h1>;
  }

  return (
    <>
      {(loadingFollowers || bulkUsersLoading || loading) &&
        [...Array(5)].map((_, i) => (
          <Flex justifyContent={"center"} mt={5}>
            <Flex
              key={i}
              alignItems={"center"}
              justifyContent={"center"}
              borderRadius={"md"}
              p={"1"}
              gap={2}
            >
              <Box>
                <SkeletonCircle size={"12"} />
              </Box>
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"80px"} />
                <Skeleton h={"8px"} w={"80px"} />
              </Flex>
              <Flex>
                <Skeleton ml={"20"} w={"60px"} h={"20px"} />
              </Flex>
            </Flex>
          </Flex>
        ))}
      {(!loadingFollowers || !bulkUsersLoading || !loading) && (
        <Box maxHeight="400px" overflowY="auto">
          <VStack spacing={7} alignItems={"start"} mt={4}>
            {followers.map((u) => (
              <FollowerAndFollowingContainer key={u._id} user={u} />
            ))}
          </VStack>
        </Box>
      )}
    </>
  );
};

export default Followers;
