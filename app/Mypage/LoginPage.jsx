
import { redirect, Form, useActionData, Link, useNavigate } from "react-router";
import { useEffect } from "react";
import "~/styles/login.css";

import { getSession, commitSession, destroySession } from '~/auth/auth.js';
import { loginUser } from "~/api/mypage.server";


export default function LoginPage() {
  const actionData = useActionData();

  return (
    <div className="login-container">
      <p>로그인</p>
      <div className="login-separator"></div>

      {/* Remix의 Form 컴포넌트를 사용하면 자동으로 action 함수에 POST 요청을 보냅니다. */}
      <Form method="post">
        <div className="login-group">
          <div className="login-input">
            <label className="login-label">
              <input type="email" name="email" placeholder="이메일" required />
            </label>
          </div>

          <div className="login-input">
            <label className="login-label">
              <input type="password" name="password" placeholder="비밀번호" required />
            </label>
          </div>


          <button className="login-submit" type="submit">로그인</button>
          <Link to="/mypage/signup">
            <div className="go-signup-button">
              <p>회원가입</p>
            </div>
          </Link>
        </div>
      </Form>
      {actionData?.error && <p className="form-error">{actionData.error}</p>}

      <div className="other-login-mention">또는</div>

      <Link to="/mypage/naver">
        <div className="naver-login-button">
          <div className="naver-logo"> <span>N</span> </div>
          <p>네이버로 시작하기</p>
        </div>
      </Link>
    </div>
  );
}


export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // 간단한 유효성 검사
  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 입력해주세요." };
  }
  const result = await loginUser({ email, password });
  console.log(result)

  if (result?.isSuccess && result?.result?.accessToken) {
    const accessToken = result.result.accessToken;

    // 기존 세션 초기화 + 새로 발급 받은 세션 저장 및 페이지 전환
    const oldSession = await getSession(request.headers.get("Cookie"));
    await destroySession(oldSession);

    const newSession = await getSession();
    newSession.set("accessToken", accessToken);
    console.log("세션에 저장될 토큰:", newSession.get("accessToken"));

    return redirect('/mypage/profile', {
      headers: {
        "Set-Cookie": await commitSession(newSession),
      },
    });
  } else {
    return { error: result?.message || "이메일 또는 비밀번호가 올바르지 않습니다." };
  }
}
