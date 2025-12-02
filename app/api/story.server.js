const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 공통 JSON 요청
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
    return { isSuccess: false, message: error.message, code: "FETCH_ERROR" };
  }
}

// 공통 FormData 요청
async function apiFormRequest(endpoint, method = "POST", token, formData) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return { isSuccess: false, message: error.message, code: "FETCH_ERROR" };
  }
}


// 최초 스토리 id 생성 
export function createStoryId(childAccessToken) {
  return apiRequest(`/api/stories/create`, "POST", childAccessToken);
}

// 캐릭터 생성 
export function createCharacter(childAccessToken, storyId, characterData, initCharacterImage) {
  const form = new FormData();
  form.append("request", new Blob([characterData], { type: "application/json" }));
  form.append("initCharacterImage", initCharacterImage);
console.log("이미지 데이터",initCharacterImage)
  return apiFormRequest(`/api/stories/${storyId}/character-info`, "POST", childAccessToken, form);
}

// 초기 스토리 생성 
export function createInitStory(childAccessToken, storyId, initStoryData) {
  return apiRequest(
    `/api/stories/${storyId}/init-story`,
    "POST",
    childAccessToken,
    initStoryData
  );
}

// 스토리 수정 
export function updateSceneStory(childAccessToken, storyId, pageNum, updatedContent) {
  return apiRequest(
    `/api/stories/${storyId}/scenes/${pageNum}`,
    "PATCH",
    childAccessToken,
    updatedContent
  );
}

// 각 페이지 이미지 생성 
export function createSceneImage(childAccessToken, storyId, pageNum, sketch, prompt) {
  const form = new FormData();
  form.append("prompt", prompt);
  form.append("sketch", sketch);

  return apiFormRequest(
    `/api/stories/${storyId}/scenes/${pageNum}/controlnet`,
    "POST",
    childAccessToken,
    form
  );
}

// 다음 페이지 질문 생성 
export function createNextSceneQuestion(childAccessToken, storyId, pageNum) {
  return apiRequest(
    `/api/stories/${storyId}/scenes/${pageNum}/question`,
    "POST",
    childAccessToken
  );
}

// 질문/답으로 다음 스토리 생성 
export function createNextStoryfromAnswer(childAccessToken, storyId, pageNum, question, answer) {
  return apiRequest(
    `/api/stories/${storyId}/scenes/${pageNum}/next-from-answer`,
    "POST",
    childAccessToken,
    { question, answer }
  );
}

// 스토리 제목 설정 
export function setStoryTitle(childAccessToken, storyId, title) {
  const encoded = encodeURIComponent(title);
  return apiRequest(
    `/api/stories/${storyId}/title?title=${encoded}`,
    "PATCH",
    childAccessToken
  );
}
