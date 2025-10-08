
import { redirect } from "react-router";
import { profileLogoutUser } from "~/api/mypage.server";
import { getSession, commitSession } from "~/auth/auth.js";

export async function action({ request }) {
	const session = await getSession(request.headers.get("Cookie"));
	const childAccessToken = session.get("childAccessToken");

	const result = await profileLogoutUser(childAccessToken);
	console.log(result);

	if (result?.isSuccess) {
		session.unset("childAccessToken");
		session.unset("profileId");

		return redirect("/mypage/profile", {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		});
	}
}


export default function ProfileLogoutPage() {
	return null;
}
