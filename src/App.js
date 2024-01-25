/* eslint-disable */
import {Navbar} from 'react-bootstrap'
import './App.css';
import './app/globals.css'
import { useState } from 'react';
import axios from 'axios';
import {Routes, Route, Link, useParams, useNavigate} from 'react-router-dom'
import PreferenceForm from './PreferenceForm';
import WaitingRoom from './WaitingRoom';
import { Button } from "~/components/ui/button"



function App() {
  const testApiKey= "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwOTM3NjQifQ.ZAjjmyUsYd_bJQUZq0hBOhEP1EShL_-FtN0LVI2Wimy-b0Bul_KANOiAbo0vN-oUmYuGY3VGmCrvQox101Ap7z5d7WQUEvOTwNyIvsb8wAOwb3NQegyHAkNYwluVgM1noon9QpkdqWngkxZF2a8QyIm1yP3ET5DXLmFKsYvlMm556loGWgWwCYIXBy6kLxyunv1-q7kkZeTtcHsYBIs7BhfF2QwHzwTaMWMaPSrV8UZRPJ38_2Q4Wf8n6nhY9xadZv5rBaoGYQstjEa-CPXPKbD2JWgv3WCERMGDB15X_kfnSUMSYm-9OR7nfrBQ-g9tVBX6UyFCfHnxh-GXS1FTtw";
  let [apikey, setApiKey] = useState("");
  let [userid, setUserId] = useState(0);
  let [charactername, setCharacterName] = useState("");
  let [restext, setResText] = useState("-");
  const defaultURL = "http://localhost:8080/";

  let navigate = useNavigate();


  return (
    <div className="App">

      <Routes>
        <Route path="/" element={
          <ApiLogin setApiKey = {setApiKey} apikey={apikey} charactername={charactername} setCharacterName={setCharacterName}
        restext={restext} setResText={setResText} navigate={navigate} setUserId={setUserId}></ApiLogin>
        } />

      <Route path="/api/v1/prefer/:id" 
        element={<PreferenceForm/>} />
       <Route path="/api/v1/waitingroom"
        element={<WaitingRoom navigate={navigate} userid={userid}/>}/>
       <Route path="/api/v1/chatroom"
        element={<div>

       </div>} />
    </Routes>

    </div>
  );
}

function ApiLogin(props){
  return(
    <>
    <div className="register-form">
      <span>API키 </span>
      <input type="text" className = "api-key" 
        onChange={(e)=>props.setApiKey(e.target.value)}/>
      <span>등록 캐릭터명</span>
      <input type="text" className="main-character-name"
        onChange={(e)=>props.setCharacterName(e.target.value)}/>
      <button className="register-apikey" 
      onClick={()=>registryAPI(props.apikey, props.charactername, props.navigate, props.setUserId)}>로스트아크 유저 등록</button>
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
  console.log(redirUrl)
  const response3 = await axios.get(redirUrl);
  navigate("/api/v1/prefer/"+response2.data);

  }catch(err){
    console.log("err: "+err)
  }
}

/*
function registryAPI(apikey, charactername) {
  var authApiKey = "bearer " + apikey;
  var apiUrl = "https://developer-lostark.game.onstove.com/characters/"+charactername+"/siblings"

  console.log(authApiKey);
  console.log("apiUrl: "+ apiUrl)
  const promise = new Promise((resolve, reject)=>{
    $.ajax({
      url : apiUrl
      ,method : "get"
      ,beforeSend : function(xhr){
        xhr.setRequestHeader('accept', 'application/json');
        xhr.setRequestHeader('authorization', authApiKey);
      }
      ,success : function(data){
        
        console.log("data:" + data);
        if(data == null){
          reject("존재하지 않는 캐릭터명입니다.")
        }
        
        
        data.forEach(function(el, idx){
          if(el.CharacterName == charactername){
            setResText(JSON.stringify(data[idx]));
            resolve(data[idx])
          }
        });
      }
      ,error : function(req, status, err){
        reject("유효하지 않은 API Key 입니다.")
      }
    });
  });
  
  promise.then((value)=>{
    const promise2 = new Promise((resolve, reject)=>{
      $.ajax({
        url: defaultURL+"api/v1/register"
        ,method: "post"
        ,data:{
          id: null,
          apiKey: apikey,
          nickName: value.CharacterName,
          mainCharacter: value.CharacterName
        }
        ,datatype:"JSON"
        ,success: function(data2){
          console.log("POST 반환 데이터: " + data2);
          resolve(data2)
        }
      });
    });
    return promise2;
  })
  .then((value)=>{
    let redirUrl = defaultURL + "api/v1/prefer/"+value
    console.log("URL: "+redirUrl);
    $.ajax({
      url: redirUrl
      ,method: "get"
      ,success: function(data){
        console.log("GET 후 데이터: " + data)
        window.location.replace(":/randomchat/preferenceForm.html")
      }
      ,error: function(req){
        console.log("GET 후 에러: " + req)
      }
    })
    
  });

  promise.catch(value=>{
    setResText(value);
  });
}
*/

  // async axios.get(
  //   apiUrl,
  //   {
  //     headers : {
  //       Accept : 'application/json',
  //       'authorization' : authApiKey,
  //     },
  //   }
  // )
  // .then(response => {
  //   setResText(response)
  // });

export default App;
