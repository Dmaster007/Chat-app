import { FormLabel } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { FormControl, Input, VStack ,InputGroup ,Button ,InputRightElement } from '@chakra-ui/react'
export default function Login() {
  const history = useHistory();
    const [show ,setShow] =useState(false)
    const [isLoading ,setLoading] =useState(false)
    const [email , setemail] = useState("");
    const [password , setpassword] = useState("");
    const toast = useToast();
    const HandleShow = ()=>{
        setShow(!show);
    }
    const submitHandler = async () => {
      setLoading(true);
      if (!email || !password) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
  
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
  
        const { data } = await axios.post(
          "/api/user/login",
          { email, password },
          config
        );
  
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
       
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        history.push("/chats");

      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    };
  return (
    <VStack spacing={'5px'}>
       
        <FormControl isRequired id='email'>
           <FormLabel>Email</FormLabel>
           <Input
           placeholder='Enter your Email'
           value={email}
           onChange={(e)=>{
        
              setemail(e.target.value)
           }}></Input>
        </FormControl>
        <FormControl isRequired id='password'>
           <FormLabel>Password</FormLabel>
           <InputGroup>
           <Input
           value={password}
           placeholder='Enter your Password' type={ !show ? 'password' : "text"} onChange={(e)=>{
              setpassword(e.target.value)
           }}></Input>
           <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={HandleShow}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
           </InputGroup>
           
        </FormControl>
  
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        // isLoading={picLoading}
        Loading={isLoading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setemail("guest@example.com");
          setpassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>)
}
