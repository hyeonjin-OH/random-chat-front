/* eslint-disable */
import './App.css';
import './app/globals.css'
import { useEffect, useState } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom'
import {PreferenceForm} from 'components/PreferenceForm';
import WaitingRoom from 'pages/WaitingRoom';
import { Typography } from "~/components/ui/typography"
import NotFound from 'pages/NotFound'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarLabel,
} from "~/components/ui/menubar"
import { ChatPage } from 'pages/ChatPage';
import { ChatMain } from 'pages/ChatMain';

import { ApiLogin } from 'components/ApiLogin';


function App() {
  const openedflag= "N";
  let [userId, setUserId] = useState("");
  let [apikey, setApiKey] = useState("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwOTM3NjQifQ.ZAjjmyUsYd_bJQUZq0hBOhEP1EShL_-FtN0LVI2Wimy-b0Bul_KANOiAbo0vN-oUmYuGY3VGmCrvQox101Ap7z5d7WQUEvOTwNyIvsb8wAOwb3NQegyHAkNYwluVgM1noon9QpkdqWngkxZF2a8QyIm1yP3ET5DXLmFKsYvlMm556loGWgWwCYIXBy6kLxyunv1-q7kkZeTtcHsYBIs7BhfF2QwHzwTaMWMaPSrV8UZRPJ38_2Q4Wf8n6nhY9xadZv5rBaoGYQstjEa-CPXPKbD2JWgv3WCERMGDB15X_kfnSUMSYm-9OR7nfrBQ-g9tVBX6UyFCfHnxh-GXS1FTtw");
  let [charactername, setCharacterName] = useState("");
  let [restext, setResText] = useState("-");

  let navigate = useNavigate();

  useEffect(()=>{
  }, [userId])

  return (
    <div className="App">

    <Menubar>
      <MenubarMenu>
        <MenubarTrigger onClick={()=>navigate("/api/v1/chattingroom")}>        
          <Typography variant="h4" className="logo-font">LoChat</Typography>
      </MenubarTrigger> 
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={()=>navigate("/api/v1/prefer", {state:{openedFlag:"N"}})}>내 정보</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
        <MenubarTrigger>채팅방</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={()=>navigate("/api/v1/waitingroom")}>새 매칭</MenubarItem>
          <MenubarItem onClick={()=>navigate("/api/v1/chattingroom")}>내 채팅방</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>


      <Routes>
        <Route path="/"  element={<ChatPage />}/>
        <Route path="/login" element={
          <ApiLogin setApiKey = {setApiKey} apikey={apikey} charactername={charactername} setCharacterName={setCharacterName}
        restext={restext} setResText={setResText} navigate={navigate} setUserId={setUserId}></ApiLogin>
        } />
      <Route path="/api/v1/prefer" 
        element={<PreferenceForm openedFlag={openedflag} userId={userId} />} />
      <Route path="/api/v1/waitingroom"
        element={<WaitingRoom navigate={navigate} userId={userId}/>}/>
      <Route path="/api/v1/chattingroom"
        element={<ChatMain />}/>
      <Route path="/*" element={<NotFound />} />
    </Routes>
    </div>
  );
}

export default App;
