import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import "../index.css";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { IUserHeaderProps } from "../types/types";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }: IUserHeaderProps) => {
  const toast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  const color = useColorModeValue("gray.light", "grey.dark");
  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast("Profile Link Copied", "", "success");
    });
  };

  return (
    <VStack gap={4} alignItems={"start"} mt={12}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"md"} fontWeight={"light"}>
              @{user.username}
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "xl",
                md: "2xl",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="broken"
              size={{
                base: "xl",
                md: "2xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Link as={RouterLink} to={`/${user.username}/followers`}>
            <Text color={"grey.light"}>{user.followers.length} followers</Text>
          </Link>

          <Box w={1} h={1} bg={"grey.light"} borderRadius={"full"}></Box>
          <Link as={RouterLink} to={`/${user.username}/followings`}>
            <Text color={"grey.light"}>{user.following.length} followings</Text>
          </Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={color}>
                  <MenuItem bg={color} onClick={copyUrl}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Posts</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
