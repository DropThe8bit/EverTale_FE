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

export async function createCharater(childAccessToken, storyId, characterData, initCharacterImage ) {
	// console.log(childAccessToken)
  try {
		const apiFormData = new FormData();
    apiFormData.append(
      'request',
      new Blob([JSON.stringify(characterData)], { type: "application/json" })
    );

    apiFormData.append('initCharacterImage', initCharacterImage);

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
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
		}
		return await response.json();

	} catch (error) {
    console.error("Failed to create story:", error);
    return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' }; 
  }
}
