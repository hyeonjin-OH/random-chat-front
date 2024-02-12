import {PreferenceForm} from "components/PreferenceForm";
import { Button } from "~/components/ui/button"
import * as React from "react"
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "~/components/ui/use-toast.js"
import {setCookie, getCookie} from 'app/cookie'
import {instance, instanceE} from "api/axiosApi"
import { WaitingModal } from "components/WaitingModal";

function WaitingRoom(props){

  const params = useParams();
  const userId = params.id;
  const openedFlag = "Y";
  let navigate = useNavigate();
  const {toast} = useToast();
  const [progressBar, setProgressBar] = React.useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    instance(getCookie("accessToken"))
    .get("api/v1/waitingroom")
    .then(function(response){
      console.log(response)
    })
  }, []);

  const openModal = () => {
    setIsModalOpen(true)
    console.log("openModal")
  }
  const closeModal = () => setIsModalOpen(false);


  return(
    <>
    <PreferenceForm userid={userId} openedFlag={openedFlag}/>
      <Button onClick={()=>{ openModal();
      // navigate("/api/v1/chattingroom")
      }}>랜덤 매칭 시작</Button> 
    {isModalOpen && <WaitingModal isOpen={isModalOpen} closeModal={closeModal} />}
    <div className="Subtitle-blank-20">
    </div>
    </>
  )
}

export default WaitingRoom;