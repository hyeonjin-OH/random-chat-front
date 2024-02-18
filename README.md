# Project - LostArk 깐부찾기 1:1 랜덤채팅
로스트아크라는 게임 특성 상, 다인 레이드 게임을 매주 반복하다보니 깐부를 찾아서 즐겁게 게임하려고 하는 사람들이 많다. <br>
통합 디스코드가 존재해서 쉽게 구할 수는 있으나 아무래도 내 정보가 선노출이 된 후에 이야기하다 안맞으면 쉽게 바이바이~ 하는 부분이 조금 부담스러울 수도 있기에 랜덤 매칭을 통해 이야기 후, 서로 잘 맞다면 그 때 가서 본인의 정보를 공유할 수 있으면 좋지않을까? 하는 생각에서 시작되었다.

이와 비슷한 사이트가 있으나 선호 레이드에 대한 선택을 할 수 있는 것이 아닌 완전한 랜덤매칭이라 좀 더 디테일한 매칭을 위해 구성해보게 되었다.
![image](https://github.com/hyeonjin-OH/random-chat-front/assets/84078029/91aa966a-2464-4f07-931d-f210dc615240)
![image](https://github.com/hyeonjin-OH/random-chat-front/assets/84078029/4f421285-2809-47e3-bf07-d07f115ede34)
<br><br><br><br>


# Framework & Library
## React 
프론트 프레임 워크로 Vue도 있고 Angular도 있고 하지만 js기반으로 좀 더 쉽게 접할 수 있을 것 같아서 채택했다. 또한 자료도 방대한 편이라 찾기가 쉬우리라 생각했다.

## Shadcn 
React, Vue, Next 등 여러 framework에서 쓸 수 있는 컴포넌트 오픈소스 library다. bootstrap을 가장 많이 들어봤지만 shadcn의 감성(?)이 좋아서 채택했다. 다만 React 라이브러리를 제공하나 typescript가 기본이라 js로 바꿔서 쓰는데 고생 좀 했다. 

## Socket, STOMP
1대1 실시간 통신을 위해 채택한 방식이며 pub/sub방식으로 이루어진다. 
