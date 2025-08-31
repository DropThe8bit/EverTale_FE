
import { redirect, Form, useActionData, Link } from "react-router";
import "~/styles/login.css";

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
					<Link to="/mypage/auth/signup">
						<div className="go-signup-button">
							<p>회원가입</p>
						</div>
					</Link>
				</div>
			</Form>

			<div className="other-login-mention">또는</div>

			<Link to="/naver">
				<div className="naver-login-button">
					<div className="naver-logo"> <span>N</span> </div>
					<p>네이버로 시작하기</p>
				</div>
			</Link>
		</div>
	);
}
