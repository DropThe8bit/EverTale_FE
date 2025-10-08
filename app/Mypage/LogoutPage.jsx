
import { redirect } from "react-router";
import { logoutUser } from "~/api/mypage.server";
import { getSession, commitSession, destroySession } from "~/auth/auth.js";

export async function action({ request }) {
	const session = await getSession(request.headers.get("Cookie"));
	const childAccessToken = session.get("childAccessToken");

	const result = await logoutUser(childAccessToken);
	console.log(result);

	if (result?.isSuccess) {
		const headers = new Headers();
		headers.append("Set-Cookie", await destroySession(session));

		return redirect("/mypage/login", { headers });
	}
}

export default function LogoutPage() {
	return null;
}
