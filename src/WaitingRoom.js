import PreferenceForm from "./PreferenceForm";

function WaitingRoom(){
  return(
    <>
    <PreferenceForm/>
    <div style="margin: 30px; border: solid 0.5px;">
    </div>
    <div>
      <button>랜덤 매칭 시작</button>
    </div>

    </>
  )
}

export default WaitingRoom;