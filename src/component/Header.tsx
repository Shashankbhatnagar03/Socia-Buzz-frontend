import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();

  return (
    <>
      {user && (
        <Flex justifyContent={"space-between"} mt={6} mb={3}>
          {user && (
            <Link as={RouterLink} to="/">
              <AiFillHome size={24} cursor={"pointer"} />
            </Link>
          )}

          <Image
            cursor={"pointer"}
            alt="logo"
            w={"60px"}
            h={"60px"}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
          />
          {user && (
            <Flex alignItems={"center"} gap={4}>
              <Link as={RouterLink} to={`/${user.username}`}>
                <RxAvatar size={24} cursor={"pointer"} />
              </Link>
              <Button size={"xs"} onClick={logout}>
                <FiLogOut size={20} />
              </Button>
            </Flex>
          )}
        </Flex>
      )}
      {!user && (
        <Flex justifyContent={"center"} mt={6} mb={3}>
          <Image
            cursor={"pointer"}
            alt="logo"
            w={"60px"}
            h={"60px"}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
          />
        </Flex>
      )}
    </>
  );
};

export default Header;
