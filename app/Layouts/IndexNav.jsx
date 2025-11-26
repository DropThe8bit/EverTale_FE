import { useSearchParams, Outlet, useLoaderData, Link, useFetcher, useNavigate, Form } from "react-router";

import NavHeader from "../components/navigation/NavHeader";
import NavHeaderChild from "../components/navigation/NavHeaderChild"
import { getSession } from "~/auth/auth";
import { inquiryAlarm } from "~/api/mypage.server";
import { useState } from "react";

export default function IndexNav() {
  const [searchParams] = useSearchParams();
  const isChildUser = searchParams.get("user") == "child";
  const { myName, alarmData } = useLoaderData() || [];

  const [showAlarmModalOpen, setAlarmModalOpen] = useState(false);
  const handleToggleAlarmModal = () => {
    setAlarmModalOpen(prev => !prev);
  }

  const alarmSummaries = alarmData?.alarmSummaries || [];

  return (
    <div>
      {isChildUser ? (
        <>
          <NavHeaderChild myName={myName} alarmData={alarmData} onToggleAlarmModal={handleToggleAlarmModal} />
        </>
      ) : (
        <>
          <NavHeader myName={myName} />
        </>
      )}
      <Outlet />
      {showAlarmModalOpen && (
        <AlarmModal
          alarmSummaries={alarmSummaries}
          myName={myName}
          onClose={handleToggleAlarmModal} // 닫기 함수 연결
        />
      )}
    </div>
  )
}


function AlarmModal({ alarmSummaries, myName, onClose }) {
  const readAlarms = alarmSummaries.filter(alarm => alarm.read === false);
  const regex = /「(.*?)」/;

  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleAlarmClick = (alarmId, targetUrl) => {
    const formData = new FormData();
    formData.append('_action', 'changeStateAlarm'); // action 분기용
    formData.append('alarmId', alarmId);
    fetcher.submit(formData, { method: "post", action: "/update-alarm" });
    console.log("보냄?")
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

  try {
    const myName = session.get("myName") || [];
    const alarmData = await inquiryAlarm(childAccessToken);
    return { myName: myName, alarmData: alarmData.result };
  } catch (error) {
    return { myName: null, alarmData: { result: null } };
  }
}
