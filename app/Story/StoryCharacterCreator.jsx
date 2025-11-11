import React, { useEffect, useState } from 'react';
import { Form, redirect, useActionData, useNavigate, useNavigation, useParams, useSearchParams } from "react-router";
// import { json, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node"; // Remix 유틸리티를 @remix-run/node 에서 가져옵니다.
import { getSession } from '~/auth/auth';
import { createCharacter } from "~/api/story.server";

import "~/styles/storyCharacter.css";

// 성격 태그 목록을 상수로 정의
const PERSONALITY_TRAITS = [
  '용감한', '다정한', '솔직한', '정의로운', '착한', '차분한',
  '모험심 강한', '지혜로운', '적극적인', '활발한', '낙천적인', '호기심 많은'
];


export default function StoryCharacterCreator() {
  const [character, setCharacter] = useState({
    characterName: '',
    age: '',
    gender: '',
    personalities: '',
    description: '',
  });

  const [selectedTraits, setSelectedTraits] = useState([]);
  const [ageDisabled, setAgeDisabled] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacter(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e) => { setCharacter(prev => ({ ...prev, gender: e.target.value })); };
  const handleAgeCheckbox = (e) => {
    setAgeDisabled(e.target.checked);
    if (e.target.checked) setCharacter(prev => ({ ...prev, age: '' }));
  };

  const handleTraitToggle = (trait) => {
    setSelectedTraits(prev => prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const isFormValid =
    character.characterName.trim() !== '' &&
    (character.age.trim() !== '' || ageDisabled) &&
    character.gender !== '' &&
    selectedTraits.length > 0 &&
    imagePreview !== null &&
    character.description.trim() !== '';

  const requestData = JSON.stringify({
    characterName: character.characterName,
    age: ageDisabled ? 0 : parseInt(character.age, 10) || 0,
    gender: character.gender === '여자' ? 'female' : (character.gender === '남자' ? 'male' : 'animal'),
    personalities: selectedTraits,
    imageDescription: character.description,
  });

  const actionData = useActionData();
  const navigation = useNavigation();
  const params = useParams(); // URL에서 storyId를 가져오기 위해
  const isLoading = navigation.state === 'submitting';
  const isModalOpen = isLoading || !!actionData?.result;


  return (
    <>
      <Form method="post" encType="multipart/form-data">
        <div className="story-character-creator-title">
          동화 속 세계로 떠날 주인공을 만나볼까요?
        </div>
        <div className="story-character-container">
          <div className="story-character-form-section">
            <div className="story-character-separator"></div>
            {/* 이름 */}
            <div className="story-character-form-group">
              <label htmlFor="name">이름</label>
              <input type="text" id="name" name="characterName" value={character.characterName} onChange={handleChange} placeholder="이름을 입력해주세요. EX) 용용이" />
            </div>

            {/* 나이 */}
            <div className="story-character-form-group">
              <label htmlFor="age">나이</label>
              <input type="text" id="age" name="age" value={character.age} onChange={handleChange} placeholder="나이를 입력해주세요. EX) 7" disabled={ageDisabled} />
              <div className="checkbox-wrapper">
                <input type="checkbox" id="age-opt-out" checked={ageDisabled} onChange={handleAgeCheckbox} />
                <label htmlFor="age-opt-out"> 선택안함</label>
              </div>
            </div>

            {/* 성별 */}
            <div className="story-character-form-group">
              <label>성별</label>
              <div className="radio-group">
                {['여자', '남자', '동물'].map(gender => (
                  <div key={gender} className="radio-wrapper">
                    <input type="radio" id={gender} name="gender" value={gender} checked={character.gender === gender} onChange={handleGenderChange} />
                    <label htmlFor={gender}>{gender}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* 성격 */}
            <div className="story-character-form-group">
              <label>성격</label>
              <div className="personality-grid">
                {PERSONALITY_TRAITS.map(trait => (
                  <button
                    key={trait}
                    className={`story-character-trait-btn ${selectedTraits.includes(trait) ? 'selected' : ''}`}
                    onClick={() => handleTraitToggle(trait)}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <input type="hidden" name="request" value={requestData} />

          <div className="story-character-uploader-section">
            {/* 이미지 업로더 */}
            <input type="file" name="initCharacterImage" id="story-character-image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} required />
            <label htmlFor="story-character-image-upload" className="story-character-image-uploader">
              {imagePreview ? (
                <img src={imagePreview} alt="주인공 미리보기" className="story-character-image-preview" />
              ) : (
                <div className="story-character-uploader-placeholder">
                  <span className="story-character-folder-icon">📁</span>
                  <p>주인공을 그려서 올려주세요</p>
                </div>
              )}
            </label>

            {/* 캐릭터 설명 */}
            <textarea
              name="description"
              value={character.description}
              onChange={handleChange}
              placeholder="나는 누구인가요? ex) 드래곤, 슈퍼맨, 축구공"
            />
            <button
              type="submit"
              className={`story-character-submit-btn ${isFormValid ? 'active' : ''}`}
              disabled={!isFormValid}>
              캐릭터 만들기
            </button>
          </div>
        </div>
      </Form>
      {isModalOpen && (
        <CharacterPreviewModal
          isLoading={isLoading}
          imageUrl={actionData?.result}
          storyId={params.storyId} // 다음 페이지로 이동할 때 필요
          characterName={character.characterName}
          onClose={() => window.location.reload()} // '다시 만들기'는 페이지 새로고침
        />
      )}
    </>
  );
}

function CharacterPreviewModal({ isLoading, imageUrl, storyId, onClose, characterName }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isChildUser = searchParams.get("user") == "child";

  const handleConfirm = () => {
    navigate(`/story/${storyId}/category?char=${characterName}&${isChildUser ? '&user=child' : ''}`);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center', padding: '2rem' }}>
        {isLoading ? (
          <>
            <h3>캐릭터 생성 중...</h3>
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', marginBottom: '16px' }}>멋진 그림을 그리고 있어요!<br /> </p>
            <div className="form-buttons">
              <button type="button" onClick={onClose}>취소</button>
            </div>
          </>
        ) : (
          <>
            <h3>멋진 캐릭터가 만들어졌어요!</h3>
            <img
              src={imageUrl}
              alt="생성된 캐릭터"
              className="result-character-image"
            />
            <div className="form-buttons">
              <button type="button" onClick={onClose}>다시 만들기</button>
              <button type="button" onClick={handleConfirm} >다음으로 넘어가기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export async function action({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("childAccessToken");
  if (!token) {
    return redirect("/mypage/login");
  }

  const storyId = params.storyId; // URL 파라미터에서 storyId 가져오기
  const formData = await request.formData();
  const characterData = formData.get("request");
  const initCharacterImage = formData.get("initCharacterImage");

  const result = await createCharacter(
    token,
    storyId,
    characterData,
    initCharacterImage,
  );
  console.log("결과물", result);

  if (result?.isSuccess) {
    return result;
  } else {
    return { error: result?.message || "캐릭터 생성에 실패했습니다." };
  }
}
