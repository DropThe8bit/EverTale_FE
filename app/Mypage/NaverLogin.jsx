import { redirect } from 'react-router';
import { getSession, commitSession } from '~/auth/auth.js';
import crypto from 'crypto'; // Node.js 기본 암호화 모듈

export async function loader({ request }) {
	const session = await getSession(request.headers.get("Cookie"));

	// 예측 불가능한 무작위 문자열을 생성합니다.
	const state = crypto.randomBytes(16).toString('hex');

	session.set("naver_oauth_state", state);

	const NAVER_CLIENT_ID = "6p1uj9YM1PO1hcUFguH1";
	const REDIRECT_URI = "http://localhost:5173/api/auth/naver-login";

	const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}`;

	return redirect(naverAuthUrl, {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
}