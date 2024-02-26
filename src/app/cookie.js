//패키지 임포트 
import { Cookies } from "react-cookie";

const cookies = new Cookies();
//쿠키에 값을 저장할때 
export const setCookie = (name, value, option) => {
    // SameSite 속성을 추가하여 쿠키를 설정
    const cookieOptions = {
      ...option,
      sameSite: 'none' // SameSite 속성 설정 (strict, lax, none 중 선택)
      , secure: true
    };
  return cookies.set(name, value, cookieOptions);
};
//쿠키에 있는 값을 꺼낼때 
export const getCookie = (name) => {
  return cookies.get(name);
};
//쿠키를 지울때 
export const removeCookie = (name) =>{
    return cookies.remove(name);
}
