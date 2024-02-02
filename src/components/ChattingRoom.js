import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'App.css';
import { Input } from "~/components/ui/input"

const ChattingRoom= (props)=> {

  const location = useLocation();
  const userId = useParams().id;

  useEffect(() => {
    axios.get("api/v1/chattingroom")
    .then(function(response){
      console.log(response.data)

      console.log("props ====")
      console.log(props)

      props.setUsername(userId)
    })
    .catch(error=>{
      console.log("axios get error")
    });
  }, [location]);

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