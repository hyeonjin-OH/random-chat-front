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
import { ChatMain } from 'pages/ChatMain';

import { ApiLogin } from 'components/ApiLogin';
import { Logout } from 'pages/Logout';


function App() {
  const openedflag= "N";
  let [userId, setUserId] = useState("");
  

  let navigate = useNavigate();


  return (
    <div className="App">

    <Menubar>
      <MenubarMenu>
        <MenubarTrigger onClick={()=>navigate("/chattingroom")}>        
          <Typography variant="h4" className="logo-font">LoChat</Typography>
      </MenubarTrigger> 
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={()=>navigate("/prefer", {state:{openedFlag:"N"}})}>내 정보</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
        <MenubarTrigger>채팅방</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={()=>navigate("/waitingroom")}>새 매칭</MenubarItem>
          <MenubarItem onClick={()=>navigate("/chattingroom")}>내 채팅방</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>


      <Routes>
        <Route path="/"  element={<ChatMain />}/>
        <Route path="/login" element={
          <ApiLogin setUserId={setUserId}></ApiLogin>
        } />
      <Route path="/prefer" 
        element={<PreferenceForm openedFlag={openedflag} userId={userId} />} />
      <Route path="/waitingroom"
        element={<WaitingRoom navigate={navigate} userId={userId}/>}/>
      <Route path="/chattingroom"
        element={<ChatMain />}/>
      <Route path ="/logout" element={<Logout />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
    </div>
  );
}

export default App;
