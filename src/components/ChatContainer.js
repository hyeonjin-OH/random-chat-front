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
  const [stompClients, setStompClients] = useState({});  
  const [roomActive, setRoomActive] = useState(false); // 채팅방 활성화 상태
  let token = getCookie("accessToken")
  let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
  let dec = base64.decode(payload)
  const uuId = JSON.parse(dec).sub


  useEffect(() => {
    // Connect to WebSocket - over func will deprecated
    // const socket = new SockJS("http://localhost:8080/chat");
    // const stomp = Stomp.over(socket);
    
    // const roomKey = props.roomInfo.roomKey;

    // setStompClients(prevClients => ({
    //   ...prevClients,
    //   [roomKey]: stomp  
    // }));


    // return () => {        
    //   console.log("return & exit : " + props.exit)
    //   if (stomp && stomp.connected && props.exit !== true) {
    //     stomp.disconnect();
    //   }
    // };
  
  },[]);

  useEffect(()=>{
    const socket = new SockJS("http://localhost:8080/chat");
    const stomp = Stomp.over(socket);
    
    const roomKey = props.roomInfo.roomKey;

    setStompClients(prevClients => ({
      ...prevClients,
      [roomKey]: stomp  
    }));

    setRoomInfo(props.roomInfo)
  }, [props.roomInfo])


  useEffect(()=>{
    if(props.exit == true){
      fetchData(props.exitRoomInfo.roomId)
    }
  }, [props.exit, props.exitRoomInfo])

  const closeHandler = (p) => {
    console.log(p)
    console.log(stompClients)
    const roomIdToClose = p ? p.roomKey : null;
    const stompClientToClose = stompClients[roomIdToClose];

    if (stompClientToClose && stompClientToClose.connected) {
      stompClientToClose.disconnect();
    }
  };

  useEffect(() => {

    const roomKey = roomInfo.roomKey;
    const stompClient = stompClients[roomKey];
    
    if (stompClient) {
      
      let headers = {Authorization: getCookie('accessToken')};

      stompClient.connect(headers, () => {
        if(props.enter == true && stompClient){
          setTimeout(() => {
            stompClient.send('/pub/chat/enter', {}, 
              JSON.stringify({ 
                type: 'ENTER',
                roomKey: roomInfo.roomKey,
                sender: uuId,
                message: "",
                sendTime: moment().format('YYYY-MM-DDTHH:mm:sszz')
              })
            );
          }, 200);  //0.2s 후 입장 메세지 발송 - 쌍방 연결 delay때문에
        }
      
        stompClient.subscribe('/sub/chat/room/'+roomInfo.roomKey, (message) => {
          const newMessage = JSON.parse(message.body);

          setChatHistory((prevHistory) => [...prevHistory, newMessage]);
          if(newMessage === "채팅방에서 퇴장하였습니다."){
            setRoomActive(true); // 채팅방 비활성화
          }
        });
      });
    }
  }, [stompClients, username, roomInfo]); 

  // chatting message 전송
  const handleEnter = () => {
    const roomKey = roomInfo.roomKey;
    const stompClient = stompClients[roomKey];

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
    const roomKey = props.exitRoomInfo.roomKey;
    const stompClient = stompClients[roomKey];

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
    await instance(getCookie("accessToken"))
    .get("api/v1/chattingroom/"+roomId)
    .then(function(response){
      if(response.data == null){
        return
      }
      if(response.data.senderId != "" || response.data.receiverId != ""){
        // 두명 중 한 명이라도 나가면 채팅방 비활성화
        setRoomActive(true)
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
    {(
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
      closeHandler = {closeHandler}
      exitRoom={exitRoom}
      roomActive = {roomActive}
    />)}
  </>
  )
}

export {ChatContainer}