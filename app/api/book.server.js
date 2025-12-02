const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 공통 요청 함수
async function apiRequest(endpoint, method = "GET", token, body = null) {
	try {
		const options = {
			method,
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": body ? "application/json" : undefined
			},
			body: body ? JSON.stringify(body) : undefined
		};

		const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: "서버가 JSON 형식의 에러 메시지를 반환하지 않았습니다."
			}));

			console.error("외부 API 서버 에러:", errorData);
			throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
		}

		return await response.json();

	} catch (error) {
		console.error("API 요청 오류:", error);
		return { isSuccess: false, message: error.message, code: "FETCH_ERROR" };
	}
}

// 전체 스토리 조회
export function inquiryAllStory(childAccessToken) {
	return apiRequest(`/api/stories?page=0&size=100&sort=title`, "GET", childAccessToken);
}

// 내 스토리 조회
export function inquiryMyStory(childAccessToken, profileId) {
	return apiRequest(`/api/stories/${profileId}?page=0&size=20&sort=title`, "GET", childAccessToken);
}

// 내 캐릭터 조회
export function inquiryMyCharacter(childAccessToken, profileId) {
	return apiRequest(`/api/characters/list/${profileId}?page=0&size=20&sort=name`, "GET", childAccessToken);
}

// 캐릭터 상세 조회
export function detailMyCharacter(childAccessToken, characterId) {
	return apiRequest(`/api/characters/${characterId}?page=0&size=20&sort=name`, "GET", childAccessToken);
}

// 특정 스토리 페이지 읽기
export function readingStoryPage(childAccessToken, storyId, pageNum) {
	return apiRequest(`/api/stories/${storyId}/scenes/${pageNum}`, "GET", childAccessToken);
}

// 스토리 전체 페이지 읽기
export function readingStoryAllPage(childAccessToken, storyId) {
	return apiRequest(`/api/stories/${storyId}/scenes`, "GET", childAccessToken);
}

// 퀴즈 생성
export function createQuiz(childAccessToken, storyId) {
	return apiRequest(`/api/stories/${storyId}/quizzes`, "POST", childAccessToken);
}

// 전체 퀴즈 조회
export function inquiryAllQuiz(childAccessToken, storyId) {
	return apiRequest(`/api/stories/${storyId}/quizzes`, "GET", childAccessToken);
}

// 퀴즈 답변 제출
export function selectedAnswerQuiz(childAccessToken, quizId, selectedAnswer) {
	return apiRequest(
		`/api/quizzes/${quizId}/answer?selectedAnswer=${selectedAnswer}`,
		"POST",
		childAccessToken
	);
}

// 전체 퀴즈 결과 조회
export function responseAllQuiz(childAccessToken) {
	return apiRequest(`/api/quizzes/summary`, "GET", childAccessToken);
}
