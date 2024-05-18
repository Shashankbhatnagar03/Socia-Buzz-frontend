import { Box, Flex, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect, useState } from "react";
import useGetBulkUsersDetails from "../hooks/useGetBulkUsersDetails";
import { IUser } from "../types/types";

import FollowerAndFollowingContainer from "./FollowerAndFollowingContainer";
import useShowToast from "../hooks/useShowToast";

const Followings = () => {
  const { user, loading } = useGetUserProfile();
  const { bulkUser, bulkUsersLoading } = useGetBulkUsersDetails();
  const [following, setFollowing] = useState<IUser[]>([]);
  const [loadingFollowings, setLoadingFollowings] = useState<boolean>(true);
  const toast = useShowToast();
  useEffect(() => {
    const getFollowings = async () => {
      setLoadingFollowings(true);

      try {
        if (user && bulkUser) {
          const followings = bulkUser.filter(
            (u) =>
              user.following.includes(u._id) &&
              u._id !== user._id &&
              u.isFrozen === false
          );
          setFollowing(followings);
        }
      } catch (error) {
        toast("Error", "Error while fetching followings", "error");
      } finally {
        setLoadingFollowings(false);
      }
    };
    getFollowings();
  }, [setFollowing, user, bulkUser, toast]);

  if (!loadingFollowings && following.length === 0) {
    return <h1>User is not following anyone.</h1>;
  }

  return (
    <>
      {(loadingFollowings || bulkUsersLoading || loading) &&
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
      {(!loadingFollowings || !bulkUsersLoading || !loading) && (
        <Box maxHeight="400px" overflowY="auto">
          <VStack spacing={7} mt={4}>
            {following &&
              following.map((u) => (
                <FollowerAndFollowingContainer key={u._id} user={u} />
              ))}
          </VStack>
        </Box>
      )}
    </>
  );
};

export default Followings;
