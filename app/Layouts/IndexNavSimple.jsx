import React, { useState } from 'react';
import { Link, Outlet, useSearchParams } from "react-router"; 
import "~/styles/navSimple.css";

import NavSide from "~/components/navigation/NavSide";
import NavSideChild from "~/components/navigation/NavSideChild";

export default function NavSimple() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const isChildUser = searchParams.get("user") === "child";

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <header className="nav-simple-bar">
        <nav className="nav-simple-align">
          <li className="navbar-simple-logo">
            <div className="nav-simple-navside-open">
              <button onClick={openSidebar} className="sidebar-toggle-btn">
                <img src="/nav_icon/navside_button.png" alt="Navside button" />
              </button>
            </div>
            <Link to="/">
              <img src="/images/logo.png" alt="EverTale logo" />
            </Link>
            <div className="nav-simple-profile">
              <span>로그인 | 회원가입</span>
              <img src="/nav_icon/profile.png" alt="profile" />
            </div>
          </li>
        </nav>
      </header>
      <Outlet />

      {isSidebarOpen && (
        <>
          {/* 뒷배경을 클릭하면 사이드바가 닫힘. */}
          <div className="sidebar-overlay" onClick={closeSidebar}></div>
          <div className="sidebar-nav">
            {isChildUser ? (
              <NavSideChild onClose={closeSidebar} /> // 닫기 함수를 prop으로 전달
            ) : (
              <NavSide onClose={closeSidebar} /> // 닫기 함수를 prop으로 전달
            )}
          </div>
        </>
      )}
    </>
  );
}