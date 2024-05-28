import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Divider,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { IUser } from "../types/types";
import useShowToast from "../hooks/useShowToast";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const currentUser = useRecoilValue(userAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUser] = useState<IUser[]>([]);
  const toast = useShowToast();
  const [filter, setFilter] = useState<string>("");
  useEffect(() => {
    const filteredConversation = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://sociabuzz-backend.onrender.com/api/v1/users/profiles/bulk/?filter=${filter}`
        );
        let data = await res.json();
        if (data.error) {
          toast("Error", "something went wrong", "error");
          return;
        }

        data = data.filter(
          (user: IUser) =>
            user._id !== currentUser._id && user.isFrozen === false
        );

        setUser(data);
      } catch (error) {
        toast("Error", "Something went wrong ", "error");
      } finally {
        setLoading(false);
      }
    };
    const timeOutId = setTimeout(filteredConversation, 500);

    return () => clearTimeout(timeOutId);
  }, [toast, filter, currentUser]);

  return (
    <>
      <Box mt={10}>
        <form>
          <InputGroup>
            <InputLeftElement
              cursor={"pointer"}
              children={
                loading ? (
                  <Spinner size={"sm"} />
                ) : (
                  <SearchIcon color="gray.300" />
                )
              }
            />
            <Input
              type="text"
              placeholder="Search for a user"
              focusBorderColor="teal.400"
              borderColor="gray.300"
              size="md"
              borderRadius={"full"}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            />
          </InputGroup>
        </form>
        <Divider my={4} />

        <Box maxHeight="400px" overflowY="auto">
          <VStack spacing={7} alignItems={"start"}>
            {users &&
              users.map((user) => {
                return (
                  <>
                    <Link to={`/${user.username}`}>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={user.profilePic}
                          name={user.username}
                          boxSize="50px"
                        />

                        <Box ml={4}>
                          <Text fontWeight="bold">{user.username}</Text>
                          <Text>{user.name}</Text>
                        </Box>
                        <Image src="/verified.png" w={4} h={4} mb={6} />
                      </Box>
                    </Link>
                  </>
                );
              })}
          </VStack>
        </Box>
      </Box>
    </>
  );
};

export default SearchPage;
