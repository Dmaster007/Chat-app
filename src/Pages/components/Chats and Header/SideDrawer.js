import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, {  useState } from 'react';
import {BellIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { ChatState } from '../../../Context/ChatContext';
import ProfileModel from '../Models/ProfileModel';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../../../Context/UserListItem';
import NotificationBadge, { Effect } from 'react-notification-badge';
const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setsearchResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [LoadingChat, setLoadingchat] = useState();
 const {user ,setselectedChat ,Chats ,setChats ,notifications ,setNotifications} = ChatState();
 const { isOpen, onOpen, onClose } = useDisclosure()
 const history = useHistory();
 const toast = useToast();
 const accessChat = async (userId) => {
  console.log(userId);
  try {
    setLoadingchat(true)

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    // Make the API call
    console.log(config);
    setLoadingchat(false)
    const {data} = await axios.post('/api/chats', { userId }, config);
    if(!Chats.find((c)=>c._id ===data._id)) setChats([data , ...Chats])
    // Assuming the response data structure is what you expect
    setselectedChat(data);
    setLoadingchat(false);
    onClose(); // Assuming onClose is a function to close a modal or similar
  } catch (error) {
    // Handle errors
    toast({
      title: "Error fetching the chat",
      description: error.message || "An unexpected error occurred",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const handleSearch = async() => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });

    } 
    
    try {
      setIsLoading(true);
      const config = {
        headers:{
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.get(`/api/user?search=${search}`,config)
      console.log(config); 
      
      setIsLoading(false);
      setsearchResult(data)
    
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    return 
  };
  
  return (
    
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search user" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: 'none', md: 'flex' }} px={'3'}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Durga-Texts
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge count={notifications.length} effect = {Effect.SCALE}/>
            <BellIcon/>
            </MenuButton>
            <MenuList pl={3}>
              {!notifications.length && <p>No New Mesaages</p>}
              {notifications.map((notif)=>(
                <MenuItem onClick={()=>{
                  setselectedChat(notif.chat)
                  setNotifications(notifications.filter((n)=>(n)!==notif))
                }}>
                {notif.chat.isGroup ? `New Message from ${notif.chat.chatName}`:`New Message from ${notif.sender.name}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu> 
           <Menu>
            <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon/>}>
              <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
              <MenuItem >My Profile</MenuItem>
              </ProfileModel>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              <MenuItem>Contact</MenuItem>
            </MenuList>
          </Menu>
         
        </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>
          <DrawerBody>
          <Box display={'flex'}
          pb={2}
          >
             <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button  colorScheme="blue" onClick={handleSearch}>Go</Button>

          </Box>
          {isLoading ? (
  <ChatLoading />
) : (
  searchResult ? (
    searchResult.map((user) => (
      <UserListItem key={user._id} user={user} handleFuntion={()=>accessChat(user._id)}>
        {/* Any additional props or children for UserListItem */}
      </UserListItem>
    ))
  ) : (
    <div>No results</div>
  )
)}


            
{LoadingChat && <Spinner ml="auto" d="flex" />}
        </DrawerBody>
        </DrawerContent>
        
        
      </Drawer>
    </>
  );
};




export default SideDrawer;
