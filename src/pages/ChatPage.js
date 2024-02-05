import { ChatContainer } from "components/ChatContainer"
import { ChatList } from "components/ChatList"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import {instance, instanceE} from 'api/axiosApi'
import {setCookie, getCookie} from 'app/cookie'

function ChatPage(props){

  const location = useLocation();
  let [roomKey, setRoomKey] = useState([]);
  const getRoomKey = roomKey =>{
    setRoomKey(roomKey);
  }

  useEffect(() => {
    console.log("ChatPage In")
    if (props.roomKey !== null){
      console.log(props)
    }
  }, [props.roomKey]);


  return(
    <div className="chat-room-div">
      <div className="chat-list-tab">
        <ChatList getRoomKey={getRoomKey} />
      </div>
      <div className="chat-text-box">
        <ChatContainer />
        <ChatContainer />
      </div>
    </div>
  )
}

export {ChatPage}