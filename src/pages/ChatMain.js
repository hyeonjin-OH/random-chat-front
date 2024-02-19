import { ChatContainer } from "components/ChatContainer"
import { ChatList } from "components/ChatList"
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import moment from 'moment';
import {instance, instanceE} from 'api/axiosApi'
import {setCookie, getCookie} from 'app/cookie'
import base64 from "base-64"

function ChatMain(){

  window.history.replaceState({}, '')

  let token = getCookie("accessToken")
  let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
  let dec = base64.decode(payload)
  const uuId = JSON.parse(dec).sub
  
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

  const [lastIdx, setLastIdx] = useState(0)

useEffect(()=>{
  try{
    async function getData(){
      setAllRoom([])
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
      setAllRoom(_inputData)
    }
    getData()
    
  }catch(e){
    console.log(e.message)
  }
},[])

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
    if(room && enterChat == true){
      openRoom(room)
    }
  }, [enterChat])

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
    console.log("closeRoom")
    // 방이 닫힐 때 roomCount를 감소시킴
    setRoomCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
    setSelectedRoom(prevRooms => prevRooms.filter(room => room.roomId !== roomInfo.roomId));
  };

  // ChatList로 부터 나가는 방 정보 전달 받음
  const exitRoom = (room) => {
    setExitRoomInfo(room)
    setExitChat(true)

    async function getData(){
      const data = {
        roomKey: room.roomKey,
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
      setAllRoom(_inputData)
    }
    getData()
  }

  useEffect(() => {
    if (exitChat == true){
    setRoomCount(prevCount => prevCount - 1);
    setSelectedRoom(prevRooms => prevRooms.filter(room => room.roomId !== roomInfo.roomId));
    }
  }, [exitRoomInfo, exitChat]);


  return(
    <div className="chat-room-div">
      <div className="chat-list-tab">
        <ChatList key="chatList" getRoomInfo={getRoomInfo} allRoom={allRoom} exitRoom={exitRoom}/>
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

export { ChatMain }