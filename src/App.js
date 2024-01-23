/* eslint-disable */

import './App.css';
import { useState } from 'react';
import axios from 'axios';
import $ from 'jquery';


function App() {
  let [apikey, setApiKey] = useState("");
  let [charactername, setCharacterName] = useState("");
  let [restext, setResText] = useState("-");
  const defaultURL = "http://localhost:8080/";

  function registryAPI() {
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
  
  return (
    <div className="App">
      <div className="register-form">
        <span>API키 </span>
        <input type="text" className = "api-key" 
          onChange={(e)=>setApiKey(e.target.value)}/>
        <span>등록 캐릭터명</span>
        <input type="text" className="main-character-name"
          onChange={(e)=>setCharacterName(e.target.value)}/>
        <button className="register-apikey" 
        apiKey={apikey} characterName={charactername} setResText={setResText}
        onClick={()=>registryAPI()}>로스트아크 유저 등록</button>
      </div>
      <div>
        <span> {restext} </span>
      </div>
    </div>
  );
}




  // await axios.get(
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
