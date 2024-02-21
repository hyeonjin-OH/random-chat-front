import { ChattingRoom } from 'components/ChattingRoom'
import { useEffect, useState, useRef } from 'react';
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getCookie } from 'app/cookie';
import moment from 'moment';
import base64 from "base-64"
import {instance} from 'api/axiosApi'

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

  let token = getCookie("accessToken")
  let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
  let dec = base64.decode(payload)
  const uuId = JSON.parse(dec).sub


  useEffect(() => {

    // Connect to WebSocket - over func will deprecated
    const socket = new SockJS("http://localhost:8080/chat");
    const stomp = Stomp.over(socket);

    setStompClient(stomp);

    return () => {        
      if (stomp && stomp.connected) {
        console.log("stomp check")
        stomp.disconnect();
      }
    };
  
  },[]);

  useEffect(()=>{
    setRoomInfo(props.roomInfo)
  }, [props.roomInfo])

  useEffect(()=>{
    
    if(props.exit == true){
      fetchData(props.exitRoomInfo.roomId)
    }
  }, [props.exit, props.exitRoomInfo])

  useEffect(() => {

    if (stompClient) {
      let headers = {Authorization: getCookie('accessToken')};

      stompClient.connect(headers, () => {

        console.log("props.enter : " + props.enter)
        if(props.enter == true && stompClient){

          stompClient.send('/pub/chat/enter', {}, 
          // ChatMessage DTO
          JSON.stringify({ 
            type: 'ENTER',
            roomKey: roomInfo.roomKey,
            sender: uuId,
            message: "",
            sendTime: moment().format('YYYY-MM-DDTHH:mm:sszz')}
          ));
        }

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
    console.log("ChatContainer exitRoom")

    if (stompClient && stompClient.connected) {
      let headers = {Authorization: getCookie('accessToken')};
      
      // Send exit message
      stompClient.send(
        '/pub/chat/exit', 
        headers, 
        JSON.stringify({ 
          type: 'LEAVE',
          roomKey: roomInfo.roomKey,
          sender: uuId,
          message: "",
          sendTime: moment().format('YYYY-MM-DDTHH:mm:sszz')
        })
      );      
    
      stompClient.disconnect();
    }
  }

  const fetchData = async(roomId) => {
    console.log("fetchData")
    await instance(getCookie("accessToken"))
    .get("api/v1/chattingroom/"+roomId)
    .then(function(response){
      if(response.data == null){
        return
      }
      if(response.data.senderId != "" &&  response.data.receiverId != ""){
        exitRoom()
      }
    })
    .catch(error=>{
      console.log(error.message)
    });
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