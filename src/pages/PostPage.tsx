import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Icons from "../component/Icons";
import { useState } from "react";
import Comment from "../component/Comment";

const PostPage = () => {
  const [liked , setLiked] = useState<boolean>(false);
  return (
    <>
    <Flex>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={"/zuck-avatar.png"} size={"md"} name='Mark Zuckerberg' />
					<Flex>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							Mark Zukerberg
						</Text>
						<Image src='/verified.png' w={4} h={4} ml={4} />
					</Flex>
				</Flex>
				<Flex gap={4} alignItems={"center"}>
					<Text fontSize={"sm"}  color={"grey.light"}>
						1d
					</Text>
          <BsThreeDots/>
					
				</Flex>
			</Flex>

			<Text my={3}>text t </Text>

        
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"grey.light"}>
            <Image src={"/post1.png"} w={"full"}/>
          </Box>

          <Flex gap="3" my="3" >
            <Icons liked ={liked} setLiked={setLiked }/>
          </Flex>

          <Flex gap="2" alignItems="center">
            <Text color={"grey.light"} fontSize={"sm"}>123 replies</Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} color={"grey.light"}></Box>
            <Text color={"grey.light"} fontSize={"sm"}>{123 + (liked? 1 :0)} likes</Text>
          </Flex>

          <Divider my={4}/>
			
			

			
			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"grey.light"}>Get the app to like, reply and post.</Text>
				</Flex>
        <Button>Get</Button>
			</Flex>

      <Divider my={4}/>
      <Comment/>
      <Comment/>
      <Comment/>

			
		</>
  );
};

export default PostPage;
