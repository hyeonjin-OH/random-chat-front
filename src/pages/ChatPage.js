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
    console.log(roomInfo)
  }

  useEffect(() => {
    // .chat-text-box의 높이를 가져옴
    const textBoxHeight = document.querySelector('.chat-text-box').clientHeight;
    const textBoxWidth = document.querySelector('.chat-text-box').clientWidth;
    
    let twidth = textBoxWidth
    // 위아래 margin때문에 -20
    let theight = textBoxHeight-20
    if(textBoxWidth >1050){
      twidth = `${(textBoxWidth - 20) / roomCount}px`;
    }
    else{
      theight = `${(textBoxHeight - 20) / roomCount}px`;
    }
    setContainerHeight(theight);
    setContainerWidth(twidth);
  }, [roomCount]);


  return(
    <div className="chat-room-div">
      <div className="chat-list-tab">
        <ChatList key="chatList" getRoomInfo={getRoomInfo} />
      </div>
      <div className= "chat-text-box">
        {roomCount !== 0? (selectedRoom.map((r, idx)=>(
          <div className="chat-container-div"  style={{ height: containerHeight , width: containerWidth}}>
            <ChatContainer key={idx} roomInfo={r}/>
            </div>
            ))) : null
        }
      </div>
    </div>
  )
}

export {ChatPage}