import { Form, Link, NavLink, Outlet } from "react-router"
import "~/styles/navSide.css";

export default function NavSide() {
  return (
    <div>
      <div className="navside-bar">
        <div className="navside-top">
        <NavLink to="/mypage?user=child" className="navside-item">
            {({ isActive }) => (
              <>
                {isActive && <img src="/images/nav_selector.png" alt="선택됨" />}마이페이지 &gt;
              </>
            )}
          </NavLink>
          <NavLink to="/story?user=child" className="navside-item">
            {({ isActive }) => (
              <>
                {isActive && <img src="/images/nav_selector.png" alt="선택됨" />}스토리 만들기 &gt;
              </>
            )}
          </NavLink>
          <NavLink to="/mybook?user=child" className="navside-item">
            {({ isActive }) => (
              <>
                {isActive && <img src="/images/nav_selector.png" alt="선택됨" />}나만의 책장 &gt;
              </>
            )}
          </NavLink>
        </div>

        <div className="navside-bottom">
          <Form action="/logout" method="post">
            <button type="submit" className="navside-icon-logout-button">
              <img src="/nav_icon/logout.png" alt="logout" />
              <span>로그아웃</span>
            </button>
          </Form>
          <Form action="/withdraw" method="post">
            <button type="submit" className="navside-icon-button">
              <img src="/nav_icon/withdraw.png" alt="logout" />
              <span>프로필삭제</span>
            </button>
          </Form>
        </div>
      </div>
    </div>

  );
}
