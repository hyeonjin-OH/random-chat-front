import { ChatContainer } from "components/ChatContainer"
import { ChatList } from "components/ChatList"
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import moment from 'moment';

function ChatPage(){

  window.history.replaceState({}, '')
  
  const location = useLocation();
  const [ exitChat, setExitChat ] = useState(false)
  let { enterChat, room } = location.state || {};
  const [roomInfo, setRoomInfo] = useState({
    roomKey: '',
    roomId: 0,
    createdTime: ''
  });
  const [roomCount, setRoomCount] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState([])

  const [allRoom, setAllRoom] = useState([])
  const [exitRoomInfo, setExitRoomInfo] = useState()

  const [containerHeight, setContainerHeight] = useState('auto');
  const [containerWidth, setContainerWidth] = useState('auto');  

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
  }

  useEffect(()=>{
    if(room && enterChat){
      openRoom(room)
    }
  }, [])

  useEffect(() => {
    // .chat-text-box의 높이를 가져옴
    const textBoxHeight = document.querySelector('.chat-text-box').clientHeight;
    const textBoxWidth = document.querySelector('.chat-text-box').clientWidth;
    
    let twidth = textBoxWidth
    // 위아래 margin때문에 -20
    let theight = textBoxHeight-20

    let cwidth = Math.floor(twidth / 450)
    console.log("roomCount: " + roomCount + " cwidth: " + cwidth)

    if(roomCount > cwidth){
      twidth = `${(textBoxWidth - 40) / cwidth}px`;
      theight = `${(textBoxHeight - 20) / Math.ceil(roomCount/cwidth)}px`;
    }
    else{
      twidth = `${(textBoxWidth - 40) / roomCount}px`;
    }

    setContainerHeight(theight);
    setContainerWidth(twidth);

  }, [roomCount]);

  const openRoom = (roomInfo) => {
    const time = moment(roomInfo.createdTime).format('YYYY.MM.DD HH:mm')    
    
    if(typeof roomInfo === 'string'){
      const info = JSON.parse(roomInfo)
      getRoomInfo(info.roomKey, info.roomId, time)
    }
    else{
      getRoomInfo(roomInfo.roomKey, roomInfo.roomId, time)
    }
  }

  const closeRoom = (roomInfo) => {
    // 방이 닫힐 때 roomCount를 감소시킴
    setRoomCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
    setSelectedRoom(prevRooms => prevRooms.filter(room => room.roomId !== roomInfo.roomId));
  };

  // ChatList로 부터 나가는 방 정보 전달 받음
  const exitRoom = (room) => {
    setExitRoomInfo(room)
    setExitChat(true)
  }

  useEffect(() => {
    if (exitChat == true){
    setRoomCount(prevCount => prevCount - 1);
    setSelectedRoom(prevRooms => prevRooms.filter(room => room.roomId !== roomInfo.roomId));
    setAllRoom(prevRooms => prevRooms.filter(room => room.roomId !== allRoom.roomId)); 
    }
  }, [exitRoomInfo, exitChat]);


  const setRoomList = (roomInfo) =>{

    const room = roomInfo.map((r) => ({
      roomKey: r.roomKey,
      roomId: r.roomId,
      createdTime: r.createdTime
    })) 
    setAllRoom(room)

  }

  return(
    <div className="chat-room-div">
      <div className="chat-list-tab">
        <ChatList key="chatList" setRoomList={setRoomList} getRoomInfo={getRoomInfo} allRoom={allRoom}
                  exitRoom={exitRoom} exit={exitChat} exitRoomInfo ={exitRoomInfo}/>
      </div>
      <div className= "chat-text-box">
        {selectedRoom.map((r, idx) => (
          <div className="chat-container-div" style={{ height: containerHeight, width: containerWidth }}>
            <ChatContainer key={idx} roomInfo={r} closeRoom={closeRoom} enter={enterChat} 
              exit={exitChat} exitRoomInfo={exitRoomInfo} />
          </div>
        ))}
      </div>
    </div>
  )
}

export {ChatPage}