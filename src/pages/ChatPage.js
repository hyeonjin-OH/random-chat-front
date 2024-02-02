import { ChatContainer } from "components/ChatContainer"
import { ChatList } from "components/ChatList"
import { useParams, useNavigate, useLocation } from "react-router-dom";


function ChatPage(){

  const location = useLocation();
  const userId = useParams().id;

  return(
    <div className="chat-room-div">
      <div className="chat-list-tab">
        <ChatList userId={userId} />
      </div>
      <div className="chat-text-box">
      <ChatContainer />
      </div>
    </div>
  )
}

export {ChatPage}