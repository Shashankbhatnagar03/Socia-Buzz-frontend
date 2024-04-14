import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Icons from "./Icons";
import { useState } from "react";

interface UserPostProps {
  likes:number,
  replies:number,
  postImg?: string, 
  postTitle:string
}
const UserPost=({likes , replies,postImg,postTitle }:UserPostProps) => {
    const [liked , setLiked] = useState<boolean>(false);
  return (
    <Link to={"/mark/post/1"}>
      <Flex gap={3} mb={4} py={5}>
        <Flex  flexDirection={"column"} alignItems={"center"}>
          <Avatar size="md" name="MArk" src="/zuck-avatar.png" />
          <Box w="1px" h={"full"} bg="grey.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              size="xs"
              name="john doe"
              src="https://bit.ly/dan-abramov"
              position={"absolute"}
              top={"0px"}
              left="15px"
              padding={"2px"}
            />
            <Avatar
              size="xs"
              name="john doe"
              src="https://bit.ly/dan-abramov"
              position={"absolute"}
              bottom={"0px"}
              right="-5px"
              padding={"2px"}
            />
            <Avatar
              size="xs"
              name="john doe"
              src="https://bit.ly/kent-c-dodds"
              position={"absolute"}
              bottom={"0px"}
              left="4px"
              padding={"2px"}
            />
          </Box>
        </Flex>

        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {" "}
                Mark zukerberg
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"grey.light"}>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>
            {postTitle}
          </Text>
          {postImg && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"grey.light"}>
            <Image src={postImg} w={"full"}/>
          </Box>
          )}
          
          
          <Flex gap={3} my={1}>
            <Icons liked={liked} setLiked={setLiked}/>
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"grey.light"} fontSize="sm">{replies} Replies  </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"grey.light"}></Box>
            <Text color={"grey.light"} fontSize="sm">{likes} likes</Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;
