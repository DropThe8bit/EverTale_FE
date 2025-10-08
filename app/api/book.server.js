const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function inquiryAllStory(childAccessToken) {
	try {
		const response = await fetch(
			`${API_BASE_URL}/api/stories?page=0&size=20&sort=title`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${childAccessToken}`
				},
				body: JSON.stringify(),
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: "서버가 JSON 형식의 에러 메시지를 반환하지 않았습니다."
			}));
			console.error("외부 API 서버가 반환한 에러:", errorData);
			throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
		}
		return await response.json();

	} catch (error) {
		console.error("Failed to create story:", error);
		return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' };
	}
}


export async function inquiryMyStory(childAccessToken, profileId) {
	try {
		const response = await fetch(
			`${API_BASE_URL}/api/stories/${profileId}?page=0&size=20&sort=title`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${childAccessToken}`
				},
				body: JSON.stringify(),
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: "서버가 JSON 형식의 에러 메시지를 반환하지 않았습니다."
			}));
			console.error("외부 API 서버가 반환한 에러:", errorData);
			throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
		}
		return await response.json();

	} catch (error) {
		console.error("Failed to create story:", error);
		return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' };
	}
}


export async function inquiryMyCharacter(childAccessToken) {
	try {
		const response = await fetch(
			`${API_BASE_URL}/api/characters?page=0&size=20&sort=name`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${childAccessToken}`
				},
				body: JSON.stringify(),

			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: "서버가 JSON 형식의 에러 메시지를 반환하지 않았습니다."
			}));
			console.error("외부 API 서버가 반환한 에러:", errorData);
			throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
		}
		return await response.json();

	} catch (error) {
		console.error("Failed to create story:", error);
		return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' };
	}
}


export async function readingStoryfromBook(childAccessToken, storyId, pageNum) {
	try {
		const response = await fetch(
			`${API_BASE_URL}/api/stories/${storyId}/scenes/${pageNum}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${childAccessToken}`
				},
				body: JSON.stringify(),
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: "서버가 JSON 형식의 에러 메시지를 반환하지 않았습니다."
			}));
			console.error("외부 API 서버가 반환한 에러:", errorData);
			throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
		}
		return await response.json();

	} catch (error) {
		console.error("Failed to create story:", error);
		return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' };
	}
}


