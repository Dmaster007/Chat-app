import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  IconButton,
  Flex,
  Image,
  Center,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import { ViewIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router-dom';

const ProfileModel = ({ user ,children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    
    <>
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize={'40px'}
          fontFamily={'Work sans'}
          display={'flex'}
          justifyContent={'center'}
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
           display="flex"
           flexDir="column"
           alignItems="center"
           justifyContent="space-between"
          >
            <Image 
            borderRadius={'full'}
            boxSize={'150px'}
            src={user.pic}
            alt={user.name}
            />
            <Text
           paddingTop={4}
            fontSize={{base:'28px' , md:'30px'}}
            fontFamily={'Work sans'}
            >email : {user.email}</Text>
          
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ):<IconButton display={'flex'} icon={<ViewIcon/>} onClick={onOpen} />
      }
    </>
  );
};

export default ProfileModel;
