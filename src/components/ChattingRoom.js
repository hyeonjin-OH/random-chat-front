import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import {instance, instanceE} from 'api/axiosApi'
import {setCookie, getCookie} from 'app/cookie'
import 'App.css';
import { Input } from "~/components/ui/input"


const ChattingRoom= (props)=> {
  
  const location = useLocation()

  // let [chatList, setChatList] = useState([]);

  // useEffect(() => {
  //   instance(getCookie("accessToken"))
  //   .get("api/v1/chattingroom")
  //   .then(function(response){
  //     console.log(response.data)
  //     setChatList(response.data)
  //   })
  //   .catch(error=>{
  //     console.log("axios get error")
  //   });
  // }, [location]);

  const activeEnter = (e) => {
    if(e.key === "Enter") {
      props.handleEnter()
    }
  }

  return(
    <>
      <div>
        <Typography variant="h3"> 채팅방 </Typography>
      </div>
      <div className="Subtitle-blank-20"></div>
      <div className="chat-message-show-area">
        {props.chatHistory && props.chatHistory.map((msg, index) => (
          <div key={index}>{msg.content}</div>
        ))}
      </div>
      <div className="chat-message-input-area">
        <Input
          value={props.message}
          onChange={(e) => props.setMessage(e.target.value)}
          onKeyDown={activeEnter}
          style={{ marginRight: "10px" }}
        />
        <Button type="primary" onClick={props.handleEnter}>
          Send
        </Button>
      </div>
    </>
  )

}

export {ChattingRoom}