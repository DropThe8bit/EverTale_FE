import { Link, NavLink, Outlet } from "react-router"
import "~/styles/navHeader.css";

export default function NavHeader(props) {
  const myName = props.myName || "로그인 | 회원가입";

  return (
    <>
      <header className="nav-bar">
        <nav className="nav-align">
          <li className="navbar-logo">
            <Link to="/">
              <img src="/images/logo.png" alt="EverTale logo" />
            </Link>
            <div className="nav-profile">
            <span>{myName}</span>
            <img src="/nav_icon/profile.png" alt="profile" />
            </div>
          </li>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" activeClassName="active" className="link">
                <img src="/nav_icon/every_library.png" alt="every_library" />
                {/* <NavLink to={`/places/${place.eid}`} activeClassName="active" className="link"> */}
                모두의 책장
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/story" activeClassName="active" className="link">
                <img src="/nav_icon/story_making.png" alt="story_making" />
                스토리 만들기
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/easter" activeClassName="active" className="link">
                <img src="/nav_icon/easter_egg.png" alt="easter_egg" />
                이스터에그
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/mybook" activeClassName="active" className="link">
                <img src="/nav_icon/my_library.png" alt="my_library" />
                나만의 책장
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/mypage" activeClassName="active" className="link">
                <img src="/nav_icon/mypage.png" alt="mypage" />
                마이페이지
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}