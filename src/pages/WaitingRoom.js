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
  const [progressBar, setProgressBar] = React.useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefer, setPrefer] = useState("");
  const [roomKey, setRoomKey] = useState("");
  const [stompClient, setStompClient] = useState(null);

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
        stompClient.subscribe('/sub/matchStatus/'+roomKey, (message) => {
          console.log("WaitingRoom socket 응답 : "+ message.body)
        });
      });
    }
  }, [stompClient, roomKey]);


  const openModal = () => {
    setIsModalOpen(true);
    let token = getCookie("accessToken")
    let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
    let dec = base64.decode(payload)
    const uuId = JSON.parse(dec).sub

    const data = {
      uuId: uuId,
      prefer: prefer,
      optionCount: 3,
      roomKey: ""
    }

    instance(getCookie("accessToken"))
    .post("api/v1/match", data)
    .then(response =>{
      //closeModal()
      console.log("Match response: " + response.data)
      setRoomKey(response.data)
      if(response.status == 200){
        closeModal()
        navigate("/api/v1/chattingroom")
      }
      else if(response.status == 202){
        openSocket();
      }
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
    {isModalOpen && <WaitingModal isOpen={isModalOpen} closeModal={closeModal} />}
    <div className="Subtitle-blank-20">
    </div>
    </>
  )
}

export default WaitingRoom;