import { useEffect, useState, useRef } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Typography } from "~/components/ui/typography"
import { PiTimerLight } from "react-icons/pi";
import { Progress } from "~/components/ui/progress"


function WaitingModal(props){
  const [progress, setProgress] = useState(10)


  useEffect(() => {
    let timer;
    if (props.isOpen && progress < 100) {
      timer = setInterval(() => {
      // 1초에 3%씩 증가
      setProgress(prevProgress => Math.min(prevProgress + 3, 100));
    }, 1000);
  }
    return () => clearInterval(timer);
  }, [props.isOpen,progress]);


  return(
    <div className="chat-matching-modal-div" style={{display:props.isOpen?"flex":"none"}} >
      <div className="chat-matching-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="right-align-close"><IoIosCloseCircleOutline onClick={props.closeModal} /></div>
        <div className="chat-matching-info-align">
          <Typography variant="h4">매칭 중입니다.</Typography>
          <Typography variant="h3"><br/><PiTimerLight /></Typography> 
          <Progress value={progress} className="w-[60%]" />
          <Typography variant="p">30초가 경과해도 매칭이 잡히지 않으면<br/>
          다시 매칭하거나 매칭 조건을 낮출 수 있습니다.</Typography>
          
        </div>

      </div>
    </div>
  
  )
}
export {WaitingModal}