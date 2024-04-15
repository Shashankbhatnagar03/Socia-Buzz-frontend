import { Avatar, Box, Button, Divider, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useToast } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Icons from "../component/Icons";
import { useState } from "react";
import Comment from "../component/Comment";

const PostPage = () => {
  const [liked , setLiked] = useState<boolean>(false);
  const toast = useToast();
  const copyUrl = () =>{
    const currentUrl:string = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(()=>{
        toast({
          title: 'Profile Link Copied',
            description: "",
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
    })
}
  return (
    <>
    <Flex>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={"/zuck-avatar.png"} size={"md"} name='Mark Zuckerberg' />
					<Flex>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							Mark Zukerberg
						</Text>
						<Image src='/verified.png' w={4} h={4} ml={1} mt={1}/>
					</Flex>
				</Flex>
				<Flex gap={3} alignItems={"center"}>
					<Text fontSize={"sm"}  color={"grey.light"}>
						1d
					</Text>

          <Box>
                    <Menu>
                        <MenuButton>
                        <BsThreeDots onClick={copyUrl} cursor={"pointer"}/>
                        </MenuButton>
                        <Portal>
                            <MenuList bg={"grey.dark"}>
                                <MenuItem bg={"grey.dark"} onClick={copyUrl}>Copy Link</MenuItem>
                            </MenuList>
                            
                        </Portal>
                    </Menu>

                </Box>
          
					
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
      
      <Comment  comment="Great!!" createdAt={2} likes={120} username="raju rastogi" userAvatar="/zuck-avatar.png"/>
      <Comment comment= " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur neque quam nihil?!!" createdAt={2} likes={120} username="xyz i" userAvatar="/zuck-avatar.png"/>
      <Comment comment="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur neque quam nihil?!!" createdAt={4} likes={120} username="raju thrp " userAvatar="/zuck-avatar.png"/>

			
		</>
  );
};

export default PostPage;
