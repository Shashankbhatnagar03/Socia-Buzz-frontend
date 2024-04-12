import { Avatar, Box, Flex, Link, Text, VStack } from '@chakra-ui/react'
import { BsInstagram } from 'react-icons/bs'

const UserHeader = () => {
  return (
    <VStack gap={4} alignItems={"start"} >
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"}>Mark Zuckerberg</Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>Zuckerberg</Text>
                    <Text fontSize={"xs"} bg={"grey.dark"} color={"grey.light"} p={1} borderRadius={"full"}>sociaBuzz.net</Text>
                </Flex>

            </Box>
            <Box>
                <Avatar name="Mark Zuckerberg" src='/zuck-avatar.png' size={"xl"} />
            </Box>
        </Flex>
        <Text>
            Title Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ducimus, ex esse exercitationem 
        </Text>
        <Flex w={"full"} justifyContent={'space-between'}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={'grey.light'}>2.1K followers</Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Link color={"grey.light"}>instagram.com</Link>
            </Flex>
            <Flex>
                <Box className='icon-container'>
                    <BsInstagram size={24} cursor={"pointer"}/>
                </Box>
            </Flex>

        </Flex>
    </VStack>
  )
}

export default UserHeader