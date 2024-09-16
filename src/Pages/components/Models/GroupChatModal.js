import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    FormLabel,
    FormControl,
    useDisclosure,
    useToast,
    Box,
    Spinner,
  } from '@chakra-ui/react'
import { ChatState } from '../../../Context/ChatContext'
import axios from 'axios'
import UserListItem from '../../../Context/UserListItem'
import UserBadgeItem from '../userAvatar/userBadgeItem'
export default function GroupChatModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [groupChatName, setgroupChatName] = useState()
    const [setselectedusers, setSetselectedusers] = useState([])
    const [search, setsearch] = useState('')
    const [searchResult, setsearchResult] = useState([])
    const [isLoading  ,setIsLoading] = useState(false)
    const toast = useToast();
    const {user , Chats ,setChats} = ChatState();
    const handleGroup = (userToAdd) => {
        if (setselectedusers.includes(userToAdd)) {
          toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
    
        setSetselectedusers([...setselectedusers, userToAdd]);
      };
    const handleChange = async (query)=>{
        setsearch(query);
        if(!query){
            return ;
        }
        try {
            setIsLoading(true);
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`/api/user?search=${search}`,config)
           
            setsearchResult(data)
            setIsLoading(false)
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
    }
    const handleSubmit =async()=>{
        
        if (!groupChatName || !setselectedusers) {
            toast({
              title: "Please fill all the feilds",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }
      
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.post(
              `/api/chats/group`,
              {
                name: groupChatName,
                users: JSON.stringify(setselectedusers.map((u) => u._id)),
              },
              config
            );
            console.log(data);
            setChats([data, ...Chats]);
            onClose();
            toast({
              title: "New Group Chat Created!",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setSetselectedusers([])
            setsearchResult([])
          } catch (error) {
            toast({
              title: "Failed to Create the Chat!",
              description: error.response.data,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
        }
        
    }
    const handleDelete =(delUser)=>{
        setSetselectedusers(setselectedusers.filter(sel =>sel._id!== delUser._id ))
    }
    return (
      <>
        <span onClick={onOpen}>{children}</span>
      
  
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Group Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Group Name</FormLabel>
                <Input ref={initialRef} onChange={(e)=>setgroupChatName(e.target.value)} placeholder='First name' />
              </FormControl>
  
              <FormControl mt={4}>
                <FormLabel>Search  </FormLabel>
                <Input placeholder='eg : Durgesh , Deshmukh ...' onChange={(e)=>handleChange(e.target.value)} />
              {/* {selected users} */}
              {setselectedusers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
              </FormControl>
             
              <Box pt={'10px'}>
              {isLoading ? (
              // <ChatLoading />
              
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
          
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFuntion={() => handleGroup(user)}
                  />
                ))
            )}
            </Box>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Create
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
