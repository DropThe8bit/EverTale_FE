
import { createCookieSessionStorage } from "react-router";

// 환경 변수에서 세션 시크릿 키 가져오기
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET 환경 변수가 설정되지 않았습니다.");
}

// createCookieSessionStorage 함수 호출
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  // cookie 객체: 쿠키의 동작 방식을 상세히 설정합니다.
  cookie: {
    // 브라우저에 저장될 쿠키의 이름입니다.
    name: "__session", 

    // [보안] true로 설정 시, 클라이언트 측 JavaScript (document.cookie)로 쿠키에 접근할 수 없습니다.
    // XSS 공격을 방어하는 데 매우 중요합니다.
    httpOnly: true,

    // 쿠키가 유효한 경로입니다. '/'로 설정하면 사이트 전체에서 유효합니다.
    path: "/",

    // [보안] 'lax' 또는 'strict'로 설정하여 CSRF 공격을 방어합니다. 'lax'가 일반적인 기본값입니다.
    sameSite: "lax",

    // [보안] 쿠키를 암호화하고 변조되지 않았음을 보장하는 데 사용되는 비밀 키입니다.
    secrets: [sessionSecret],

    // [보안] true로 설정 시, HTTPS 프로토콜에서만 쿠키가 전송됩니다.
    // 보통 운영(production) 환경에서만 활성화합니다.
    secure: process.env.NODE_ENV === "production",

    // 쿠키의 만료 시간(초 단위)입니다. 아래는 7일로 설정한 예시
    // 이 값을 설정하지 않으면 브라우저를 닫을 때 쿠키가 사라집니다.
    maxAge: 60 * 60 * 24 * 7, 
  },
});

// 세션 관리 함수들을 export
export { getSession, commitSession, destroySession };