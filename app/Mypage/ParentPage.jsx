const myProfileDatadummyProfile = [
  { username: "김이화", title: "전설의 이야기꾼", image: "/images/default_profile.png", password: "*********", email: "ewhacse@gmail.com", phone: "010-1234-5678", department: "햇살유치원" },
]
import { Link, NavLink, Outlet, redirect, useLoaderData } from "react-router"

import "~/styles/mypage.css";

export default function ParentPage({ username, profile }) {

  return (
    <>
      <div className="mypage-top">
        <div className="my-name-card">
          <img src="/images/default_profile.png" alt={profile.name} />
          <div className="my-title-and-name">{username}작가 부모 <br/>{profile.name}님</div>
        </div>
      </div>

      <div className="mypage-middle">
        <div key={profile} className="my-profile-card">
          <div className="my-profile-guide">
            <li>아이 이름</li>
            <li>비밀번호</li>
            <li>이메일</li>
            <li>휴대폰</li>
          </div>
          <div className="my-profile-information">
            <li>{profile.name}</li>
            <li>*********</li>
            <li>{profile.email}</li>
            <li>{profile.phone}</li>
          </div>
          <Link to="/update" className="my-profile-update">
            <p>회원정보수정</p>
          </Link>

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

