import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { ChattingRoom } from './ChattingRoom'
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { message as MessageType } from "antd";
import { Textarea } from "~/components/ui/textarea"
import Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const sockJs = new SockJS('http://localhost:8080/stomp/chat');
let stompClient = Stomp.over(sockJs)
stompClient.debug = () => {};

function ChatContainer(){

  const [stompClient, setStompClient] = useState(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS("http://localhost:8080/webSocket");
    const stomp = Stomp.over(socket);
    stomp.debug = null; // Disable debug logs
    setStompClient(stomp);

    return () => {
      // Disconnect when component unmounts
      stomp.disconnect();
    };
  }, []);

  useEffect(() => {
    if (stompClient) {
      // Subscribe to the user-specific topic
      stompClient.connect({}, () => {
        stompClient.subscribe('/sub/messages', (message) => {
          const newMessage = JSON.parse(message.body);
          setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        });
      });
    }
  }, [stompClient, username]);

  const handleEnter = () => {
    if (stompClient && message && username) {
      // Send message to the recipient
      stompClient.send('/chat/${username}', {}, JSON.stringify({ content: message }));
      setMessage("");
    }
  };

  return(
    <div >
    <ChattingRoom
      chatHistory={chatHistory}
      username={username}
      setUsername={setUsername}
      message={message}
      setMessage={setMessage}
      handleEnter={handleEnter}
    />
  </div>
  )

}

export default ChatContainer;