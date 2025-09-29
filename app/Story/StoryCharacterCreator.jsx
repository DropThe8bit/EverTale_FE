import React, { useState } from 'react';
import { Form, redirect } from "react-router";
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
		description: '',
	});

	const [selectedTraits, setSelectedTraits] = useState([]);
	const [ageDisabled, setAgeDisabled] = useState(false);
	const [imagePreview, setImagePreview] = useState(null);

	// 핸들러 함수들도 그대로 유지합니다.
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
		gender: character.gender === '여자' ? 'female' : (character.gender === '남자' ? 'male' : 'etc'),
		personalities: selectedTraits,
		imageDescription: character.description,
	});


	return (
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
							{['여자', '남자', '기타'].map(gender => (
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
				{/* 4. action 함수에 JSON 데이터를 보내기 위한 숨은 필드 */}
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
						다음으로 넘어가기
					</button>

				</div>
			</div>
		</Form>
	);
}



export async function action({ request, params }) {
	try {
		const session = await getSession(request.headers.get("Cookie"));
		const token = session.get("childAccessToken");

		if (!token) {
			return redirect("/mypage/login");
		}
		const storyId = params.storyId; // URL 파라미터에서 storyId 가져오기

		const formData = await request.formData();
		const requestJsonString = formData.get("request");
		const imageFile = formData.get("initCharacterImage");


		const characterData = JSON.parse(requestJsonString);

		const result = await createCharacter({
			token,
			storyId,
			characterData,
			imageFile,
		});

		if (result?.isSuccess) {
			return redirect('/story/category');
		} else {
			return { error: result?.message || "캐릭터 생성에 실패했습니다." };
		}

	} catch (error) {
		// JSON 파싱 오류 또는 그 외 예기치 않은 오류 처리
		console.error("캐릭터 생성 Action 오류:", error);
	}
}
