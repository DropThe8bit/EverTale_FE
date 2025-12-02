const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 공통 GET/POST(JSON) 요청 유틸
async function apiRequest(endpoint, method = "GET", token, body = null) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    return await response.json();

  } catch (error) {
    console.error("API 요청 오류:", error);
    return { isSuccess: false, message: error.message, code: "FETCH_ERROR" };
  }
}

// formData 요청 유틸 (파일 업로드용)
async function apiFormRequest(endpoint, method = "POST", token, formData) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`
        // Content-Type 넣지 말아야 form boundary 자동 생성됨
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    return await response.json();

  } catch (error) {
    console.error("API 요청 오류:", error);
    return { isSuccess: false, message: error.message, code: "FETCH_ERROR" };
  }
}


// 만들 수 있는 음성 이스터에그 동화 조회 
export function inquiryGetCreatableVoiceEasterEggBooks(childAccessToken, profileId) {
  return apiRequest(
    `/api/eastereggs/voices/${profileId}/created?page=0&size=50&sort=title`,
    "GET",
    childAccessToken
  );
}

// 이미 생성된 음성 이스터에그 동화 조회 
export function inquiryGetCreatedVoiceEasterEggBooks(childAccessToken, profileId) {
  return apiRequest(
    `/api/eastereggs/voices/${profileId}/creatable?page=0&size=50&sort=title`,
    "GET",
    childAccessToken
  );
}

// YOLO 감지 
export function detectYoloModel(childAccessToken, storyId) {
  return apiRequest(
    `/api/eastereggs/voices/${storyId}`,
    "GET",
    childAccessToken
  );
}

// 음성 이스터에그 등록 
export function registrationEasterEggVoice(childAccessToken, voiceFile, storyId, requestDto) {
  const form = new FormData();
  form.append("voiceFile", voiceFile);
  form.append("requestDto", JSON.stringify(requestDto));

  return apiFormRequest(
    `/api/eastereggs/voices/${storyId}`,
    "POST",
    childAccessToken,
    form
  );
}

// 음성 이스터에그 클릭 후 재생
export function clickEasterEggVoice(childAccessToken, sceneId, clickDto) {
  return apiRequest(
    `/api/eastereggs/voices/${sceneId}/play`,
    "POST",
    childAccessToken,
    clickDto
  );
}

// 생성 가능한 편지 이스터에그 동화 조회 
export function inquiryGetCreatableLetterEasterEggBooks(childAccessToken, profileId) {
  return apiRequest(
    `/api/eastereggs/letters/${profileId}/created?page=0&size=50&sort=title`,
    "GET",
    childAccessToken
  );
}


// 이미 생성된 편지 이스터에그 동화 조회 
export function inquiryGetCreatedLetterEasterEggBooks(childAccessToken, profileId) {
  return apiRequest(
    `/api/eastereggs/letters/${profileId}/creatable?page=0&size=50&sort=title`,
    "GET",
    childAccessToken
  );
}

// 편지 이스터에그 생성
export function createEasterEggLetter(childAccessToken, storyId, content, imageNum, availableAt) {
  return apiRequest(
    `/api/eastereggs/${storyId}/letters`,
    "POST",
    childAccessToken,
    {
      content,
      imageNum,
      availableAt
    }
  );
}

// 편지 이스터에그 조회
export function showEasterWggLetter(childAccessToken, storyId) {
  return apiRequest(
    `/api/eastereggs/${storyId}/letters`,
    "GET",
    childAccessToken
  );
}
