const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function registrationVoice(childAccessToken) {
	try {
		const response = await fetch(
			`${API_BASE_URL}/api/voices`,
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
		return await response.json();

	} catch (error) {
		console.error("Failed to create story:", error);
		return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' };
	}
}
