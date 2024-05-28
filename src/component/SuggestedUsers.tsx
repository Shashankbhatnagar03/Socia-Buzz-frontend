import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";
import { IUser } from "../types/types";

const SuggestedUsers = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestedUsers, setSuggestedUsers] = useState<IUser[]>([]);
  const toast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://sociabuzz-backend.onrender.com/api/v1/users/suggested"
        );
        const data = await res.json();
        if (data.error) {
          toast("Error", data.error, "error");
        }
        setSuggestedUsers(data);
      } catch (error) {
        toast("Error", "Error while fetching suggested users", "error");
      } finally {
        setLoading(false);
      }
    };
    getSuggestedUsers();
  }, [toast]);

  return (
    <>
      <Text fontSize={"lg"} fontWeight={"bold"} mb={4}>
        Suggested User
      </Text>
      <Flex direction={"column"} gap={4}>
        {!loading &&
          suggestedUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))}
        {loading &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              alignItems={"center"}
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
                <Skeleton w={"60px"} h={"20px"} />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default SuggestedUsers;
