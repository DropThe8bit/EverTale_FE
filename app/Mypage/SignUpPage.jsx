import "~/styles/signup.css";
import { Form, useActionData, Link, redirect } from "react-router";
import { getSession, commitSession, destroySession } from '~/auth/auth.js';
import { signUpUser, createParentProfile, loginUser } from "~/api/mypage.server";

//  회원가입부터 프로필 생성까지 모든 과정을 처리하는 단일 action 함수
export async function action({ request }) {
  const formData = await request.formData();
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
    phone: formData.get("phone"),
    department: formData.get("department"),
  };

  try {
    // 회원가입
    const signUpResult = await signUpUser(userData);
    if (!signUpResult?.isSuccess) {
      throw new Error(signUpResult?.message || '회원가입에 실패했습니다.');
    }

    // 자동 로그인
    const loginResult = await loginUser({ email: userData.email, password: userData.password });
    if (!loginResult?.isSuccess || !loginResult?.result?.accessToken) {
      return redirect('/mypage/login?status=signup_success');
    }
    const token = loginResult.result.accessToken;

    // 프로필 생성 
    const profileResult = await createParentProfile(token);
    if (!profileResult.isSuccess) {
        // '이미 존재'가 아닌 다른 심각한 에러일 경우
        throw new Error(profileResult.message || '프로필 생성 중 오류 발생');
    }

    // 기존 세션 초기화 + 새로 발급 받은 세션 저장 및 페이지 전환
    const oldSession = await getSession(request.headers.get("Cookie"));
    await destroySession(oldSession);

    const newSession = await getSession(request.headers.get("Cookie"));
    newSession.set("accessToken", token);


  
    return redirect('/mypage/login', {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });

  } catch (error) {
    return { error: error.message };
  }
}


export default function SignUpPage() {
  const actionData = useActionData();

  return (
    <div className="signup-container">
      <p>회원가입</p>
      <div className="signup-guide-mention"><span className="req">*</span>필수 입력 사항</div>
      <div className="signup-separator"></div>

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
        <Link to="/mypage/login">
            <div className="back-login-button">
              <p>로그인 화면으로</p>
            </div>
          </Link>
      </Form>
    </div>
  );
}
