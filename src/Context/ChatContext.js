import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

 const  chatContext =    createContext();

 const ChatProvider = ({children})=>{
    const [user ,setUser] = useState();
    const [selectedChat, setselectedChat] = useState(null)
    const [Chats, setChats] = useState([])
    const [notifications ,setNotifications] = useState([])
    const history = useHistory()
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo){
            history.push('/')
        }
    },[history])
    return <chatContext.Provider value={{user ,setUser ,selectedChat ,setselectedChat,Chats, setChats ,notifications ,setNotifications}}>{children}</chatContext.Provider>;
 }
 export const ChatState =  ()=>{
    return useContext(chatContext)
 }
 export default ChatProvider;