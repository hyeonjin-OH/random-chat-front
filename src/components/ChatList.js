import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import 'App.css';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {instance, instanceE} from 'api/axiosApi'
import {setCookie, getCookie} from 'app/cookie'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import 'moment/locale/ko';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { ChatContainer } from "./ChatContainer";
import { ChatPage } from "pages/ChatPage";


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

  const [selectedRow, setSelectedRow] = useState(-1);

   useEffect(()=>{
     try{
      async function getData(){
        let res = await instance(getCookie("accessToken")).get("api/v1/chattingroom")
        const _inputData = await res.data.map((r)=>(
          setLastIdx(lastIdx+1),
          {
            idx: lastIdx,
            createdTime: moment(r.createdTime).format('YYYY-MM-DD HH:mm:ss'),
            lastMessage: r.lastMessage,
            roomId: r.roomId,
            roomKey: r.roomKey
          })
        )
        setInputData(inputData.concat(_inputData))
        console.log("inputData ====")
        console.log(inputData)
      }
      getData()
      
    }catch(e){
      console.log(e.message)
    }
  },[location])

  const clickHandler=(idx, e)=>{
    console.log("CLICK")
    console.log(e.target)
    console.log(inputData[idx].roomKey)
    //props.getRoomKey(roomKey)
  }

  return(
    <Table>
      <TableCaption>내 채팅방 (최대 4개) </TableCaption>
      <TableCaption>채팅 나간 후 재입장 불가능 </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-[170px]">채팅방(개설시간)</TableHead>
          <TableHead className="text-center">마지막 대화</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lastIdx !== 0 ? inputData.map((chat, idx) => (
          chat.createdTime !== '' &&
            <TableRow key={idx} data-item={chat} onClick={(e)=> clickHandler(idx, e) }>
              <TableCell>{chat.createdTime}</TableCell>
              <TableCell>{chat.lastMessage}</TableCell>
            </TableRow>
          )):
          null
        }
      </TableBody>
    </Table>
  )
}

export { ChatList };