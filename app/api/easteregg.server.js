const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function inquiryGetCreatableVoiceEasterEggBooks(childAccessToken, profileId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/eastereggs/voices/${profileId}/created?page=0&size=50&sort=title`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${childAccessToken}`
        },
        body: JSON.stringify(),
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

export async function inquiryGetCreatedVoiceEasterEggBooks(childAccessToken, profileId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/eastereggs/voices/${profileId}/creatable?page=0&size=50&sort=title`,
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


export async function detectYoloModel(childAccessToken, storyId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/eastereggs/voices/${storyId}`,
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


export async function registrationEasterEggVoice(childAccessToken, voiceFile, storyId, requestDto) {
  try {
    const apiFormData = new FormData();
    apiFormData.append('voiceFile', voiceFile);
    apiFormData.append('requestDto', JSON.stringify(requestDto));
    console.log("이스터에그 목소리 등록 얍!");

    const response = await fetch(
      `${API_BASE_URL}/api/eastereggs/voices/${storyId}`,
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

export async function clickEasterEggVoice(childAccessToken, sceneId, clickDto) {
  try {
    console.log("이스터에그 목소리 나와라 얍!", clickDto);
    const response = await fetch(
      `${API_BASE_URL}/api/eastereggs/voices/${sceneId}/play`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${childAccessToken}`
        },
        body: JSON.stringify(clickDto),
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


export async function inquiryGetCreatableLetterEasterEggBooks(childAccessToken, profileId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/eastereggs/letters/${profileId}/created?page=0&size=50&sort=title`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${childAccessToken}`
        },
        body: JSON.stringify(),
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

export async function inquiryGetCreatedLetterEasterEggBooks(childAccessToken, profileId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/eastereggs/letters/${profileId}/creatable?page=0&size=50&sort=title`,
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

export async function createEasterEggLetter(childAccessToken, storyId, content, imageNum, availableAt) {
  try {
    const apiFormData = {
      content: content,
      imageNum: imageNum,
      availableAt: availableAt
    };
    console.log("이스터에그 편지등록 얍!", apiFormData, storyId);

    const response = await fetch(
      `${API_BASE_URL}/api/eastereggs/${storyId}/letters`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${childAccessToken}`
        },
        body: JSON.stringify(apiFormData),
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


export async function showEasterWggLetter(childAccessToken, storyId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/eastereggs/${storyId}/letters`,
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