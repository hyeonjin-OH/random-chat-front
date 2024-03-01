/* eslint-disable */
import './App.css';
import './app/globals.css'
import { useEffect, useState } from 'react';
import {Routes, Route, useNavigate, Link} from 'react-router-dom'
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
  let navigate = useNavigate();

  return (
    <div className="App">

    <Menubar>
      <MenubarMenu>
        <MenubarTrigger onClick={()=>window.location.href="/chattingroom"}>        
          <Typography variant="h4" className="logo-font">LoChat</Typography>
      </MenubarTrigger> 
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={()=>navigate("/prefer", {state:{openedFlag:"N"}})}>내 정보</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
        <MenubarTrigger>채팅방</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={()=>window.location.href="/waitingroom"}>새 매칭</MenubarItem>
          <MenubarItem onClick={()=>window.location.href="/chattingroom"}>내 채팅방</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>


      <Routes>
        <Route path="/"  element={<ChatMain />}/>
        <Route path="/login" element={ <ApiLogin />
        } />
      <Route path="/prefer" 
        element={<PreferenceForm openedFlag={openedflag}/>} />
      <Route path="/waitingroom" element={<WaitingRoom /> }/>
      <Route path="/chattingroom" element={<ChatMain />}/>
      <Route path ="/logout" element={<Logout />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
    </div>
  );
}

export default App;
