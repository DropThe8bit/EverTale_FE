import { Form, Link, redirect, useLoaderData } from "react-router";
import { accessMyProfileInfo, updateProfile } from "~/api/mypage.server";
import { getSession } from "~/auth/auth";
import "~/styles/mypage.css";

export default function UpdateProfileParentPage() {
	const { username, profile } = useLoaderData();

	return (
		<>
			<div className="mypage-top">
				<div className="my-name-card">
					<img src="/images/default_profile.png" alt="default_profile" />
					<div className="my-title-and-name">
						{username} 작가님 부모 <br /> {profile.name}님
					</div>
				</div>
			</div>

			<Form method="post">
				<div className="mypage-middle">
					<div className="my-profile-card">
						<div className="my-profile-guide">
							<li>이름</li>
							<li>비밀번호</li>
							<li>이메일</li>
							<li>휴대폰</li>
						</div>

						<div className="my-profile-information">
							<li>
								<input
									type="text"
									defaultValue={profile.name}
									name="name"
									className="profile-input"
								/>
							</li>
							<li>*********</li>
							<li>
								<input
									type="email"
									defaultValue={profile.email}
									name="email"
									className="profile-input"
								/>
							</li>
							<li>
								<input
									type="text"
									defaultValue={profile.phone}
									name="phone"
									className="profile-input"
								/>
							</li>
						</div>
						<button type="submit" className="my-profile-update-btn">
							수정 완료
						</button>
					</div>
				</div>
			</Form>

			<div className="mypage-bottom">
				<Link to="/">
					<img src="/images/logo.png" alt="EverTale logo" />
				</Link>
			</div>
		</>
	);
}


// loader는 그대로
export async function loader({ request }) {
	const session = await getSession(request.headers.get("Cookie"));
	const childAccessToken = session.get("childAccessToken");
	const username = session.get("username");

	if (!childAccessToken) {
		return redirect(`/mypage/login`);
	}

	try {
		const myProfileDataResult = await accessMyProfileInfo(childAccessToken);

		if (myProfileDataResult?.isSuccess) {
			const myProfileDataSummaries = myProfileDataResult?.result || [];
			return { username, profile: myProfileDataSummaries };
		}
	} catch (error) {
		console.error("loader error:", error);
		return redirect(`/mypage/login`);
	}
}

export async function action({ request }) {
	const session = await getSession(request.headers.get("Cookie"));
	const childAccessToken = session.get("childAccessToken");
	if (!childAccessToken) {
		return redirect("/mypage/login");
	}
	const formData = await request.formData();
	const updatedContent = {
		name: formData.get("name"),
		phone: formData.get("phone"),
		email: formData.get("email"),
	};
	const result = await updateProfile(childAccessToken, updatedContent);
	console.log(result)
	if (result?.isSuccess) {
		return redirect("/mypage");
	} else {
		return redirect("/mypage/update?error=1");
	}
}
