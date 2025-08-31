
import { redirect, Form, useActionData, Link } from "react-router";
import "~/styles/signup.css";

import { signUpUser } from "~/data/mypage.server";

export async function action({ request }) {
  const formData = await request.formData();
  // 'as string' 타입 캐스팅을 제거했습니다.
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const phone = formData.get("phone");
  const department = formData.get("department");


  // 간단한 유효성 검사
  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 입력해주세요." };
  }

  const result = await signUpUser({ email, password, username, phone, department });

  // API 요청 결과에 따라 처리
  if (result.success) {
    // 성공 시 로그인 페이지나 대시보드로 리다이렉트
    return redirect("/login");
  } else {
    // 실패 시 에러 메시지를 UI로 다시 전달
    return { error: result.message };
  }
}

// 3. 사용자에게 보여줄 UI 컴포넌트
export default function SignUpPage() {
  // action에서 반환된 데이터를 가져옵니다 (에러 메시지 등)
  // 제네릭 타입 <typeof action>을 제거했습니다.
  const actionData = useActionData();

  return (
    <div className="signup-container">
      <p>회원가입</p>
      <div className="signup-guide-mention"><span className="req">*</span>필수 입력 사항</div>
      <div className="signup-separator"></div>

      {/* Remix의 Form 컴포넌트를 사용하면 자동으로 action 함수에 POST 요청을 보냅니다. */}
      <Form method="post">
        <div className="signup-group">
          <div className="signup-input">
            <label className="signup-label">
              <span className="label-text">이메일<span className="req">*</span></span>
              <input type="email" name="email" placeholder="ex) ewhacse@gmail.com" required />
            </label>
          </div>

          <div className="signup-input">
            <label className="signup-label">
              <span className="label-text">비밀번호<span className="req">*</span></span>
              <input type="password" name="password" placeholder="비밀번호를 입력해주세요." required />
            </label>
          </div>

          <div className="signup-input">
            <label className="signup-label">
              <span className="label-text">비밀번호 확인<span className="req">*</span></span>
              <input type="password" name="confirmPassword" placeholder="비밀번호를 한번 더 입력해주세요." required />
            </label>
          </div>

          <div className="signup-input">
            <label className="signup-label">
              <span className="label-text">이름<span className="req">*</span></span>
              <input type="text" name="username" placeholder="이름을 입력해주세요. ex) 홍길동" required />
            </label>
          </div>

          <div className="signup-input">
            <label className="signup-label">
              <span className="label-text">휴대폰<span className="req">*</span></span>
              <input type="tel" name="phone" placeholder="ex) 01012345678" required />
            </label>
          </div>

          <div className="signup-input">
            <label className="signup-label">
              <span className="label-text">소속 기관</span>
              <input type="text" name="department" placeholder="" />
            </label>
          </div>

          {actionData?.error && <p className="form-error">{actionData.error}</p>}

          <button className="signup-submit" type="submit">회원가입 완료</button>
        
        </div>
        <Link to="/mypage/auth/login">
            <div className="back-login-button">
              <p>로그인 화면으로</p>
            </div>
          </Link>
      </Form>

    </div>
  );
}
