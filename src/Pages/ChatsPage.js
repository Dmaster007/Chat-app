import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatContext'
import { Box } from '@chakra-ui/react';
import SideDrawer from './components/Chats and Header/SideDrawer';
import ChatBox from './components/Chats and Header/ChatBox';
import MyChats from './components/Chats and Header/MyChats';

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  // useEffect(()=>{
  //   if (user) {
  //       window.location.reload();
  //     }
  // })
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
  


