import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

function ChatList(props){

  console.log("ChatList props =====")
  console.log(props)

  return(
    <Table>
      <TableCaption>채팅방 참가자가 모두 참가 상태인 채팅방 (최대 3개)</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">채팅방(개설시간)</TableHead>
          <TableHead className="text-center">마지막 대화시간</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>목록1</TableCell>
          <TableCell>시간1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export { ChatList };