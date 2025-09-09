import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import "~/styles/storyCharacter.css";

// 성격 태그 목록을 상수로 정의
const PERSONALITY_TRAITS = [
	'용감한', '다정한', '솔직한', '정의로운', '착한', '차분한',
	'모험심 강한', '지혜로운', '적극적인', '활발한', '낙천적인', '호기심 많은'
];

function StoryCharacterCreator() {
	// 각 입력 필드에 대한 상태 관리
	const [character, setCharacter] = useState({
		name: '',
		age: '',
		gender: '',
		description: '',
	});
	const [selectedTraits, setSelectedTraits] = useState([]);
	const [ageDisabled, setAgeDisabled] = useState(false);
	const [imagePreview, setImagePreview] = useState(null);
	const navigate = useNavigate();

	// 일반적인 input(이름, 나이, 설명) 변경 핸들러
	const handleChange = (e) => {
		const { name, value } = e.target;
		setCharacter(prev => ({ ...prev, [name]: value }));
	};

	// 성별 라디오 버튼 변경 핸들러
	const handleGenderChange = (e) => {
		setCharacter(prev => ({ ...prev, gender: e.target.value }));
	};

	// 나이 '선택 안함' 체크박스 핸들러
	const handleAgeCheckbox = (e) => {
		setAgeDisabled(e.target.checked);
		if (e.target.checked) {
			setCharacter(prev => ({ ...prev, age: '' })); // 체크 시 나이 초기화
		}
	};

	// 성격 태그 선택/해제 핸들러
	const handleTraitToggle = (trait) => {
		setSelectedTraits(prev =>
			prev.includes(trait)
				? prev.filter(t => t !== trait) // 이미 있으면 제거
				: [...prev, trait] // 없으면 추가
		);
	};

	// 이미지 업로드 및 미리보기 핸들러
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImagePreview(URL.createObjectURL(file));
		}
	};

	// 모든 필수 항목이 채워졌는지 실시간으로 확인
	const isFormValid =
		character.name.trim() !== '' &&
		(character.age.trim() !== '' || ageDisabled) &&
		character.gender !== '' &&
		selectedTraits.length > 0 &&
		imagePreview !== null &&
		character.description.trim() !== '';

	// 새 스토리를 생성할 때 id만 생성하여 반환
	const handleSubmit = () => {
		// isFormValid가 true일 때만 제출 로직을 실행합니다.
		if (isFormValid) {
			const characterData = {
				...character,
				personality: selectedTraits,
				image: imagePreview, // 실제로는 파일 객체를 전송해야 함
			};
			console.log('생성된 캐릭터 정보:', characterData);

			// 데이터를 state에 담아 다음 페이지로 이동
			navigate('/story/category', { state: { character: characterData } });

		} else {
			// isFormValid가 false이면 안내 메시지를 띄웁니다.
			alert('모든 항목을 입력하거나 선택해주세요.');
		}
	};

	return (
		<>
			<div className="story-character-creator-title">
				동화 속 세계로 떠날 주인공을 만나볼까요?
			</div>
			<div className="story-character-container">
				<div className="story-character-form-section">
					<div className="story-character-separator"></div>
					{/* 이름 */}
					<div className="story-character-form-group">
						<label htmlFor="name">이름</label>
						<input type="text" id="name" name="name" value={character.name} onChange={handleChange} placeholder="이름을 입력해주세요. EX) 용용이" />
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

				<div className="story-character-uploader-section">
					{/* 이미지 업로더 */}
					<input type="file" id="story-character-image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
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
						className={`story-character-submit-btn ${isFormValid ? 'active' : ''}`}
						onClick={handleSubmit}>
						다음으로 넘어가기
					</button>

				</div>
			</div>
		</>
	);
}

export default StoryCharacterCreator;