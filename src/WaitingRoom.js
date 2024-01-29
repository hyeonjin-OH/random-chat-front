import {PreferenceForm} from "./PreferenceForm";
import { Button } from "~/components/ui/button"
import axios from 'axios';

import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "~/components/ui/use-toast.js"



function WaitingRoom(props){

  const params = useParams();
  const userId = params.id;
  const openedFlag = "Y";
  let navigate = useNavigate();
  console.log(userId)
  const defaultURL = "http://localhost:8080/";
  const {toast} = useToast();

  axios.get(defaultURL+"api/v1/waitingroom/"+userId)
  .then(function(response){
    console.log(response)
  });

  return(
    <>
    <PreferenceForm userid={userId} openedFlag={openedFlag}/>
    <div className="Subtitle-blank-20">
      <Button onClick={()=>{
        console.log("AA")
        toast({
          description: "TEST",
        })
      }}>랜덤 매칭 시작</Button>
    </div>

    </>
  )
}

export default WaitingRoom;