import { Button } from "~/components/ui/button"
import 'App.css';
import { useEffect, useState } from 'react';
import { ImExit } from "react-icons/im";
import base64 from "base-64"
import {setCookie, getCookie} from 'app/cookie'

import 'moment/locale/ko';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCellP,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"


function ChatList(props){  const [roomCount, setRoomCount] = useState(0)
  const [allRoom, setAllRoom] = useState([])

  const [lastIdx, setLastIdx] = useState(0)

  let token = getCookie("accessToken")
  let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
  let dec = base64.decode(payload)
  const uuId = JSON.parse(dec).sub

  useEffect(()=>{
    console.log("ChatList2 props.allRoom")
    try{
      setAllRoom(props.allRoom)
      setLastIdx(props.lastIdx)
    }catch(e){
      console.log(e.message)
    }
  },[props.allRoom])

  const clickHandler=(idx, e)=>{
    props.getRoomInfo(allRoom[idx].roomKey, allRoom[idx].roomId, allRoom[idx].createdTime)
  }


  // 부모 ChatPage로 나가는 방 정보 전달
  const exitHandler=(idx, e)=>{
    props.getRoomInfo(allRoom[idx].roomKey, allRoom[idx].roomId, allRoom[idx].createdTime)
    const roomInfo =  {
      roomKey: allRoom[idx].roomKey,
      roomId: allRoom[idx].roomId,
      createdTime: allRoom[idx].createdTime
    };
    props.exitRoom(roomInfo)
  }

  return(
    <Table>
      <TableCaption>내 채팅방은 최대 4개이며 나간 후 재입장 불가능 </TableCaption>
      <TableCaption>기본 방이름은 개설시간입니다.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-[140px]">채팅방(개설시간)</TableHead>
          <TableHead className="text-center">마지막 대화</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lastIdx !== 0 ? allRoom.map((chat, idx) => (
          chat.createdTime !== '' &&
          <TableRow>
              <TableCell>{chat.createdTime}</TableCell>
              <TableCell>{ chat.lastMessage.length >= 20? 
                  chat.lastMessage.substring(0,20) + "...": chat.lastMessage}</TableCell>
              <TableCellP><Button size="m" variant="outline" onClick={(e)=> clickHandler(idx, e) }>
                OPEN</Button></TableCellP>
              <TableCellP>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="m" variant="outline" onClick={(e)=> exitHandler(idx, e) }>
                    <ImExit color="red" stroke="black"/></Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>채팅방 나가기</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              </TableCellP>
            </TableRow>
          )):
          null
        }
      </TableBody>
    </Table>
  )
}

export { ChatList };