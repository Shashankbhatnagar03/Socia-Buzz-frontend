import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut, FiSettings } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { LuMessagesSquare } from "react-icons/lu";
import { useState } from "react";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <>
      {user && (
        <Flex justifyContent={"space-between"} mt={6} mb={3}>
          {user && (
            <Link as={RouterLink} to="/" mt={4}>
              <Button
                size={"xs"}
                h={"2.5rem"}
                cursor={"pointer"}
                background={"transparent"}
                borderRadius={"full"}
              >
                <AiFillHome size={24} cursor={"pointer"} />
              </Button>
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
            <Flex alignItems={"center"} gap={1}>
              <Link as={RouterLink} to={`/${user.username}`}>
                <Button
                  size={"xs"}
                  h={"2.3rem"}
                  cursor={"pointer"}
                  background={"transparent"}
                  borderRadius={"full"}
                >
                  <RxAvatar size={24} cursor={"pointer"} />
                </Button>
              </Link>
              <Link as={RouterLink} to={`/chat`}>
                <Button
                  size={"xs"}
                  h={"2.3rem"}
                  cursor={"pointer"}
                  background={"transparent"}
                  borderRadius={"full"}
                >
                  <LuMessagesSquare size={24} cursor={"pointer"} />
                </Button>
              </Link>
              <Link as={RouterLink} to={`/settings`}>
                <Button
                  size={"xs"}
                  h={"2.3rem"}
                  onClick={handleClick}
                  cursor={"pointer"}
                  background={"transparent"}
                  borderRadius={"full"}
                >
                  <FiSettings
                    size={20}
                    style={{
                      transform: isClicked ? "rotate(75deg)" : "",
                      transition: "transform 0.5s ease-in-out",
                    }}
                  />
                </Button>
              </Link>

              <Button
                size={"xs"}
                onClick={logout}
                background={"transparent"}
                borderRadius={"full"}
                h={"2.3rem"}
                cursor={"pointer"}
              >
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
