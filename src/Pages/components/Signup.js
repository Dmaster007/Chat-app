import { FormControl, Input, VStack ,InputGroup ,Button ,InputRightElement } from '@chakra-ui/react'
import { FormLabel } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
export default function Signup() {
  const toast = useToast();
    const [show ,setShow] =useState(false)
    const [name , setname] = useState("");
    const [email , setemail] = useState("");
    const [password , setpassword] = useState("");
    const [Confirmpassword , setConfirmpassword] = useState()
    const [pic , setpic] = useState("");
    const [isLoding ,setLoading] = useState(false)
    const history  = useHistory();
    const HandleShow = ()=>{
        setShow(!show);
    }
    const submitHandler = async () => {
      setLoading(true);
      if (!name || !email || !password) {
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
   
      console.log(name, email, password, pic);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/user",
          {
            name,
            email,
            password,
            pic,
          },
          config
        );
        console.log(data);
        toast({
          title: "Registration Successful",
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
    const postDetails = (pic) => {
      setLoading(true);
    
      if (!pic) {
        setLoading(false);
        return;
      }
    
      if (pic.type === 'image/png' || pic.type === 'image/jpeg') {
        const data = new FormData();
        data.append('file', pic);
        data.append('upload_preset', 'durga-Texts');
        data.append('cloud_name', 'dl6olo7ex');
    
        fetch('https://api.cloudinary.com/v1_1/dl6olo7ex/image/upload', {
          method: 'POST',
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setpic(data.url.toString());
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
          });
      } else {
        setLoading(false);
        toast({
          title: 'Please select an image.',
          description: 'Please let others see how you look.',
          status: 'warning',
          duration: 9000,
          isClosable: true,
        });
      }
      console.log(pic);
    };
    
  
  return (
    <VStack spacing={'spx'}>
        <FormControl isRequired id='first-name'>
           <FormLabel>Name</FormLabel>
           <Input
           placeholder='Enter your Name' onChange={(e)=>{
              setname(e.target.value)
           }}></Input>
        </FormControl>
        <FormControl isRequired id='email'>
           <FormLabel>Email</FormLabel>
           <Input
           placeholder='Enter your Email' onChange={(e)=>{
              setemail(e.target.value)
           }}></Input>
        </FormControl>
        <FormControl isRequired id='password'>
           <FormLabel>Password</FormLabel>
           <InputGroup>
           <Input
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
        <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}

        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={isLoding}

      >
        Sign Up
      </Button>
    </VStack>
  )
}
