import {PreferenceForm} from "components/PreferenceForm";
import { Button } from "~/components/ui/button"
import * as React from "react"
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "~/components/ui/use-toast.js"
import {setCookie, getCookie} from 'app/cookie'
import {instance, instanceE} from "api/axiosApi"
import { WaitingModal } from "components/WaitingModal";
import base64 from "base-64"
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function WaitingRoom(props){

  const params = useParams();
  const userId = params.id;
  const openedFlag = "Y";
  let navigate = useNavigate();
  const {toast} = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefer, setPrefer] = useState("");
  const [roomKey, setRoomKey] = useState("");
  const [rematchFlag, setRematchFlag] = useState(false)
  const [stompClient, setStompClient] = useState(null);
  const [preferData, setPreferData ] = useState({
      uuId: "",
      prefer: "",
      optionCount: 3,
      roomKey: "",
      time: 0
  })

  useEffect(() => {
    instance(getCookie("accessToken"))
    .get("api/v1/waitingroom")
    .then(function(response){
      console.log(response)
    })
  }, []);

  const openSocket=()=>{
    const socket = new SockJS("http://localhost:8080/match");
    const stomp = Stomp.over(socket);

    setStompClient(stomp);
  }

  useEffect(() => {
    if (stompClient) {
      let headers = {Authorization: getCookie('accessToken')};

      // 구독
      stompClient.connect(headers, () => {
        stompClient.subscribe('/sub/match/'+roomKey, (message) => {
          closeModal()
          stompClient.disconnect(); // 소켓 연결 종료
          console.log("DISCONNECT")
          console.log(message.body)
          navigate("/api/v1/chattingroom", 
                  {state: {enterChat: true, room: message.body}});

        });
      }, (error) => {
        console.error('Failed to connect to WebSocket:', error);
      });
    }
  }, [stompClient, roomKey]);


  const openModal = () => {
    setIsModalOpen(true);
    let token = getCookie("accessToken")
    let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
    let dec = base64.decode(payload)
    const uuId = JSON.parse(dec).sub

    const val = prefer.substring(0, prefer.indexOf('-'))
    const count = val.split(",").length;

    const data = {
      uuId: uuId,
      prefer: prefer,
      optionCount: count,
      roomKey: ""
    }

    setPreferData(data)
    instance(getCookie("accessToken"))
    .post("api/v1/match", data)
    .then(response =>{
      //closeModal()
      if(response.status == 200){
        closeModal()
        setRoomKey(response.data.roomKey)
        navigate("/api/v1/chattingroom",
                {state: {enterChat: true, room: response.data}})
      }
      else if(response.status == 202){
        setRoomKey(response.data.roomKey)
        setPreferData(prev => ({...prev, 
                                roomKey: response.data.roomKey, 
                                time: parseInt(response.data.time)}))
        openSocket();
      }
    }).catch(error =>{
      console.log("WaitingRoom match Error" + error.message)
    });
  }

  const rematch = () => {
    console.log(preferData)
    // PreferData에서 optionCount만 변경
    setPreferData(prev => ({...prev, optionCount: prev.optionCount - 1}));
    setRematchFlag(true)
  };

  useEffect(() => {
    if (rematchFlag==true) {
      setRematchFlag(false)

      instance(getCookie("accessToken"))
        .post("api/v1/rematch", preferData)
        .then(response => {
          if (response.status === 200) {
            closeModal();
            setRoomKey(response.data.roomKey);
            navigate("/api/v1/chattingroom", 
                    {state: {enterChat: true, room: response.data}});
          } else if (response.status === 202) {
            setRoomKey(response.data.roomKey);
            openSocket();
          }
        })
        .catch(error => {
          console.log("WaitingRoom match Error" + error.message);
        });
    }
  }, [rematchFlag, preferData]);
  
  const cancelMatch = () => {
    instance(getCookie("accessToken"))
    .post("api/v1/match/cancel", preferData)
    .then(response =>{
      closeModal()
      stompClient.disconnect();   
    }).catch(error =>{
      console.log("WaitingRoom match Error" + error.message)
    });
  }

  const closeModal = () => setIsModalOpen(false);

  const changePrefer = (p) => {
    const tmp = p.preferRaid+"-"+p.preferRole

    setPrefer(tmp)
  }


  return(
    <>
    <PreferenceForm userid={userId} openedFlag={openedFlag} changePrefer={changePrefer}/>
      <Button onClick={()=>{ openModal();
      }}>랜덤 매칭 시작</Button> 
    {isModalOpen && <WaitingModal isOpen={isModalOpen} closeModal={closeModal} rematch={rematch} cancelMatch={cancelMatch}/>}
    <div className="Subtitle-blank-20">
    </div>
    </>
  )
}

export default WaitingRoom;