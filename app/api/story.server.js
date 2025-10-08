const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createStoryId(childAccessToken) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/stories/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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


export async function createCharacter(childAccessToken, storyId, characterData, initCharacterImage) {
  try {
    const apiFormData = new FormData();
    apiFormData.append(
      'request',
      new Blob([characterData], { type: "application/json" })
    );
    apiFormData.append('initCharacterImage', initCharacterImage);
    console.log("캐릭터 만들기 얍!")

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/character-info`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${childAccessToken}`
        },
        body: apiFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "서버가 JSON 형식의 에러 메시지를 반환하지 않았습니다."
      }));
      // console.error("외부 API 서버가 반환한 에러:", errorData);
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    return await response.json();

  } catch (error) {
    console.error("Failed to create story:", error);
    return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' };
  }
}


export async function createInitStory(childAccessToken, storyId, initStoryData) {
  try {
    console.log("초기 스토리 만들기 얍!")

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/init-story`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${childAccessToken}`
        },
        body: JSON.stringify(initStoryData),
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


export async function updateSceneStory(childAccessToken, storyId, pageNum, updatedContent) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/scenes/${pageNum}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${childAccessToken}`
        },
        body: JSON.stringify(updatedContent),
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


export async function createSceneImage(childAccessToken, storyId, pageNum, sketch, prompt) {
  try {
    const apiFormData = new FormData();
    apiFormData.append('prompt', prompt);
    apiFormData.append('sketch', sketch);

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/scenes/${pageNum}/controlnet`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${childAccessToken}`
        },
        body: apiFormData,
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


export async function createNextSceneQuestion(childAccessToken, storyId, pageNum) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/scenes/${pageNum}/question`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${childAccessToken}`
        },
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



export async function createNextStoryfromAnswer(childAccessToken, storyId, pageNum, question, answer) {
  try {
    const requestData = {
      question: question,
      answer: answer,
    };
    console.log("다음 줄거리 만들기 얍!");

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/scenes/${pageNum}/next-from-answer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${childAccessToken}`
        },
        body: JSON.stringify(requestData),
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


export async function setStoryTitle(childAccessToken, storyId, title) {
  try {
    const encodedTitle = encodeURIComponent(title);
    console.log("제목 만들기 얍!", encodedTitle);

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/title?title=${encodedTitle}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${childAccessToken}`
        },
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


export async function inquiryMyStory(childAccessToken) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/stories/4?page=0&size=20&sort=title`,
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
