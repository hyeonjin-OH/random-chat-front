import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { ChattingRoom } from './ChattingRoom'
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Textarea } from "~/components/ui/textarea"
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';


function ChatContainer(props){

  const sockJs = new SockJS('http://localhost:8080/stomp/chat');
  let stompClient = StompJs.Stomp.over(sockJs)

  const [contents, setContents] = useState([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState("");

  useEffect(()=>{
    stompClient.connect({},()=>{
      stompClient.subscribe('/sub/room',(data)=>{
        const newMessage = JSON.parse(data.body);
        addMessage(newMessage);
      });
  });
  },[contents]);

  const handleEnter = (username, content) => {
    const newMessage = { username, content };
    stompClient.send("/hello",{},JSON.stringify(newMessage));
    setMessage("");
  };

  const addMessage = (message) =>{
    setContents(prev=>[...prev, message]);
  };

  return(
    <div >
    <ChattingRoom
      contents={contents}
      handleEnter={handleEnter}
      message={message}
      setMessage={setMessage}
      username={username}
      setUsername={setUsername}
    />
  </div>
  )

}

export default ChatContainer;