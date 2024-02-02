/* eslint-disable */
import './App.css';
import './app/globals.css'
import { useEffect, useState } from 'react';
import {Routes, Route, Link, useParams, useNavigate} from 'react-router-dom'
import {PreferenceForm} from 'pages/PreferenceForm';
import WaitingRoom from 'pages/WaitingRoom';
import { Typography } from "~/components/ui/typography"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarLabel,
} from "~/components/ui/menubar"
import { Toaster } from './~/components/ui/toaster';
import { ChatPage } from 'pages/ChatPage';
import { ApiLogin } from 'components/ApiLogin';


function App() {
  const openedflag= "N";
  let [userId, setUserId] = useState("");
  let [apikey, setApiKey] = useState("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwOTM3NjQifQ.ZAjjmyUsYd_bJQUZq0hBOhEP1EShL_-FtN0LVI2Wimy-b0Bul_KANOiAbo0vN-oUmYuGY3VGmCrvQox101Ap7z5d7WQUEvOTwNyIvsb8wAOwb3NQegyHAkNYwluVgM1noon9QpkdqWngkxZF2a8QyIm1yP3ET5DXLmFKsYvlMm556loGWgWwCYIXBy6kLxyunv1-q7kkZeTtcHsYBIs7BhfF2QwHzwTaMWMaPSrV8UZRPJ38_2Q4Wf8n6nhY9xadZv5rBaoGYQstjEa-CPXPKbD2JWgv3WCERMGDB15X_kfnSUMSYm-9OR7nfrBQ-g9tVBX6UyFCfHnxh-GXS1FTtw");
  let [charactername, setCharacterName] = useState("");
  let [restext, setResText] = useState("-");

  let navigate = useNavigate();

  useEffect(()=>{
    console.log(userId)
  }, [userId])

  return (
    <div className="App">

    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>        
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
        <Route path="/" element={
          <ApiLogin setApiKey = {setApiKey} apikey={apikey} charactername={charactername} setCharacterName={setCharacterName}
        restext={restext} setResText={setResText} navigate={navigate} setUserId={setUserId}></ApiLogin>
        } />
      <Route path="/api/v1/prefer" 
        element={<PreferenceForm openedFlag={openedflag} userId={userId} />} />
      <Route path="/api/v1/waitingroom"
        element={<WaitingRoom navigate={navigate} userId={userId}/>}/>
      <Route path="/api/v1/chattingroom"
        element={<ChatPage />}/>
    </Routes>
    <Toaster />
    </div>
  );
}

// function ApiLogin(props){
//   return(
//     <>
//     <div className="register-form">
//       <Label>API키 </Label>
//       <Input type="text" className = "api-key"  defaultValue = {props.apikey}
//         onChange={(e)=>props.setApiKey(e.target.value)}/>
//       <Label>등록 캐릭터명</Label>
//       <Input type="text" className="main-character-name"
//         onChange={(e)=>props.setCharacterName(e.target.value)}/>
//       <Button variant="secondary"
//       onClick={()=>registryAPI(props.apikey, props.charactername, props.navigate, props.setUserId)}>로스트아크 유저 등록</Button>
//     </div>
//     <div>
//       <span> {props.restext} </span>
//     </div>
//   </>
//   )
// }


// async function registryAPI(apikey, charactername, navigate, setUserId) {
//   const defaultURL = "http://localhost:8080";

//   var authApiKey = "bearer " + apikey;
//   var apiUrl = "https://developer-lostark.game.onstove.com/characters/"+charactername+"/siblings"

//   try{
//     const response = await axios.get(
//       apiUrl,
//       {
//         headers : {
//           Accept : 'application/json',
//           'authorization' : authApiKey,
//         },
//       });

//     if (response == null){
//       return Promise.reject(new Error('존재하지 않는 캐릭터명입니다.'));
//     }
    
//     for (let i =0; i< response.data.length; i++){
//       response.data[i] == charactername ? console.log(response.data[i]) : null
//     }

//   const registerData = {
//     id: null,
//     apiKey: apikey,
//     nickName: charactername,
//     mainCharacter: charactername
//   };

//     await axios.post("api/v1/register",registerData)
//       .then(response => {
//         console.log(response.data)
//         Session.set("apikey", response.data.apiKey)
//         Session.set("userId", response.data.uuId)
//         localStorage.setItem("apikey", response.data.apiKey)
//         localStorage.setItem("userId", response.data.uuId)
//         axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.apiKey}`;

//         setUserId(response.data.uuId)
//         const navUri = "/api/v1/prefer"
//         navigate(navUri);
//       }
//     );
//   }catch(err){
//     console.log("err: "+err)
//   }
// }


export default App;
