import { Link, NavLink, Outlet } from "react-router"
import "~/styles/navSide.css";

export default function NavSide() {
  return (
    <div>
      <div className="navside-bar">
        <div className="navside-top">
          <NavLink to="/mypage" className="navside-item">마이페이지 &gt;</NavLink>
          <NavLink to="/story" className="navside-item">스토리 만들기 &gt;</NavLink>
          <NavLink to="/easter" className="navside-item">이스터에그 &gt;</NavLink>
          <NavLink to="/mybook" className="navside-item">나만의 책장 &gt;</NavLink>
        </div>

        <div className="navside-bottom">
          <Link to="/logout" className="navside-icon-button">
            <span>로그아웃</span>
          </Link>
          <Link to="/withdraw" className="navside-icon-button">
            <span>회원탈퇴</span>
          </Link>
        </div>
      </div>
    </div>

  );
}
