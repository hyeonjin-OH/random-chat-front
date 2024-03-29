/* eslint-disable */
import 'App.css';
import 'app/globals.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import {instance, instanceE} from 'api/axiosApi'
import {useNavigate} from 'react-router-dom'
import { Button } from "~/components/ui/button"
import { Input700 } from "~/components/ui/input"
import {setCookie, getCookie} from "app/cookie"
import { Typography } from "~/components/ui/typography"
import { useToast } from "~/components/ui/use-toast"
import { Toaster } from "~/components/ui/toaster"

function ApiLogin(props){
  const openedflag= "N";
  let [apikey, setApiKey] = useState("");
  let [charactername, setCharacterName] = useState("abcde");
  const { toast } = useToast()
  let navigate = useNavigate();

  async function registryAPI(apikey, charactername) {

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
      
      // for (let i =0; i< response.data.length; i++){
      //   response.data[i] == charactername ? console.log(response.data[i]) : null
      // }
  
    // 차후에 캐릭터이름 쓸 수도 있으니 nickName은 살려둠
    const registerData = {
      id: null,
      apiKey: apikey,
      nickName: ""};
  
      await instanceE.post("/register", registerData)
        .then(onLoginSuccess);
    }catch(err){
      if (err.response && err.response.status === 401) {
        // 401 Unauthorized 에러인 경우
        toast({
          variant: "destructive",
          title: "인증이 실패했습니다. API 키를 확인해 주세요.",
          duration: 3000,
        })
      }else {
        // 기타 예외인 경우
        toast({
          variant: "destructive",
          description: "인증 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          duration: 3000,
        })
      }
    }
  }
  
  const onLoginSuccess = response => {
    // accessToken 설정
    setCookie("accessToken",response.data.accessToken);
    const navUri = "/prefer"
    navigate(navUri);
  }

  return(
    <div className="register-form">
    <div className="register-form-div">
      <Typography variant="h5">API키 </Typography>
      <Input700 type="text" style={{width:'35rem'}} defaultValue = {apikey}  onChange={(e)=>setApiKey(e.target.value)}/>
      {/* <Typography variant="h5">캐릭터명</Typography>
      <Input300 type="text" className="main-character-name" onChange={(e)=>setCharacterName(e.target.value)}/> */}
      <div className='Subtitle-blank-10'>
      <Button onClick={()=>
        registryAPI(apikey, charactername)}>로스트아크 유저 등록/로그인</Button>
      </div>
    </div>
    <div className='Subtitle-blank-40'>
    </div>
    <div className='Subtitle-blank-40' style={{display:'flex', flexDirection:'column'}}>
      <Typography variant="h2"> 💻LOSTARK API 발급 받는 법</Typography>
      <div className='Subtitle-blank-10'>
      <Typography variant="h5">1. <a href='https://developer-lostark.game.onstove.com/' target='_blank'> 👉로스트아크 API 발급 사이트👈</a> 에 접속한다.</Typography>
      <Typography variant="h5">2. STOVE ID로 로그인한다. </Typography>
      <Typography variant="h5">3. 화면 중앙에 있는 "GET ACCESS TO LOASTARK API"를 누른 후 코드를 받는다.</Typography>
      <Typography variant="h5">4. 기존 발급 유저들은 상단 "API STATUS" 버튼을 누른 후 코드를 복사한다.</Typography>
      </div>
      <div className='Subtitle-blank-20' style={{display:'flex', flexDirection:'column'}}>
      <Typography variant="inlineCode">API키의 경우, 단순 로스트아크 유저(STOVE) 확인 용이며 암호화 되어 저장됩니다.</Typography>
      {/* <Typography variant="inlineCode">캐릭터 명은 API인증을 위한 요소일 뿐 저장되지 않습니다. 유효한 캐릭터명을 입력해주세요.</Typography> */}
      </div>
    </div>
    <Toaster />
  </div>
  )
}




export {ApiLogin}