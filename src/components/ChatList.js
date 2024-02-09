import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import 'App.css';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {instance, instanceE} from 'api/axiosApi'
import {setCookie, getCookie} from 'app/cookie'
import { ImExit } from "react-icons/im";

import 'moment/locale/ko';
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

   useEffect(()=>{
     try{
      async function getData(){
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
        setInputData(inputData.concat(_inputData))
      }
      getData()
      
    }catch(e){
      console.log(e.message)
    }
  },[location])

  const clickHandler=(idx, e)=>{
    props.getRoomInfo(inputData[idx].roomKey, inputData[idx].roomId, inputData[idx].createdTime)
  }

  return(
    <Table>
      <TableCaption>내 채팅방은 최대 4개이며 나간 후 재입장 불가능 </TableCaption>
      <TableCaption>기본 방이름은 개설시간이며 이름을 지을 수 있음</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-[140px]">채팅방(개설시간)</TableHead>
          <TableHead className="text-center">마지막 대화</TableHead>
          {/* <TableHead></TableHead>
          <TableHead></TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {lastIdx !== 0 ? inputData.map((chat, idx) => (
          chat.createdTime !== '' &&
          <TableRow>
              <TableCell>{chat.createdTime}</TableCell>
              <TableCell>{chat.lastMessage}</TableCell>
              <TableCellP><Button size="m" variant="outline" onClick={(e)=> clickHandler(idx, e) }>
                OPEN</Button></TableCellP>
              <TableCellP><Button size="m" variant="outline" onClick={(e)=> clickHandler(idx, e) }>
              <ImExit /></Button></TableCellP>
            </TableRow>
          )):
          null
        }
      </TableBody>
    </Table>
  )
}

export { ChatList };