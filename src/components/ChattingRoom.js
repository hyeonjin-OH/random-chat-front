import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { IoIosCloseCircleOutline } from "react-icons/io";

import { useEffect, useState, useRef } from 'react';
import {instance} from 'api/axiosApi'
import {setCookie, getCookie} from 'app/cookie'
import 'App.css';
import { Input } from "~/components/ui/input"
import base64 from "base-64"
import moment from 'moment';

const ChattingRoom= (props)=> {
  
  const scrollRef = useRef()

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
    .get("api/v1/chattingroom/messages/"+roomId)
    .then(function(response){
      response.data.map((chat) => {
        props.getPastChat(chat);
      })
      
    })
    .catch(error=>{
      console.log(error.message)
    });
  }

  useEffect(() => {
    scrollToBottom();
  }, [props.chatHistory, props.getPastChat]);

  const scrollToBottom = () => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  };

  const activeEnter = (e) => {
    if(e.key === "Enter") {
      props.setUsername(uuId)
      props.handleEnter()
    }
  }

  const setMessage = (data) => {
    if( data.sender === uuId ) {
      if(data.type ==='ENTER' || data.type ==='LEAVE'){
        return(
          <div className='chat-message-show-area-text my-chat'>
            <div className="chat-message-text-div-inform-me">
              <span className ='chat-message-text-me'> {data.message} </span>
            </div>
            <span className='chat-message-text-time'>{moment(data.sendTime).format('MM.DD HH:mm')}</span>
          </div>
          )
      }
      else{
        return(
          <div className='chat-message-show-area-text my-chat'>
            <div className="chat-message-text-div-me">
              <span className ='chat-message-text-me'> {data.message} </span>
            </div>
            <span className='chat-message-text-time'>{moment(data.sendTime).format('MM.DD HH:mm')}</span>
          </div>
          )
      }
      
    } else {
      if(data.type ==='ENTER' || data.type ==='LEAVE'){
        return(
          <div className='chat-message-show-area-text other-chat'>
            <div className="chat-message-text-div-inform-other">
              <span className ='chat-message-text-other'> {data.message} </span>
            </div>
            <span className='chat-message-text-time'>{moment(data.sendTime).format('MM.DD HH:mm')}</span>
          </div>
          )
      }
      else{
        return(
          <div className='chat-message-show-area-text other-chat'>
            <div className="chat-message-text-div-other">
              <span className ='chat-message-text-other'> {data.message} </span>
            </div>
            <span className='chat-message-text-time'>{moment(data.sendTime).format('MM.DD HH:mm')}</span>
        </div>
        )
      }
    }
  }

  const closeRoom = ()=>{
    props.closeRoom(props.roomInfo)
  }

  return(
    <>
    <div className="right-align-close"><IoIosCloseCircleOutline onClick={closeRoom} /></div>
      <div>
        <Typography variant="h3"> 채팅방  [{props.roomInfo.createdTime} 개설]</Typography>
      </div>
      <div className="Subtitle-blank-20"></div>
      <div className="chat-message-show-area">
        <div className="chat-message-text-area" ref={scrollRef}>
        {props.chatHistory && props.chatHistory.map((msg, index) =>
        setMessage(msg))}
        </div>
      </div>
      <div className= "chat-message-input-area">
        <Input
          value={props.message}
          onChange={(e) => props.setMessage(e.target.value)}
          onKeyPress={activeEnter}
        />
        <Button type="primary" onClick={props.handleEnter}>
          전송
        </Button>
      </div>
    </>
  )

}

export {ChattingRoom}