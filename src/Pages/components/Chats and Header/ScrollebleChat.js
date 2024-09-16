import React from 'react'
import ScrollbleFeed from 'react-scrollable-feed'
import { ChatState } from '../../../Context/ChatContext'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../../config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';


const ScrollebleChat = ({ messages }) => {
    const { user } = ChatState();
    console.log(messages, "inside scrollable");
    return (
      <ScrollbleFeed>
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: 'flex' }} key={m._id}>
              {console.log(m)}
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                  <div>
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                    
                  </div>
                </Tooltip>
              )}
              <span
                      style={{
                        backgroundColor: `${
                          m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                        }`,
                        marginLeft: isSameSenderMargin(messages, m, i, user._id),
                        marginTop: isSameUser(messages, m, i, user._id)
                          ? 3
                          : 10,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                      }}
                    >
                      {m.content}
                    </span>
            </div>
          ))}
      </ScrollbleFeed>
    );
  };
  
  export default ScrollebleChat;
  
  

  