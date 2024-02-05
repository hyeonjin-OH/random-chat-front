import { ChattingRoom } from 'components/ChattingRoom'
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { message as MessageType } from "antd";
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getCookie } from 'app/cookie';

function ChatContainer(props){

  const [stompClient, setStompClient] = useState(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [roomKey, setRoomKey] = useState("");


  useEffect(() => {
    console.log("ChatContainer In")
    console.log(props)
    setRoomKey(props.roomKey)

    // Connect to WebSocket - over func will deprecated
    const socket = new SockJS("http://localhost:8080/chat");
    const stomp = Stomp.over(socket);

    // const stomp = Stomp.client("ws://localhost:8080/chat");
    setStompClient(stomp);

    return () => {
      // Disconnect when component unmounts
      stomp.disconnect();
    };
  }, []);

  useEffect(() => {
    if (stompClient) {
      let headers = {Authorization: getCookie('accessToken')};
      // Subscribe to the user-specific topic
      stompClient.connect(headers, () => {
        stompClient.subscribe('/sub/messages}', (message) => {
          console.log("subscribe:"+ message.body)
          const newMessage = JSON.parse(message.body);
          setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        });
      });
    }
  }, [stompClient, username]);

  const handleEnter = () => {
    console.log("HandleEnter")
    console.log(stompClient)
    console.log(message)
    console.log(username)
    if (stompClient && message && username) {
      stompClient.send('/chat', {}, JSON.stringify({ content: message }));
      setMessage("");
    }
  };


  return(
    <>
    <ChattingRoom
      chatHistory={chatHistory}
      username={username}
      setUsername={setUsername}
      message={message}
      setMessage={setMessage}
      handleEnter={handleEnter}
    />
  </>
  )

}

export {ChatContainer}