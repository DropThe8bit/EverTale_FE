const myProfileDatadummyProfile = [
	{ username: "김이화", title: "전설의 이야기꾼", image: "/images/default_profile.png", password: "*********", email: "ewhacse@gmail.com", phone: "010-1234-5678", department: "햇살유치원" },
]
import { Link, NavLink, Outlet, useLoaderData } from "react-router"
import { getSession } from "~/auth/auth";
import "~/styles/mypage.css";

export default function ParentPage(props) {
	const {profile} = props;
	
	return (
		<>
			<div className="mypage-top">
				{/* {myProfileData.map((profile) => ( */}
					<div className="my-name-card">
						<img src="/images/default_profile.png" alt={profile.name} />
						{/* <div className="my-title-and-name">{char.title}<br />{char.username} 작가 부모님</div> */}
						<div className="my-title-and-name">전설의 이야기꾼<br />{profile.name} 작가 부모님</div>
					</div>
				{/* ))} */}

			</div>

			<div className="mypage-middle">
				{/* {myProfileData.map((profile) => ( */}
					<div key={profile} className="my-profile-card">
						<div className="my-profile-guide">
							<li>아이 이름</li>
							<li>비밀번호</li>
							<li>이메일</li>
							<li>휴대폰</li>
						</div>
						<div className="my-profile-information">
							<li>{profile.name}</li>
							{/* <li>{profile.password}</li> */}
							<li>{profile.email}</li>
							<li>{profile.phone}</li>
						</div>
						<Link to="/update" className="my-profile-update">
							<p>회원정보수정</p>
						</Link>

					</div>
				{/* ))} */}
			</div>

			<div className="mypage-bottom">
				<Link to="/">
					<img src="/images/logo.png" alt="EverTale logo" />
				</Link>
			</div>
		</>
	);
}

// export async function loader({ request }) {
// 	const session = await getSession(request.headers.get("Cookie"));

// 	if (!session.has("childAccessToken")) {
// 		return redirect("/mypage/login");
// 	}
// 	const childAccessToken = session.get("childAccessToken");
// 	const myProfileDataResult = await accessMyProfileInfo(childAccessToken);
// 	console.log(myProfileDataResult);

//  if (myProfileDataResult?.isSuccess && myProfileDataResult?.result) {
//     return myProfileDataResult.result;
//   }
//   return [];
// }
