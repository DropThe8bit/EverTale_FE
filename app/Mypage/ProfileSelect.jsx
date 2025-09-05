import React, { useState } from 'react';
// import ProfileItem from './ProfileItem';
import "~/styles/profileSelect.css";

function ProfileItem({ profile, onNameChange }) {
  return (
    <div className="profile-item">
      <div className="profile-avatar-wrapper">
        <img src={profile.image} alt={profile.name || "새 프로필"} className="profile-avatar" />
      </div>
      <input
        type="text"
        className="profile-name"
        value={profile.name}
        onChange={(e) => onNameChange(profile.id, e.target.value)}
        placeholder="이름 입력"
      />
    </div>
  );
}


function ProfileSelector() {
  const [profiles, setProfiles] = useState([
    { id: 1, name: '김부모', image: '/images/profile1.png' },
  ]);

  // 새 프로필에 순환 적용될 이미지 목록
  const newProfileImages = [
    '/images/profile1.png',
    '/images/profile2.png',
    '/images/profile3.png',
    '/images/profile4.png',
  ];
  
  // 프로필 추가 함수
  const handleAddProfile = () => {
    const nextImageIndex = profiles.length % newProfileImages.length;
    const newProfile = {
      id: Date.now(),
      name: '',
      image: newProfileImages[nextImageIndex], 
    };
    setProfiles([...profiles, newProfile]);
  };
  
  // 프로필 이름 변경 함수
  const handleNameChange = (id, newName) => {
    setProfiles(profiles.map(p => (p.id === id ? { ...p, name: newName } : p)));
  };

  // 렌더링 부분
  return (
    <div className="profile-selector-container">
      <p>EverTale의 세계로 떠날 주인공을 선택해주세요</p>
      <div className="profile-list-wrapper">
        <div className="profile-list">
          {profiles.map((profile) => (
            <ProfileItem
              key={profile.id}
              profile={profile}
              onNameChange={handleNameChange}
            />
          ))}
        </div>
        <button className="add-profile-button" onClick={handleAddProfile}>
          +
        </button>
      </div>
    </div>
  );
}

export default ProfileSelector;