import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatContext";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../components/Models/ProfileModel";
import UpdateGroupChatModal from "./Chats and Header/UpdateGroupChatModal";
import axios from "axios";
import "./style.css";
import ScrollebleChat from "./Chats and Header/ScrollebleChat";
import io from 'socket.io-client'
const ENDPOINT = 'http://localhost:5000';
var socket ,selectedChatCompare;
const SingleChat = ({ setFetchAgain, FetchAgain }) => {
  const { user, selectedChat, setselectedChat ,notifications ,setNotifications} = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
  
    socket.on("connect", () => {
      console.log("connected to socket");
    });
    socket.emit('setup' , user);
    socket.on('connection',()=>{
      setSocketConnected(true)
    })
    socket.on('typing',()=>{
      setTyping(true);
    })
    socket.on('stop typing',()=>{
      setTyping(false);
    })
    // Other socket-related code here...
  
  
  }, []);
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) {
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        setLoading(true);
  
        const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
  
        setMessages(data);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
    selectedChatCompare = selectedChat;
    if(selectedChat){
      socket.emit('join room' ,selectedChat._id)

    }
   
    fetchMessages();
  }, [selectedChat]);
  useEffect(()=>{
    socket.on("message recived" ,(newMessage)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id ){
        //give notification
        if(!notifications.includes(newMessage)){
          setNotifications([ newMessage , ...notifications])
          setFetchAgain(!FetchAgain)
        }

      }else{
          setMessages([... messages ,newMessage])
      }
    })
  })
  console.log(notifications,"----------------------------");
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit('new message' ,data)
        setMessages([...messages, data]);
        
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler =(e)=>{

      setNewMessage(e.target.value)
      if(!socketConnected)return ;
      if(!typing){
        setIsTyping(true)
        socket.emit('typing' ,selectedChat._id)
      }
      let LastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
        var timeNow =  new Date().getTime();
        var timeDaiff = timeNow -LastTypingTime;

        if(timeDaiff>=timerLength && typing){
          socket.emit('stop typing' ,selectedChat)
          setIsTyping(false)
        }
      }, timerLength);
  }
  // useEffect(() => {
  //   console.log(messages, "messages");
  // }, [messages]);
  
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {" "}
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {" "}
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  FetchAgain={FetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
           {loading ? <Spinner
           size={'x1'}
           w={20}
           h={20}
           alignSelf={'center'}
           margin={'auto'}
           /> : 
           <div className="messages"> 
            <ScrollebleChat messages = {messages}/>
            </div>}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {istyping && <div>lodaing</div>}
              <Input variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler} ></Input>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
