import { ChatContainer } from "components/ChatContainer"
import { ChatList } from "components/ChatList"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import moment from 'moment';
import {instance, instanceE} from 'api/axiosApi'
import {setCookie,getCookie} from 'app/cookie'
import base64 from "base-64"
import { isAccessTokenExpired } from 'app/isAccessTokenExpired';

function ChatMain(){

  window.history.replaceState({}, '')

  const [uuId, setUuId] = useState(null);
  const navigate = useNavigate()
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
  const [closeRoomInfo, setCloseRoomInfo] = useState(null)
  const [exitRoomInfo, setExitRoomInfo] = useState(null)

  const [containerHeight, setContainerHeight] = useState('auto');
  const [containerWidth, setContainerWidth] = useState('auto');  

  const [lastIdx, setLastIdx] = useState(0)

  const checkAccessToken = async () => {
    
    if(isAccessTokenExpired(getCookie("accessToken"))){

      const refreshToken = localStorage.getItem("refreshToken")
      await instance(refreshToken)
        .post('/reissue')
          .then(response =>{
            const newAccessToken = response.data;
            localStorage.setItem("accessToken", newAccessToken);
            setCookie("accessToken", newAccessToken)
          })
          .catch(error => {
            navigate("/login") 
          });
    }
  }

  useEffect(()=>{
    const fetchData = async () => {
      try {
        checkAccessToken();
  
        let token = getCookie("accessToken");
        if (token != null) {
          let payload = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
          let dec = base64.decode(payload);
          const extractedUuId = JSON.parse(dec).sub;
          setUuId(extractedUuId);
        } else {
          return navigate("/login");
        }
  
        setAllRoom([]);
        let res = await instance(getCookie("accessToken")).get("api/v1/chattingroom");
  
        if (res.data.length > 0) {
          const _inputData = res.data.map((r) => ({
            idx: lastIdx + 1,
            createdTime: moment(r.createdTime).format('YYYY.MM.DD HH:mm'),
            lastMessage: r.lastMessage,
            roomId: r.roomId,
            roomKey: r.roomKey
          }));
          setAllRoom(_inputData);
        }
      } catch (e) {
        if (e.response && e.response.status === 401) {
          navigate("/login");
        }
      }
    };
  
    fetchData();

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
    setCloseRoomInfo(roomInfo)
    setRoomCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
    setSelectedRoom(prevRooms => prevRooms.filter(room => room.roomId !== roomInfo.roomId));
  };

// ChatList로 부터 나가는 방 정보 전달 받음
const exitRoom = async (room) => {
  setExitRoomInfo(room);
  setExitChat(true);

  await checkAccessToken();

  try {
    const data = {
      roomKey: room.roomKey,
      uuId: uuId
    };

    let res = await instance(getCookie("accessToken"))
              .post("api/v1/chattingroom/exit", data);
    const _inputData = res.data.map((r) => ({
      idx: lastIdx + 1,
      createdTime: moment(r.createdTime).format('YYYY.MM.DD HH:mm'),
      lastMessage: r.lastMessage,
      roomId: r.roomId,
      roomKey: r.roomKey
    }));
    setAllRoom(_inputData);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
    }
  }
};


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
            <ChatContainer key={idx} roomInfo={r} closeRoom={closeRoom} enter={enterChat} closeRoomInfo={closeRoomInfo}
              exit={exitChat} exitRoomInfo={exitRoomInfo} />
          </div>
        ))}
      </div>
    </div>
  )
}

export { ChatMain }