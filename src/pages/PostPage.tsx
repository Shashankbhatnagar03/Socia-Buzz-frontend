import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";

const PostPage = () => {
  return (
    <>
      <Flex w="full">
        
        <Flex  alignItems="space" >
          <Flex alignItems={"center"}>
          <Avatar src='/zuck-avatar.png'  size={"md"} name="Mark"/>
            <Text fontSize={"sm"} mt={4} ml={2} fontWeight={"bold"}>Mark zukerberg</Text>
            <Image src="/verified.png" h={4} w={4} ml={1} mt={5}/>
            <Text fontSize={"sm"} ml={1} mt={4} color={"grey.light"}>1d </Text>

          </Flex>
          
          <Flex>
          </Flex>
        
        <Flex ml={45} gap="4" alignItems={"center"}>
          <Text fontSize={"sm"} color={"grey.light"}>1d </Text>
          <BsThreeDots/>
          </Flex>
        </Flex>
      </Flex>

      <Text my={3} >Let's talk about anything</Text>
      <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"grey.light"}>
            <Image src={"/post1.png"} w={"full"}/>
          </Box>
    </>
  );
};

export default PostPage;
