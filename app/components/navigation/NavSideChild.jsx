import { Form, Link, NavLink, Outlet } from "react-router"
import "~/styles/navSide.css";

export default function NavSide() {
	return (
		<div>
			<div className="navside-bar">
				<div className="navside-top">
					<NavLink to="/mypage?user=child" className="navside-item">마이페이지 &gt;</NavLink>
					<NavLink to="/story?user=child" className="navside-item">스토리 만들기 &gt;</NavLink>
					<NavLink to="/mybook?user=child" className="navside-item">나만의 책장 &gt;</NavLink>
				</div>

				<div className="navside-bottom">
					<Form action="/logout" method="post">
						<button type="submit" className="logout-button">
							로그아웃
						</button>
					</Form>
					<Link to="/withdraw" className="navside-icon-button">
						<span>프로필 삭제</span>
					</Link>
				</div>
			</div>
			{/* <Outlet /> */}

		</div>

	);
}
