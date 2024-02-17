import { Button } from "~/components/ui/button"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import 'App.css';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {instance, instanceE} from 'api/axiosApi'
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


function ChatList(props){
  
  const [inputData, setInputData] = useState([{
    idx:-1,
    createdTime: '',
    lastMessage: '',
    roomId: -1,
    roomKey: ''
  }])

  const [lastIdx, setLastIdx] = useState(0)
  let location = useLocation();

  let token = getCookie("accessToken")
  let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
  let dec = base64.decode(payload)
  const uuId = JSON.parse(dec).sub

   useEffect(()=>{
     try{
      async function getData(){
        setInputData([])
        let res = await instance(getCookie("accessToken")).get("api/v1/chattingroom")
        const _inputData = await res.data.map((r)=>(
          setLastIdx(lastIdx+1),
          { 
            idx: lastIdx,
            createdTime: moment(r.createdTime).format('YYYY.MM.DD HH:mm'),
            lastMessage: r.lastMessage,
            roomId: r.roomId,
            roomKey: r.roomKey
          })
        )
        setInputData(_inputData)
        props.setRoomList(_inputData)
      }
      getData()
      
    }catch(e){
      console.log(e.message)
    }
  },[location])

  useEffect(()=>{
    if(props.exit){
      async function getData(){
        const data = {
          roomKey: props.exitRoomInfo.roomKey,
          uuId: uuId
        }
        let res = await instance(getCookie("accessToken"))
        .post("api/v1/chattingroom/exit", data)
        const _inputData = await res.data.map((r)=>(
          setLastIdx(lastIdx+1),
          { 
            idx: lastIdx,
            createdTime: moment(r.createdTime).format('YYYY.MM.DD HH:mm'),
            lastMessage: r.lastMessage,
            roomId: r.roomId,
            roomKey: r.roomKey
          })
        )
        setInputData(_inputData)
        props.setRoomList(_inputData)
      }
      getData()
    }
  }, [props.exit])

  const clickHandler=(idx, e)=>{
    props.getRoomInfo(inputData[idx].roomKey, inputData[idx].roomId, inputData[idx].createdTime)
  }
  
  const exitHandler=(idx, e)=>{
    props.getRoomInfo(inputData[idx].roomKey, inputData[idx].roomId, inputData[idx].createdTime)
    const roomInfo =  {
      roomKey: inputData[idx].roomKey,
      roomId: inputData[idx].roomId,
      createdTime: inputData[idx].createdTime
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
        {lastIdx !== 0 ? inputData.map((chat, idx) => (
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