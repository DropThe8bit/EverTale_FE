import React, { useState } from 'react';
import { Link, Outlet, useFetcher, useLoaderData, useNavigate, useSearchParams } from "react-router";
import "~/styles/navSimple.css";

import NavSide from "~/components/navigation/NavSide";
import NavSideChild from "~/components/navigation/NavSideChild";
import { getSession } from '~/auth/auth';
import { changeStateAlarm, inquiryAlarm } from '~/api/mypage.server';

export default function NavSimple() {
  const { myName, alarmData } = useLoaderData();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const isChildUser = searchParams.get("user") === "child";

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const unreadCountAlarm = alarmData.unreadCount || null;
  const [showAlarmModalOpen, setAlarmModalOpen] = useState(false);
  const alarmSummaries = alarmData?.alarmSummaries || [];

  const handleAlarmClick = () => {
    setAlarmModalOpen(true)
  }

  const handleAlarmClose = () => {
    setAlarmModalOpen(false)
  }

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
            <Link to={`/?${isChildUser ? '&user=child' : ''}`}>
              <img src="/images/logo.png" alt="EverTale logo" />
            </Link>
            <div className="nav-simple-profile">
              <span>{myName}</span>
              <img src="/nav_icon/profile.png" alt="profile" onClick={handleAlarmClick}/>
              {unreadCountAlarm != null ? (
                <div className="nav-alarm">
                  <p>{unreadCountAlarm}</p>
                </div>
              ) : (<></>)}
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
        {showAlarmModalOpen && (
        <AlarmModal
          alarmSummaries={alarmSummaries}
          myName={myName}
          onClose={handleAlarmClose} // 닫기 함수 연결
        />
      )}
    </>
  );
}

function AlarmModal({ alarmSummaries, myName, onClose }) {
  const readAlarms = alarmSummaries.filter(alarm => alarm.read === false);
  const regex = /「(.*?)」/;

  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleAlarmClick = (alarmId, targetUrl) => {
    const formData = new FormData();
    formData.append('_action', 'changeStateAlarm'); // action 분기용
    formData.append('alarmId', alarmId.toString());
    fetcher.submit(formData, { method: 'post' });
    onClose();
    navigate(targetUrl);
  };

  return (
    <div className="alarm-modal-overlay">
      <div className="alarm-modal-content">
        <h2>알림</h2>
        <button className="alarm-modal-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="alarm-modal-separator"></div>
        <div className="alarm-modal-list">
          {readAlarms && readAlarms.length > 0 ? (
            readAlarms.map((alarm, index) => {
              const matchResult = alarm.message.match(regex);
              const extractedTitle = matchResult && matchResult.length > 1 ? matchResult[1] : '제목 없음';

              const targetUrl = `/mybook/bookview/${alarm.storyId}/1?title=${extractedTitle}&author=${myName}&user=child`;

              return (
                <div key={index} className="alarm-modal-card">
                  <div
                    className="link-wrapper"
                    onClick={() => handleAlarmClick(alarm.alarmId, targetUrl)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="alarm-title">{alarm.message}</div>
                  </div>
                  <div className="alarm-separator"></div>
                </div>
              );
            })
          ) : (
            <div className="alarm-title">알림이 없습니다.</div>
          )}
        </div>
      </div >
    </div >
  );
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");

  if (childAccessToken) {
    const myName = session.get("myName");
    const alarmData = await inquiryAlarm(childAccessToken);
    if (alarmData.isSuccess) {
      return { myName: myName, alarmData: alarmData.result };
    }
  }
  return { myName: null };
}

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");
  if (!childAccessToken) {
    return { success: false, message: "인증 실패" };
  }
  const formData = await request.formData();
  const actionType = formData.get('_action');

  if (actionType === 'changeStateAlarm') {
    const alarmId = formData.get('alarmId');
    const result = await changeStateAlarm(childAccessToken, alarmId);
    console.log("알람 결과", result)
    // return { success: true, message: `알림 ID ${alarmId} 읽음 처리 완료` };
  }

  return null;
}