const dummyProfile = [
	{ username: "김이화", title: "전설의 이야기꾼", image: "/images/default_profile.png", password: "*********", email: "ewhacse@gmail.com", phone: "010-1234-5678", department: "햇살유치원"},
]

import { Link, NavLink, Outlet } from "react-router"
import "~/styles/mypage.css";

export default function ParentPage() {

	return (
		<>
			<div className="mypage-top">
				{dummyProfile.map((char, index) => (
					<div key={index} className="my-name-card">
						<img src={char.image} alt={char.name} />
						<div className="my-title-and-name">{char.title}<br />{char.username} 작가님</div>
					</div>
				))}

			</div>

			<div className="mypage-middle">
				{dummyProfile.map((char, index) => (
					<div key={index} className="my-profile-card">
						<div className="my-profile-guide">
							<li>이름</li>
							<li>소속기관</li>
						</div>
						<div className="my-profile-information">
							<li>{char.username}</li>
							<li>{char.department}</li>
						</div>
					</div>
				))}
			</div>

			<div className="mypage-bottom">
				<Link to="/">
					<img src="/images/logo.png" alt="EverTale logo" />
				</Link>
			</div>
		</>
	);
}