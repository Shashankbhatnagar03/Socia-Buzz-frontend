import { Avatar, Box, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from '@chakra-ui/react'

import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import "../index.css"
interface UserHeader {
    url: URL;
}

const UserHeader = () => {
    const toast = useToast();

    const copyUrl = () =>{
        const currentUrl = window.location.href;
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
    <VStack gap={4} alignItems={"start"} >
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={{ base:"xl",
                    md:"2xl"}} fontWeight={"bold"}>Mark Zuckerberg</Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>Zuckerberg</Text>
                    <Text fontSize={"xs"} bg={"grey.dark"} color={"grey.light"} p={1} borderRadius={"full"}>sociaBuzz.net</Text>
                </Flex>

            </Box>
            <Box>
                <Avatar name="Mark Zuckerberg" src='/zuck-avatar.png' size={{
                    base:"md",
                    md:"xl"
                }} />
            </Box>
        </Flex>
        <Text>
            Title Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ducimus, ex esse exercitationem 
        </Text>
        <Flex w={"full"} justifyContent={'space-between'}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={'grey.light'}>2.1K followers</Text>
                <Box w={1} h={1} bg={"grey.light"} borderRadius={"full"}></Box>
                <Link color={"grey.light"}>instagram.com</Link>
            </Flex>
            <Flex>
                <Box className='icon-container'>
                    

                    <BsInstagram size={24} cursor={"pointer"}/>
                    
                </Box>
                <Box className='icon-container' >
                    <Menu>
                        <MenuButton>
                            <CgMoreO size={24} cursor={"pointer"} />
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
        <Flex w={"full"}>

            <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                <Text fontWeight={"bold"}> Posts</Text>
            </Flex>

            <Flex flex={1} borderBottom={"1px solid grey"} justifyContent={"center"} pb="3" cursor={"pointer"} color={"grey.light"}>
                <Text fontWeight={"bold"}> Replies</Text>
            </Flex>


        </Flex>
    </VStack>
  )
}

export default UserHeader