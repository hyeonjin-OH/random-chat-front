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
import { Toaster } from "~/components/ui/toaster";
import { isAccessTokenExpired } from 'app/isAccessTokenExpired';

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

  const checkAccessToken = async () => {
    console.log("checkAccess")
    
    if(isAccessTokenExpired(getCookie("accessToken"))){
      
      await instance()
        .post('/reissue')
          .then(response =>{
            console.log(response.data)
            const newAccessToken = response.data.accessToken;
            setCookie("accessToken", newAccessToken)
          })
          .catch(error => {
            navigate("/login") 
          });
    }
  }

  useEffect(() => {
    let token = getCookie("accessToken")
    if(token != null){

    }else{
      return(navigate("/login"))
    }
  }, []);

  const openSocket=()=>{
    const socket = new SockJS("http://localhost:8080/match");
    const stomp = Stomp.over(socket);

    setStompClient(stomp);
  }

  useEffect(() => {
    const connectToWebSocket = async () => {
      if (stompClient) {
        await checkAccessToken(); // 액세스 토큰 확인 및 갱신
  
        let headers = { Authorization: getCookie('accessToken') };
  
        // WebSocket에 연결
        stompClient.connect(headers, () => {
          stompClient.subscribe('/sub/match/' + roomKey, (message) => {
            closeModal();
            stompClient.disconnect(); // 소켓 연결 종료
            console.log("DISCONNECT");
            navigate("/api/v1/chattingroom", { state: { enterChat: true, room: message.body } });
          });
        }, (error) => {
          console.error('Failed to connect to WebSocket:', error);
        });
      }
    };
  
    connectToWebSocket(); // WebSocket 연결
  }, [stompClient, roomKey]);


  const openModal = async() => {
    setIsModalOpen(true);

    await checkAccessToken();

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

    try {
      const response = await instance(getCookie("accessToken"))
                      .post("api/v1/match", data);
  
      if (response.status === 200) {
        closeModal();
        setRoomKey(response.data.roomKey);
        navigate("/chattingroom", { state: { enterChat: true, room: response.data } });
      } else if (response.status === 202) {
        setRoomKey(response.data.roomKey);
        setPreferData(prev => ({ ...prev, roomKey: response.data.roomKey, time: parseInt(response.data.time) }));
        openSocket();
      }
    } catch (error) {
      closeModal();
  
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          description: error.response.data,
          duration: 3000
        });
      } else {
        toast({
          variant: "destructive",
          description: error.response.data,
          duration: 3000
        });
      }
    }
  };
  /*
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
      if(error.response && error.response.status === 400){
        closeModal()

        toast(
          {
            variant: "destructive",
            description: error.response.data,
            duration: 3000,
          }
        )
      }
      else{
        closeModal()

        toast(
          {
            variant: "destructive",
            description: error.response.data,
            duration: 3000,
          }
        )
      }
    });
  }
    */
  

  const rematch = () => {
    console.log(preferData)
    // PreferData에서 optionCount만 변경
    setPreferData(prev => ({...prev, optionCount: prev.optionCount - 1}));
    setRematchFlag(true)
  };

  useEffect(() => {
    const rematch = async () => {
      if (rematchFlag) {
        setRematchFlag(false);
  
        await checkAccessToken(); // 액세스 토큰 확인 및 갱신
  
        try {
          const response = await instance(getCookie("accessToken"))
              .post("api/v1/rematch", preferData);
  
          if (response.status === 200) {
            closeModal();
            setRoomKey(response.data.roomKey);
            navigate("/api/v1/chattingroom", { state: { enterChat: true, room: response.data } });
          } else if (response.status === 202) {
            setRoomKey(response.data.roomKey);
            openSocket();
          }
        } catch (error) {
          toast({
            variant: "destructive",
            description: error.response.data,
            duration: 3000
          });
        }
      }
    };
  
    rematch();
  }, [rematchFlag, preferData]);

  
  const cancelMatch = () => {
    instance(getCookie("accessToken"))
    .post("api/v1/match/cancel", preferData)
    .then(response =>{
      closeModal()
      stompClient.disconnect();   
    }).catch(error =>{
      closeModal()
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
    <Toaster/>
    </>
  )
}

export default WaitingRoom;