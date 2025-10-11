const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function registrationVoice(childAccessToken, voiceFile) {
	try {
		const apiFormData = new FormData();
		apiFormData.append('voiceFile', voiceFile);
		console.log("목소리 등록 얍!");
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


export async function createVoiceNarration(childAccessToken, voiceId, storyId, sceneId) {
	try {
		console.log("목소리 출력 얍!");
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
