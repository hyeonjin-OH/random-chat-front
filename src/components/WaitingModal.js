import React, { useState } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { PiTimerLight } from "react-icons/pi";


function WaitingModal(props){


  const [waitingUsers, setWaitingUsers] = useState([]);

  return(
    <div className="chat-matching-modal-div" style={{display:props.isOpen?"flex":"none"}}>
      <div className="chat-matching-modal-window">
        <div className="right-align-close"><IoIosCloseCircleOutline onClick={props.closeModal} /></div>
        <div className="chat-matching-info-align">
          <Typography variant="h4">매칭 중입니다.</Typography>
          <Typography variant="h3"><br/><PiTimerLight /></Typography> 
          <Typography variant="p">30초가 경과해도 잡히지 않으면<br/>
          다시 매칭하거나 매칭 조건을 낮출 수 있습니다.</Typography>
          
        </div>

      </div>
    </div>
  
  )
}
export {WaitingModal}