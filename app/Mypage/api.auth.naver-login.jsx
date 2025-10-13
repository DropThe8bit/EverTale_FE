import { redirect } from "react-router-dom"; // react-router-dom에서 가져옵니다.
import { getSession, commitSession, destroySession } from '~/auth/auth.js'; 
import { createParentProfile, loginNaverUser } from "~/api/mypage.server.js"; 

export async function loader({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const session = await getSession(request.headers.get("Cookie"));
  const sessionState = session.get("naver_oauth_state");

  // 1. state 값 검증 (보안)
  if (!state || !sessionState || state !== sessionState) {
    throw new Response("Invalid state", { status: 401 });
  }
  session.unset("naver_oauth_state"); // 검증 후에는 바로 삭제

  try {
    // 2. 네이버 로그인을 시도하여 우리 서비스의 토큰(accessToken)을 받아옵니다.
    const loginResult = await loginNaverUser(code, state);

    if (loginResult?.isSuccess && loginResult?.result?.accessToken) {
      const token = loginResult.result.accessToken;

      // 3. 받아온 토큰으로 즉시 부모 프로필 생성을 시도합니다.
      const profileResult = await createParentProfile(token);

      // API가 '이미 존재'하는 경우도 성공으로 처리한다고 가정합니다.
      if (profileResult?.isSuccess) {
        // 4. 모든 것이 성공하면, 최종적으로 세션을 설정하고 페이지를 이동시킵니다.
        const oldSession = await getSession(request.headers.get("Cookie"));
        await destroySession(oldSession);

        // 'getSession()'을 인자 없이 호출하여 새로운 세션을 생성합니다.
        const newSession = await getSession();
        newSession.set("accessToken", token);
        
        return redirect("/mypage/profile", {
          headers: {
            "Set-Cookie": await commitSession(newSession),
          },
        });
      } else {
        // 프로필 생성 실패 시
        console.error("부모 프로필 생성 실패:", profileResult.message);
        return redirect("/login?error=profile_creation_failed");
      }
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

// 이 파일의 action 함수는 더 이상 필요 없으므로 삭제합니다.
// export async function action({ request }) { ... }

export default function NaverCallback() {
  return <div>로그인 중...</div>;
}