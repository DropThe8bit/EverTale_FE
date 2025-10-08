const dummyProfile = [
  { username: "김이화", title: "전설의 이야기꾼", image: "/images/default_profile.png", password: "*********", email: "ewhacse@gmail.com", phone: "010-1234-5678", department: "햇살유치원" },
]

import { Link, NavLink, Outlet } from "react-router"
import "~/styles/mypage.css";

export default function ChildPage(props) {
  const { profile } = props;

  return (
    <>
      <div className="mypage-top">
        <div className="my-name-card">
          <img src="/images/default_profile.png" alt={profile.name} />
          <div className="my-title-and-name">전설의 이야기꾼<br />{profile.name} 작가님</div>
        </div>
      </div>

      <div className="mypage-middle">
        <div className="my-profile-card">
          <div className="my-profile-guide">
            <li>이름</li>
            <li>소속기관</li>
          </div>
          <div className="my-profile-information">
            <li>{profile.name}</li>
            <li>{profile.institution}</li>
          </div>
        </div>
      </div>

      <div className="mypage-bottom">
        <Link to="/">
          <img src="/images/logo.png" alt="EverTale logo" />
        </Link>
      </div>
    </>
  );
}