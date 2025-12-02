const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 공통 JSON 요청 유틸
async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  try {
    const headers = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (body) headers["Content-Type"] = "application/json";

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

// 회원가입
export function signUpUser(userData) {
  return apiRequest(`/api/auth/signup`, "POST", userData);
}

// 일반 로그인
export function loginUser(loginData) {
  return apiRequest(`/api/auth/login`, "POST", loginData);
}

// 네이버 로그인
export function loginNaverUser(code, state) {
  return apiRequest(`/api/auth/naver-login?code=${code}&state=${state}`, "GET");
}

// 부모 프로필 생성
export async function createParentProfile(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profiles/parent`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) return await response.json();

    if (response.status === 409) {
      return { isSuccess: true, message: "프로필이 이미 존재합니다." };
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  } catch (error) {
    console.error("Failed to create parent profile:", error);
    return { isSuccess: false, message: error.message, code: "FETCH_ERROR" };
  }
}

// 전체 프로필 목록 조회
export function initProfileList(token) {
  return apiRequest(`/api/profiles/all`, "GET", null, token);
}

// 아이 프로필 목록 조회
export function childProfileList(token) {
  return apiRequest(`/api/profiles/child`, "GET", null, token);
}

// 아이 프로필 생성
export function createChildProfile(token, newProfileData) {
  return apiRequest(`/api/profiles/child`, "POST", newProfileData, token);
}

// 프로필 전환 토큰 발급
export function accessProfileToken(profileId, token) {
  return apiRequest(`/api/profiles/${profileId}`, "POST", null, token);
}

// 내 프로필 정보 조회
export function accessMyProfileInfo(token) {
  return apiRequest(`/api/profiles/my`, "GET", null, token);
}

// 로그아웃
export function logoutUser(childAccessToken) {
  return apiRequest(`/api/auth/logout`, "POST", null, childAccessToken);
}

// 프로필 로그아웃
export function profileLogoutUser(childAccessToken) {
  return apiRequest(`/api/auth/profiles/logout`, "POST", null, childAccessToken);
}

// 알람 조회
export function inquiryAlarm(childAccessToken) {
  return apiRequest(`/api/alarms?page=0&size=50&sort=alarmType`, "GET", null, childAccessToken);
}

// 알람 읽음 처리
export function changeStateAlarm(childAccessToken, alarmId) {
  return apiRequest(`/api/alarms/${alarmId}`, "POST", null, childAccessToken);
}
