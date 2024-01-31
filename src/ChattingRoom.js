import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ChatList } from './ChatList'
import axios from 'axios';
import './App.css';
import { Input } from "~/components/ui/input"



function ChattingRoom(props){

  const defaultURL = "http://localhost:8080";
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
      {/* <div >
        유저이름 : 
        <Input
          style={{flex : 1}}
          value={props.username}
          onChange={e=>props.setUsername(e.target.value)}
        />
      </div>
      <div className={"contents"}>
        {props.contents.map((message) => (
          <div> {message.username} : {message.content} </div>
        ))}
      </div>
      <div>
        <Input.Search
          placeholder="input your messages..."
          value={props.message}
          onChange={(e) => props.setMessage(e.target.value)}
          onSearch={(value) => props.handleEnter(props.username, value)}
          enterButton={"Enter"}
        />
      </div> */}
    </div>
    </div>

    </div>
  )

}

export default ChattingRoom;