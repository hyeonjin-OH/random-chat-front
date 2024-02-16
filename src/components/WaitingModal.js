import { useEffect, useState, useRef } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Typography } from "~/components/ui/typography"
import { PiTimerLight } from "react-icons/pi";
import { Progress } from "~/components/ui/progress"
import { Button } from "~/components/ui/button"


function WaitingModal(props){
  const [progress, setProgress] = useState(0)
  const [retry, setRetry] = useState(false)


  useEffect(() => {
    let timer;
    if (props.isOpen && progress < 100) {
      timer = setInterval(() => {
      // 1초에 5%씩 증가
      setProgress(prevProgress => Math.min(prevProgress + 5, 100));
    }, 1000);
  }
    return () => clearInterval(timer);
  }, [props.isOpen,progress]);


  useEffect(()=>{
    // 20초를 다 기다려도 매칭이 되지 않은 경우
    if(progress == 100){
      setRetry(true)
      setProgress(0)
    }
  }, [progress])

  const matchLessOptions = ()=>{
    props.rematch()
    setProgress(0)
    setRetry(false)
  }

  const matchStay = () => {
    setProgress(0)
    setRetry(false)
  }

  return(
    <div className="chat-matching-modal-div" style={{display:props.isOpen?"flex":"none"}} >
      <div className="chat-matching-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="chat-matching-info-align">
          <Typography variant="h4">매칭 중입니다.</Typography>
          <Typography variant="h3"><br/><PiTimerLight /></Typography> 
          <Progress value={progress} className="w-[60%]" />
          <Typography variant="p">20초가 경과해도 매칭이 잡히지 않으면<br/>
          계속 대기하거나 재매칭(임의 선택옵션 -1개) 할 수 있습니다.<br/>
          직접 옵션을 하향 조정 할 것이라면 취소 후 진행해주시기 바랍니다.</Typography>
        </div>
        <div className='chat-matching-modal-button-div'>
          {!retry?<Button onClick={props.cancelMatch}>매칭취소</Button>: null}
          {retry?(<><Button size="defaultMargin" variant="secondary" onClick={props.cancelMatch}>매칭취소</Button> 
                    <Button size="defaultMargin" variant="secondary" onClick={matchLessOptions}>재매칭</Button></>)
          :null}
        </div>

      </div>
    </div>
  
  )
}
export {WaitingModal}