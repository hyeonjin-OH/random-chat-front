import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ChatList } from './ChatList'
import axios from 'axios';
import './App.css';
import { Input } from "~/components/ui/input"

const defaultURL = "http://localhost:8080";

const ChattingRoom= ({
  chatHistory,
  username,
  setUsername,
  message,
  setMessage,
  handleEnter,
})=> {
  const location = useLocation();
  const userId = useParams().id;

  useEffect(() => {
      axios.get(defaultURL+"/api/v1/chattingroom/" + userId)
  .then(function(response){
    console.log(response.data)
  })
  .catch(error=>{
    console.log("axios get error")
  });
}, [location]);

  return(
    <div className="chat-room-div">
    <div className="chat-list-tab">
      <ChatList userId={userId} />
    </div>
    <div className="chat-room-border"></div>
    <div className="chat-text-box">
      <div>
        <div>
          <Typography variant="h3"> 채팅방 </Typography>
        </div>
        <div className="Subtitle-blank-20"></div>
        <div className="chat-message-show-area">
          {chatHistory && chatHistory.map((msg, index) => (
            <div key={index}>{msg.content}</div>
          ))}
        </div>
        <div className="chat-message-input-area">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <Button type="primary" onClick={handleEnter}>
            Send
          </Button>
        </div>
      </div>
    </div>

    </div>
  )

}

export default ChattingRoom;