export const isAccessTokenExpired = (accessToken) => {
  if (!accessToken) return false; // accessToken이 없으면 만료되지 않은 것으로 간주
  const tokenExpirationTime =
    JSON.parse(atob(accessToken.split('.')[1])).exp * 1000; // JWT payload에서 exp 필드 추출하여 초 단위로 변환
  const currentTime = Date.now(); // 현재 시간 (단위: 밀리초)
  const tenMinutes = 10 * 60 * 1000; // 10분을 밀리초로 변환
  return tokenExpirationTime - currentTime <= tenMinutes; // 만료 10분 전인지 확인
};