// import React, { useState } from 'react';
// import { useLoaderData, useNavigate, Form, redirect } from "react-router"; // react-router-dom 사용 가정
// import { getSession, commitSession, destroySession } from '~/auth/auth.js';
// import "~/styles/profileSelect.css";

// function ProfileItem({ profile }) {
// 	return (
// 		<div className="profile-item">
// 			<Form method="post">
// 				<input type="hidden" name="profileId" value={profile.id} />
// 				<input type="hidden" name="_action" value="selectProfile" />
// 				<button type="submit" className="profile-item-button">
// 					<div className="profile-avatar-wrapper">
// 						<img src={profile.image} alt={profile.name} className="profile-avatar" />
// 					</div>
// 					<div className="profile-name">{profile.name}</div>
// 				</button>
// 			</Form>
// 		</div>
// 	);
// }

// export default function ProfileSelector() {
// 	const initialProfilesFromLoader = useLoaderData() || [];

// 	const profileImages = [
// 		'/images/profile2.png',
// 		'/images/profile3.png',
// 		'/images/profile4.png',
// 		'/images/profile1.png',
// 	];

// 	// 로더 데이터에 이미지를 매핑하여 초기 상태를 설정합니다.
// 	const profiles = initialProfilesFromLoader.map((profile, index) => ({
// 		id: profile.profileId,
// 		name: profile.name,
// 		image: profileImages[index % profileImages.length],
// 	}));

// 	// 새 프로필 추가 UI를 토글하기 위한 상태 
// 	const [isAdding, setIsAdding] = useState(false);

// 	return (
// 		<div className="profile-selector-container">
// 			<p>함께할 아이를 선택해 주세요</p>
// 			<div className="profile-list-wrapper">
// 				<div className="profile-list">
// 					{profiles.map((profile) => (
// 						<ProfileItem
// 							key={profile.id}
// 							profile={profile}
// 						/>
// 					))}
// 				</div>
// 				{/* isAdding' 상태가 false일 때만 '추가' 버튼 보이기 */}
// 				{!isAdding && (
// 					<button className="add-profile-button" onClick={() => setIsAdding(true)}>
// 						+
// 					</button>
// 				)}
// 			</div>
// 			{/* 'isAdding' 상태가 true이면 프로필 추가 폼 렌더링 */}
// 			{isAdding && (
// 				<AddChildProfileModal onClose={() => setIsAdding(false)} />
// 			)}
// 		</div>
// 	);
// }

// function AddChildProfileModal({ onClose }) {
// 	return (
// 		<div className="modal-overlay">
// 			<div className="modal-content">
// 				<Form method="post" className="add-profile-form" onSubmit={onClose}>
// 					<h3>새로운 자녀 프로필 추가</h3>
// 					<div className="add-profile-item">
// 						<p>이름</p>
// 						<input type="text" name="name" required />
// 					</div>
// 					<div className="add-profile-item">
// 						<p>생년월일</p>
// 						<input type="date" name="birthDate" required />
// 					</div>
// 					<div className="add-profile-item">
// 						<p>소속기관</p>
// 						<input type="text" name="institution" placeholder="(예: 새싹 유치원)" required />
// 					</div>
// 					<div className="form-buttons">
// 						<button type="button" onClick={onClose}>취소</button>
// 						<button type="submit">추가하기</button>
// 					</div>
// 				</Form>
// 			</div>
// 		</div>
// 	);
// }



// // 프로필 조회
// export async function loader({ request }) {
// 	const session = await getSession(request.headers.get("Cookie"));
// 	const token = session.get("accessToken");
// 	// 토큰이 없는 경우에 대한 처리
// 	if (!token) {
// 		redirect("/mypage/login");
// 		return [];
// 	}
// 	const profileListResult = await initProfileList(token);
// 	console.log(profileListResult.result)
// 	if (profileListResult?.isSuccess && profileListResult?.result?.profiles) {
// 		return profileListResult.result.profiles;
// 	}
// 	redirect("/mypage/login");
// 	return [];
// }



// // 자녀 프로필을 추가하고, 각 프로필에 접속하는 함수
// export async function action({ request }) {
// 	const session = await getSession(request.headers.get("Cookie"));
// 	const token = session.get("accessToken");

// 	if (!token) redirect("/mypage/login");

// 	const formData = await request.formData();
// 	const actionType = formData.get("_action");

// 	// [프로필 선택] 로직
// 	if (actionType === "selectProfile") {
// 		const profileId = formData.get("profileId");

// 		try {
// 			const result = await accessProfileToken(profileId, token);
// 			if (result.isSuccess) {
// 				// 기존 세션 초기화 + 새로 발급 받은 토큰 저장 및 페이지 전환
// 				const oldSession = await getSession(request.headers.get("Cookie"));
// 				await destroySession(oldSession);

// 				const newSession = await getSession();
// 				const newChildToken = result.result.accessToken;
// 				newSession.set("childAccessToken", newChildToken);
// 				const newProfileId = result.result.profileId;
// 				newSession.set("profileId", newProfileId);
// 				// const newName = result.result.name;
// 				// newSession.set("name", name);

// 				console.log("자녀접속토큰:", result)

// 				// 부모 <-> 자녀 UI분기
// 				if (result.result.profileType == "CHILD") {
// 					return redirect("/?user=child", {
// 						headers: {
// 							"Set-Cookie": await commitSession(newSession),
// 						},
// 					});
// 				} else {
// 					return redirect("/", {
// 						headers: {
// 							"Set-Cookie": await commitSession(newSession),
// 						},
// 					});
// 				}
// 			}
// 		} catch (error) {
// 			console.error("Profile access failed:", error);
// 		}
// 	}

// }
