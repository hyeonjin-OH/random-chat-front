import { ChatContainer } from "components/ChatContainer"
import { ChatList } from "components/ChatList"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';

function ChatPage(){

  const location = useLocation();
  const [roomInfo, setRoomInfo] = useState({
    roomKey: '',
    roomId: 0,
    createdTime: ''
  });
  const [roomCount, setRoomCount] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState([{
    roomKey: '',
    roomId: 0,
    createdTime: ''
  }])

  // ChatList에서 선택한 채팅방 정보 가져와서 셋팅
  const getRoomInfo = (key, id, time) =>{
    const tmp = {roomKey: key, roomId: id, createdTime: time}
    setRoomInfo(tmp)

    if(roomCount === 0){
      setSelectedRoom([tmp])
      setRoomCount(roomCount+1)
    }
    else{
      let s = 0
      selectedRoom.map((r, idx) => {
        if (r.roomKey === key){
          s += 1
        }
      })

      if (s === 0 ){
        setSelectedRoom(selectedRoom.concat(tmp))
        setRoomCount(roomCount+1)
      }
    }
    console.log(roomInfo)
  }

  return(
    <div className="chat-room-div">
      <div className="chat-list-tab">
        <ChatList getRoomInfo={getRoomInfo} />
      </div>
      <div className="chat-text-box">
        {roomCount !== 0? (selectedRoom.map((r, idx)=>(
          <ChatContainer key={idx} roomInfo={r}/>
        ))) : null
        }
      </div>
    </div>
  )
}

export {ChatPage}