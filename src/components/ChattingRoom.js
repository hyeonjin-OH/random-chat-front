import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import {instance, instanceE} from 'api/axiosApi'
import {setCookie, getCookie} from 'app/cookie'
import 'App.css';
import { Input } from "~/components/ui/input"
import base64 from "base-64"


const ChattingRoom= (props)=> {
  
  const location = useLocation()

  let token = getCookie("accessToken")
  let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
  let dec = base64.decode(payload)
  const uuId = JSON.parse(dec).sub

  const [roomId, setRoomId] = useState(0);

  useEffect(() => {
    if (props.roomInfo && props.roomInfo.roomId) {
      // 비동기 작업을 수행하는 함수 호출
      fetchData(props.roomInfo.roomId);
    }
  }, [props.roomInfo]);
  
  const fetchData = async(roomId) => {
    await instance(getCookie("accessToken"))
    .get("api/v1/chattingroom/"+roomId)
    .then(function(response){
      console.log(response)
      response.data.map((chat) => {
        let writer = chat.sender
        let message = chat.message
        props.getPastChat(writer+" : "+message)
      })
    })
    .catch(error=>{
      console.log(error.message)
    });
  }

  const activeEnter = (e) => {
    if(e.key === "Enter") {
      props.setUsername(uuId)
      props.handleEnter()
    }
  }

  return(
    <>
      <div>
        <Typography variant="h3"> 채팅방  [{props.roomInfo.createdTime} 개설]</Typography>
      </div>
      <div className="Subtitle-blank-20"></div>
      <div className="chat-message-show-area">
        {props.chatHistory && props.chatHistory.map((msg, index) => (
          <div className="chat-message-show-area-text" key={index}> {msg} </div>
        ))}
      </div>
      <div className="chat-message-input-area">
        <Input
          value={props.message}
          onChange={(e) => props.setMessage(e.target.value)}
          onKeyDown={activeEnter}
        />
        <Button type="primary" onClick={props.handleEnter}>
          Send
        </Button>
      </div>
    </>
  )

}

export {ChattingRoom}