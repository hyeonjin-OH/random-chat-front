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
import { Typography } from "~/components/ui/typography"

import { Toaster } from "~/components/ui/toaster";
import { isAccessTokenExpired } from 'app/isAccessTokenExpired';

function WaitingRoom(props){
  const params = useParams();
  const openedFlag = "Y";
  let navigate = useNavigate();
  const {toast} = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefer, setPrefer] = useState("");
  const [roomKey, setRoomKey] = useState("");
  const [rematchFlag, setRematchFlag] = useState(false)
  const [stompClient, setStompClient] = useState(null);
  //request preferData
  const [preferData, setPreferData ] = useState({
      uuId: "",
      prefer: "",
      optionCount: 3,
      roomKey: "",
      time: 0
  })

const [uuId, setUuId] = useState();

  const checkAccessToken = async () => {
    
    if(isAccessTokenExpired(getCookie("accessToken"))){
      
      await instance()
        .post('/reissue')
          .then(response =>{
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

  const openSocket=async (preferParam, uuId, roomKey)=>{

    const socketURL = 'http://localhost:8080/match';
    const socket = new SockJS(socketURL);
    const stomp = Stomp.over(socket);

    const headers = {
      endpoint: 'match',
      key: `${preferParam}`,
      value: `${uuId}:${roomKey}`,
      Authorization: getCookie('accessToken')
    };

    await checkAccessToken(); // 액세스 토큰 확인 및 갱신

    stomp.connect(headers, ()=>{
      stomp.subscribe('/sub/match/' + roomKey, (message) => {
        closeModal();
        const headers2 = {
          destination: '/disconnect',
        }
        stomp.disconnect({}, headers2);

        navigate("/chattingroom", 
                { state: { enterChat: true, room: message.body } });
      });
    })

    setStompClient(stomp);
  }

  const openModal = async() => {
    setIsModalOpen(true);

    await checkAccessToken();

    let token = getCookie("accessToken")
    let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
    let dec = base64.decode(payload)
    const id = JSON.parse(dec).sub
    setUuId(id)

    const val = prefer.substring(0, prefer.indexOf('-'))
    const count = val.split(",").length;

    const data = {
      uuId: id,
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

        openSocket(makePreferTag(data), id, response.data.roomKey);
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

  const rematch = () => {
    // PreferData에서 optionCount만 변경
    setPreferData(prev => ({...prev, optionCount: prev.optionCount - 1}));
    setRematchFlag(true)
  };

  useEffect(() => {
    const rematchHandler = async () => {
      if (rematchFlag) {
        setRematchFlag(false);
  
        await checkAccessToken(); // 액세스 토큰 확인 및 갱신
  
        try {
          const response = await instance(getCookie("accessToken"))
              .post("api/v1/rematch", preferData);
  
          if (response.status === 200) {
            closeModal();
            setRoomKey(response.data.roomKey);
            navigate("/chattingroom", { state: { enterChat: true, room: response.data } });
          }
          else if (response.status === 202) {
            setRoomKey(response.data.roomKey);

            openSocket(makePreferTag(preferData), uuId, response.data.roomKey);
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
  
    rematchHandler();
  }, [rematchFlag, preferData]);

  
  const cancelMatch = () => {
    instance(getCookie("accessToken"))
    .post("api/v1/match/cancel", preferData)
    .then(response =>{
      closeModal()
      const headers = {
        destination: '/disconnect',
      }
      stompClient.disconnect({}, headers);
      
    }).catch(error =>{
      closeModal()
    });
  }

  const closeModal = () => setIsModalOpen(false);

  const changePrefer = (p) => {
    const tmp = p.preferRaid+"-"+p.preferRole

    setPrefer(tmp)
  }

  const makePreferTag = (p) =>{
    let preferTag = p.optionCount + ":" + p.prefer
    return preferTag
  }

  return(
    <>
    <PreferenceForm  openedFlag={openedFlag} changePrefer={changePrefer}/>
      <Button onClick={()=>{ openModal();
      }}>랜덤 매칭 시작</Button> 
    {isModalOpen && <WaitingModal isOpen={isModalOpen} closeModal={closeModal} rematch={rematch} cancelMatch={cancelMatch}/>}
    <Typography variant="p">* 보다 빠른 매칭을 위해 레이드는 최대 3개, 포지션은 1개만 선택 가능합니다.</Typography>
      <Typography variant="p"> 단순 채팅만 하고싶다면 '모코코'만 선택 하시고 [변경 후] 매칭해주시면 됩니다.</Typography>
    <div className="Subtitle-blank-20">
    </div>
    <Toaster/>
    </>
  )
}

export default WaitingRoom;