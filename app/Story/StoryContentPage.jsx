import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import "~/styles/storyContent.css";

export default function StoryContentPage() {
	return (
		<>
			<div className="story-character-creator-title">
				동화 속 세계로 떠날 주인공을 만나볼까요?
			</div>
			<div className="character-creator-container">
				<div className="form-section">
					<div className="character-creator-separator"></div>
					{/* 이름 */}
					<div className="form-group">
						<label htmlFor="name">이름</label>
						<input type="text" id="name" name="name" value={character.name} onChange={handleChange} placeholder="이름을 입력해주세요. EX) 용용이" />
					</div>

					{/* 나이 */}
					<div className="form-group">
						<label htmlFor="age">나이</label>
						<input type="text" id="age" name="age" value={character.age} onChange={handleChange} placeholder="나이를 입력해주세요. EX) 7" disabled={ageDisabled} />
						<div className="checkbox-wrapper">
							<input type="checkbox" id="age-opt-out" checked={ageDisabled} onChange={handleAgeCheckbox} />
							<label htmlFor="age-opt-out"> 선택안함</label>
						</div>
					</div>

					{/* 성별 */}
					<div className="form-group">
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
					<div className="form-group">
						<label>성격</label>
						<div className="personality-grid">
							{PERSONALITY_TRAITS.map(trait => (
								<button
									key={trait}
									className={`trait-btn ${selectedTraits.includes(trait) ? 'selected' : ''}`}
									onClick={() => handleTraitToggle(trait)}
								>
									{trait}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className="uploader-section">
					{/* 이미지 업로더 */}
					<input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
					<label htmlFor="image-upload" className="image-uploader">
						{imagePreview ? (
							<img src={imagePreview} alt="주인공 미리보기" className="image-preview" />
						) : (
							<div className="uploader-placeholder">
								<span className="folder-icon">📁</span>
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
						className={`submit-btn ${isFormValid ? 'active' : ''}`}
						onClick={handleSubmit}>
						다음으로 넘어가기
					</button>

				</div>
			</div>
		</>
		)

}
