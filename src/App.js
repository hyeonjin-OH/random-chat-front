/* eslint-disable */
import {Navbar} from 'react-bootstrap'
import './App.css';
import './app/globals.css'
import { useState } from 'react';
import axios from 'axios';
import {Routes, Route, Link, useParams, useNavigate} from 'react-router-dom'
import {PreferenceForm} from './PreferenceForm';
import WaitingRoom from './WaitingRoom';
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "~/components/ui/menubar"
import { Toaster } from './~/components/ui/toaster';


function App() {
  const testApiKey= "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwOTM3NjQifQ.ZAjjmyUsYd_bJQUZq0hBOhEP1EShL_-FtN0LVI2Wimy-b0Bul_KANOiAbo0vN-oUmYuGY3VGmCrvQox101Ap7z5d7WQUEvOTwNyIvsb8wAOwb3NQegyHAkNYwluVgM1noon9QpkdqWngkxZF2a8QyIm1yP3ET5DXLmFKsYvlMm556loGWgWwCYIXBy6kLxyunv1-q7kkZeTtcHsYBIs7BhfF2QwHzwTaMWMaPSrV8UZRPJ38_2Q4Wf8n6nhY9xadZv5rBaoGYQstjEa-CPXPKbD2JWgv3WCERMGDB15X_kfnSUMSYm-9OR7nfrBQ-g9tVBX6UyFCfHnxh-GXS1FTtw";
  const openedflag= " N";
  let [apikey, setApiKey] = useState("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwOTM3NjQifQ.ZAjjmyUsYd_bJQUZq0hBOhEP1EShL_-FtN0LVI2Wimy-b0Bul_KANOiAbo0vN-oUmYuGY3VGmCrvQox101Ap7z5d7WQUEvOTwNyIvsb8wAOwb3NQegyHAkNYwluVgM1noon9QpkdqWngkxZF2a8QyIm1yP3ET5DXLmFKsYvlMm556loGWgWwCYIXBy6kLxyunv1-q7kkZeTtcHsYBIs7BhfF2QwHzwTaMWMaPSrV8UZRPJ38_2Q4Wf8n6nhY9xadZv5rBaoGYQstjEa-CPXPKbD2JWgv3WCERMGDB15X_kfnSUMSYm-9OR7nfrBQ-g9tVBX6UyFCfHnxh-GXS1FTtw");
  let [userid, setUserId] = useState(0);
  let [charactername, setCharacterName] = useState("");
  let [restext, setResText] = useState("-");
  const defaultURL = "http://localhost:8080/";

  let navigate = useNavigate();


  return (
    <div className="App">

    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>내 정보</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>선호 매칭 수정</MenubarItem>
        </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
        <MenubarTrigger>채팅방</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>매칭 대기 화면</MenubarItem>
          <MenubarItem>내 채팅방</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>


      <Routes>
        <Route path="/" element={
          <ApiLogin setApiKey = {setApiKey} apikey={apikey} charactername={charactername} setCharacterName={setCharacterName}
        restext={restext} setResText={setResText} navigate={navigate} setUserId={setUserId}></ApiLogin>
        } />
      <Route path="/api/v1/prefer/:id" 
        element={<PreferenceForm openedFlag={openedflag} />} />
       <Route path="/api/v1/waitingroom/:id"
        element={<WaitingRoom navigate={navigate} userid={userid}/>}/>
       <Route path="/api/v1/chatroom"
        element={<div>

       </div>} />
    </Routes>
    <Toaster />
    </div>
  );
}

function ApiLogin(props){
  return(
    <>
    <div className="register-form">
      <Label>API키 </Label>
      <Input type="text" className = "api-key"  defaultValue = {props.apikey}
        onChange={(e)=>props.setApiKey(e.target.value)}/>
      <Label>등록 캐릭터명</Label>
      <Input type="text" className="main-character-name"
        onChange={(e)=>props.setCharacterName(e.target.value)}/>
      <Button variant="secondary"
      onClick={()=>registryAPI(props.apikey, props.charactername, props.navigate, props.setUserId)}>로스트아크 유저 등록</Button>
    </div>
    <div>
      <span> {props.restext} </span>
    </div>
  </>
  )
}


async function registryAPI(apikey, charactername, navigate, setUserId) {
  const defaultURL = "http://localhost:8080";

  var authApiKey = "bearer " + apikey;
  var apiUrl = "https://developer-lostark.game.onstove.com/characters/"+charactername+"/siblings"

  try{
    const response = await axios.get(
      apiUrl,
      {
        headers : {
          Accept : 'application/json',
          'authorization' : authApiKey,
        },
      });

    if (response == null){
      return Promise.reject(new Error('존재하지 않는 캐릭터명입니다.'));
    }
    
    for (let i =0; i< response.data.length; i++){
      response.data[i] == charactername ? console.log(response.data[i]) : null
    }

  const registerData = {
    id: null,
    apiKey: apikey,
    nickName: charactername,
    mainCharacter: charactername
  };

  const response2 = await axios.post(
    defaultURL+"/api/v1/register",registerData);
  
  setUserId(response2.data);

  const redirUrl = defaultURL+"/api/v1/prefer/"+response2.data;


  //const response3 = await axios.get(redirUrl);
  navigate("/api/v1/prefer/"+response2.data);
  //console.log("/api/v1/prefer/{userId} 응답 : " + response3)

  }catch(err){
    console.log("err: "+err)
  }
}

export default App;
