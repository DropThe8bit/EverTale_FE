const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 목소리 등록
export async function registrationVoice(childAccessToken, voiceFile) {
	try {
		const apiFormData = new FormData();
		apiFormData.append('voiceFile', voiceFile);
		const response = await fetch(
			`${API_BASE_URL}/api/voices`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${childAccessToken}`
				},
				body: apiFormData,
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
		}
		return await response.json();

	} catch (error) {
		console.error("Failed to create story:", error);
		return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' };
	}
}

// 목소리 리스트 조회
export async function inquiryVoiceList(childAccessToken) {
	try {
		const response = await fetch(
			`${API_BASE_URL}/api/voices`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${childAccessToken}`
				},
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
		}
		return await response.json();

	} catch (error) {
		console.error("Failed to create story:", error);
		return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' };
	}
}

// 목소리로 씬 나레이션 생성
export async function createVoiceNarration(childAccessToken, voiceId, storyId, sceneId) {
	try {
		const response = await fetch(
			`${API_BASE_URL}/api/voices/${voiceId}/stories/${storyId}/scenes/${sceneId}`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${childAccessToken}`
				},
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
		}
		return response;

	} catch (error) {
		console.error("Failed to create story:", error);
		return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' };
	}
}

