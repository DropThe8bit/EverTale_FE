import { Link, NavLink, Outlet } from "react-router"
import "~/styles/navSide.css";

export default function NavSide() {
	return (
		<div>
			<div className="navside-bar">
				<div className="navside-top">
					<Link to="/mypage" className="navside-mypage">마이페이지&gt;</Link>
					<Link to="/story" className="navside-item">스토리 만들기 &gt;</Link>
					<Link to="/mybook" className="navside-item">나만의 책장 &gt;</Link>
				</div>

				<div className="navside-bottom">
					<Link to="/logout" className="navside-icon-button">
						<span>로그아웃</span>
					</Link>
					<Link to="/withdraw" className="navside-icon-button">
						<span>프로필 삭제</span>
					</Link>
				</div>
			</div>
			<Outlet />

		</div>

	);
}
