import React, { useEffect } from 'react'
import { ChatState } from '../../../Context/ChatContext'
import { Box } from '@chakra-ui/react'
import SingleChat from '../SingleChat'

const ChatBox = ({setFetchAgain ,FetchAgain}) => {
  const {selectedChat} =ChatState()

 
  return (
    <Box
    display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px">
    <SingleChat setFetchAgain={setFetchAgain} FetchAgain={FetchAgain} />
    </Box>

  )
}

export default ChatBox