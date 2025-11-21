import React, { useState } from 'react';
import { useLoaderData, useNavigate, Form, redirect } from "react-router"; // react-router-dom 사용 가정
import { getSession, commitSession } from '~/auth/auth.js';
import { initProfileList, createChildProfile, accessProfileToken } from "~/api/mypage.server";
import "~/styles/profileSelect.css";

function ProfileItem({ profile }) {
  return (
    <div className="profile-item">
      <Form method="post">
        <input type="hidden" name="profileId" value={profile.id} />
        <input type="hidden" name="profileName" value={profile.name} />
        <input type="hidden" name="_action" value="selectProfile" />
        <button type="submit" className="profile-item-button">
          <div className="profile-avatar-wrapper">
            <img src={profile.image} alt={profile.name} className="profile-avatar" />
          </div>
          <div className="profile-name">{profile.name}</div>
        </button>
      </Form>
    </div>
  );
}

export default function ProfileSelector() {
  const initialProfilesFromLoader = useLoaderData() || [];

  const profileImages = [
    '/images/profile1.png',
    '/images/profile2.png',
    '/images/profile3.png',
    '/images/profile4.png',
  ];

  // 로더 데이터에 이미지를 매핑하여 초기 상태를 설정합니다.
  const profiles = initialProfilesFromLoader.map((profile, index) => ({
    id: profile.profileId,
    name: profile.name,
    image: profileImages[index % profileImages.length],
  }));

  // 새 프로필 추가 UI를 토글하기 위한 상태 
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="profile-selector-container">
      <p>EverTale의 세계로 떠날 주인공을 선택해주세요</p>
      <div className="profile-list-wrapper">
        <div className="profile-list">
          {profiles.map((profile) => (
            <ProfileItem
              key={profile.id}
              profile={profile}
            />
          ))}
        </div>
        {/* isAdding' 상태가 false일 때만 '추가' 버튼 보이기 */}
        {!isAdding && (
          <button className="add-profile-button" onClick={() => setIsAdding(true)}>
            +
          </button>
        )}
      </div>
      {/* 'isAdding' 상태가 true이면 프로필 추가 폼 렌더링 */}
      {isAdding && (
        <AddChildProfileModal onClose={() => setIsAdding(false)} />
      )}
    </div>
  );
}

function AddChildProfileModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Form method="post" className="add-profile-form" onSubmit={onClose}>
          <h3>새로운 자녀 프로필 추가</h3>
          <div className="add-profile-item">
            <p>이름</p>
            <input type="text" name="name" required />
          </div>
          <div className="add-profile-item">
            <p>생년월일</p>
            <input type="date" name="birthDate" required />
          </div>
          <div className="add-profile-item">
            <p>소속기관</p>
            <input type="text" name="institution" placeholder="(예: 새싹 유치원)" required />
          </div>
          <div className="form-buttons">
            <button type="button" onClick={onClose}>취소</button>
            <button type="submit">추가하기</button>
          </div>
        </Form>
      </div>
    </div>
  );
}



// 프로필 조회
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("accessToken");
  // 토큰이 없는 경우에 대한 처리
  if (!token) {
    redirect("/mypage/login");
    return [];
  }
  const profileListResult = await initProfileList(token);
  // console.log(profileListResult.result)
  if (profileListResult?.isSuccess && profileListResult?.result?.profiles) {
    return profileListResult.result.profiles;
  }
  return [];
}



// 자녀 프로필을 추가하고, 각 프로필에 접속하는 함수
export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("accessToken");

  if (!token) redirect("/mypage/login");

  const formData = await request.formData();
  const actionType = formData.get("_action");

  // [프로필 선택] 로직
  if (actionType === "selectProfile") {
    const profileId = formData.get("profileId");
    const profileName = formData.get("profileName");

    try {
      const result = await accessProfileToken(profileId, token);
      if (result.isSuccess) {
        // 발급받은 새 토큰을 세션에 저장
        const newChildToken = result.result.accessToken;
        session.set("childAccessToken", newChildToken);
        console.log("자녀접속토큰:", result)

         // 리프레쉬 토큰 저장
         const refreshToken = result.result.accessToken;
         session.set("refreshAccessToken", refreshToken);

        // 부모 <-> 자녀 UI분기
        if (result.result.profileType == "CHILD") {
          session.set("profileId", profileId);
          session.set("username", profileName);
          session.set("myName", profileName);
          return redirect("/?user=child", {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          });
        } else {
          session.set("myName", profileName);
          return redirect("/mypage/childselect", {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          });
        }
      }
    } catch (error) {
      console.error("Profile access failed:", error);
    }
  }
  // [자녀 프로필 추가] 로직 
  else {
    const name = formData.get("name");
    const birthDate = formData.get("birthDate");
    const institution = formData.get("institution");

    if (!name || !birthDate || !institution) {
      return { error: "이름, 생년월일, 소속기관은 필수입니다." };
    }
    const newProfileData = { name, birthDate, institution };

    try {
      const result = await createChildProfile(token, newProfileData);
      if (result.isSuccess) {
        // 프로필 추가 성공 시, 현재 페이지를 새로고침하여 목록을 갱신합니다.
        return redirect(request.url);
      }
    } catch (error) {
      console.error("Profile creation failed:", error);
    }
  }
}