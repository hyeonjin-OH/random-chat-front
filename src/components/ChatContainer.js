import { ChattingRoom } from 'components/ChattingRoom'
import { useEffect, useState } from 'react';
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getCookie } from 'app/cookie';
import moment from 'moment';

function ChatContainer(props){
  
  const [stompClient, setStompClient] = useState(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [roomInfo, setRoomInfo] = useState({
    roomKey: '',
    roomId: 0,
    createdTime: ''
  });

  useEffect(() => {
    // Connect to WebSocket - over func will deprecated
    const socket = new SockJS("http://localhost:8080/chat");
    const stomp = Stomp.over(socket);

    setStompClient(stomp);
    console.log("props.enter : " + props.enter)
    if(props.enter == true && stomp){
      console.log("ChatContainer - AfterMatching Open")
      stomp.connect({}, () => {
        stomp.send('/pub/chat/enter', {}, 
        // ChatMessage DTO
        JSON.stringify({ 
          type: 'ENTER',
          roomKey: roomInfo.roomKey,
          sender: roomInfo.uuId,
          message: "",
          sendTime: moment().format('YYYY-MM-DDTHH:mm:sszz')}
          ));
      });
    }
    console.log("CHatContainer EXIT : " + props.exit)
    if(props.exit == true && stomp){
      exitRoom()
    }

    return () => {
      stomp.disconnect();
    };
  },[]);

  useEffect(()=>{
    setRoomInfo(props.roomInfo)
  }, [props.roomInfo])

  useEffect(()=>{
    console.log("CHatContainer EXIT")
    if(props.exit == true){
      exitRoom()
    }
  }, [props.exit])

  useEffect(() => {
    if (stompClient) {
      let headers = {Authorization: getCookie('accessToken')};

      // 구독
      stompClient.connect(headers, () => {
        stompClient.subscribe('/sub/chat/room/'+roomInfo.roomKey, (message) => {
          const newMessage = JSON.parse(message.body);
          setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        });
      });
    }
  }, [stompClient, username, roomInfo]); 

  // chatting message 전송
  const handleEnter = () => {
    if (stompClient && message && username) {
      stompClient.send('/pub/chat/message', {}, 
      // ChatMessage DTO
      JSON.stringify({ 
        type: 'TALK',
        roomKey: roomInfo.roomKey,
        sender: username,
        message: message,
        sendTime: moment().format('YYYY-MM-DDTHH:mm:sszz')}));

      // Input칸 초기화
      setMessage("");
    }
  };


  const exitRoom = () => {
    if (stompClient) {
      stompClient.send('/pub/chat/exit', {}, 
      // ChatMessage DTO
      JSON.stringify({ 
        type: 'LEAVE',
        roomKey: roomInfo.roomKey,
        sender: roomInfo.uuId,
        message: "",
        sendTime: moment().format('YYYY-MM-DDTHH:mm:sszz')}));

      stompClient.disconnect();
    }
  }

  // ChatList에서 대화방 선택하여 오픈 후 ChattingRoom에서 과거 대화내용 가져옴
  const getPastChat=(chat) =>{
    setChatHistory((prevHistory) => [...prevHistory, chat]);
  }

  return(
    <>
    <ChattingRoom
      roomInfo={roomInfo}
      chatHistory={chatHistory}
      username={username}
      setUsername={setUsername}
      message={message}
      setMessage={setMessage}
      handleEnter={handleEnter}
      setChatHistory={setChatHistory}
      getPastChat={getPastChat}
      closeRoom={props.closeRoom}
      exitRoom={exitRoom}
    />
  </>
  )
}

export {ChatContainer}