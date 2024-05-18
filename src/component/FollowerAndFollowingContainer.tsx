import { Avatar, Box, Button, Flex, Image, Text } from "@chakra-ui/react";

import { IUser } from "../types/types";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link } from "react-router-dom";

interface IFollowerAndFollowingContainerProps {
  user: IUser;
}
const FollowerAndFollowingContainer = ({
  user,
}: IFollowerAndFollowingContainerProps) => {
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  const currentUser = useRecoilValue(userAtom);
  return (
    <>
      <Flex justifyContent={"space-between"} w={"400px"}>
        <Box>
          <Link to={`/${user.username}`}>
            <Box display="flex">
              <Avatar
                src={user.profilePic}
                name={user.username}
                boxSize="50px"
                cursor={"pointer"}
              />

              <Box ml={2}>
                <Text fontWeight="bold" cursor={"pointer"}>
                  {user.username}
                </Text>
                <Text cursor={"pointer"}>{user.name}</Text>
              </Box>
              <Image src="/verified.png" w={4} h={4} ml={1} mt={1} />
            </Box>
          </Link>
        </Box>
        {currentUser._id !== user._id && (
          <Box
            alignContent={"center"}
            ml={"7"}
            // position={"revert-layer"}.
            // justifyContent={"flex-end"}
            // position={"absolute"}
            // flexWrap={"inherit"}
            // right={"35%"}
            // overflowY={"auto"}
          >
            <Button
              size={"sm"}
              color={following ? "black" : "white"}
              bg={following ? "white" : "blue.400"}
              onClick={handleFollowUnfollow}
              isLoading={updating}
              _hover={{
                color: following ? "black" : "white",
                opacity: ".8",
              }}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          </Box>
        )}
      </Flex>
    </>
  );
};

export default FollowerAndFollowingContainer;
