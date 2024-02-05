/* eslint-disable */
import 'App.css';
import 'app/globals.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import {instance, instanceE} from 'api/axiosApi'
import {Routes, Route, Link, useParams, useNavigate} from 'react-router-dom'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {setCookie, getCookie} from "app/cookie"


function ApiLogin(props){
  const openedflag= "N";
  let [userId, setUserId] = useState("");
  let [apikey, setApiKey] = useState("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwOTM3NjQifQ.ZAjjmyUsYd_bJQUZq0hBOhEP1EShL_-FtN0LVI2Wimy-b0Bul_KANOiAbo0vN-oUmYuGY3VGmCrvQox101Ap7z5d7WQUEvOTwNyIvsb8wAOwb3NQegyHAkNYwluVgM1noon9QpkdqWngkxZF2a8QyIm1yP3ET5DXLmFKsYvlMm556loGWgWwCYIXBy6kLxyunv1-q7kkZeTtcHsYBIs7BhfF2QwHzwTaMWMaPSrV8UZRPJ38_2Q4Wf8n6nhY9xadZv5rBaoGYQstjEa-CPXPKbD2JWgv3WCERMGDB15X_kfnSUMSYm-9OR7nfrBQ-g9tVBX6UyFCfHnxh-GXS1FTtw");
  let [charactername, setCharacterName] = useState("");
  let [restext, setResText] = useState("-");

  let navigate = useNavigate();

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

  var authApiKey = "bearer " + apikey;
  var apiUrl = "https://developer-lostark.game.onstove.com/characters/"+charactername+"/siblings"


const onSilentRefresh = () => {
  console.log("onSilentRefresh")
  data = {
    accessToken: localStorage.getItem("accessToken")
  }
  console.log(data)
  instance(getCookie("accessToken"))
    .post('/reissue', data)
      .then(onLoginSuccess)
      .catch(error => {
          // ... 로그인 실패 처리
      });
}

const onLoginSuccess = response => {
  console.log("onLoginSuccess")
  console.log(response.data)
  // accessToken 설정
  setCookie("accessToken",response.data.accessToken);
  setCookie("uuid",response.data.use);
  localStorage.setItem("accessToken", response.data.accessToken);

  console.log("TOKEN:"+ getCookie("accessToken"))

  // accessToken 만료하기 1분 전에 로그인 연장
  //setTimeout(onSilentRefresh, JWT_EXPIRRY_TIME - 60000);
  const navUri = "/api/v1/prefer"
  navigate(navUri);
}

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

    await instanceE.post("/register",registerData)
      .then(onLoginSuccess);
  }catch(err){
    console.log("err: "+err)
  }
}

export {ApiLogin}