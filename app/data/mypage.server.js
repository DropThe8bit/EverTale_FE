const API_BASE_URL = "13.124.246.144:8080";

export async function signUpUser(userData) { // e.g., userData = { email: 'test@example.com', password: 'password123' }
  try {
    const response = await fetch(
      `http://${API_BASE_URL}/auth/signup`, // 'https'가 아닌 'http'일 수 있습니다. 서버 환경에 맞춰주세요.
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      // 서버에서 보낸 에러 메시지를 포함하면 디버깅에 더 유용합니다.
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Failed to sign up:", error);
    return null;
  }
}