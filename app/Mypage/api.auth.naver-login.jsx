import { redirect } from "react-router-dom"; // react-router-dom에서 가져옵니다.
import { getSession, commitSession, destroySession } from '~/auth/auth.js';
import { createParentProfile, loginNaverUser } from "~/api/mypage.server.js";

export async function loader({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const session = await getSession(request.headers.get("Cookie"));
  const sessionState = session.get("naver_oauth_state");

  if (!state || !sessionState || state !== sessionState) {
    throw new Response("Invalid state", { status: 401 });
  }
  session.unset("naver_oauth_state"); // 검증 후에는 바로 삭제

  try {
    const loginResult = await loginNaverUser(code, state);

    if (loginResult?.isSuccess && loginResult?.result?.accessToken) {
      const token = loginResult.result.accessToken;
      const isNewUser = loginResult.result.firstLogin;

      if (isNewUser) {
        // 새로운 사용자
        const profileResult = await createParentProfile(token);
        if (!profileResult?.isSuccess) {
          // 프로필 생성에 실패하면 에러 처리
          console.error("부모 프로필 생성 실패:", profileResult.message);
          return redirect("/mypage/login");
        }
      } else {
        console.log("기존 사용자입니다. 프로필 생성을 건너뜁니다.");
      }

      const oldSession = await getSession(request.headers.get("Cookie"));
      await destroySession(oldSession);

      const newSession = await getSession();
      newSession.set("accessToken", token);

      return redirect("/mypage/profile", {
        headers: {
          "Set-Cookie": await commitSession(newSession),
        },
      });
    } else {
      // 네이버 로그인 자체 실패 시
      console.error("백엔드에서 네이버 로그인 처리 실패:", loginResult.message);
      return redirect("/login?error=naver_login_failed");
    }
  } catch (error) {
    // API 호출 중 네트워크 에러 등 발생 시
    console.error("API 호출 실패:", error);
    return redirect("/login?error=api_failed");
  }
}


export default function NaverCallback() {
  return <div>로그인 중...</div>;
}