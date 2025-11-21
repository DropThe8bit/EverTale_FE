const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function signUpUser(userData) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/signup`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to sign up:", error);
    return null;
  }
}

export async function loginUser(loginData) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/login`,  
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to sign up:", error);
    return null;
  }
}


export async function loginNaverUser(code, state) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/naver-login?code=${code}&state=${state}`,  
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to sign up:", error);
    return null;
  }
}


export async function createParentProfile(token) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/profiles/parent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );

    // 생성에 성공한 경우 (HTTP 200 OK 또는 201 Created)
    if (response.ok) {
      return await response.json();
    }
    
    if (response.status === 409) {
      console.log("프로필이 이미 존재하므로, 생성을 건너뛰고 성공으로 처리합니다.");
      return { isSuccess: true, message: "프로필이 이미 존재합니다." };
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);

  } catch (error) {
    console.error("Failed to create story:", error);
    return { isSuccess: false, message: error.message, code: 'FETCH_ERROR' }; 
  }
}


export async function initProfileList(token) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/profiles/all`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
    console.error("Failed to sign up:", error);
    return null;
  }
}


export async function childProfileList(token) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/profiles/child`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
    console.error("Failed to sign up:", error);
    return null;
  }
}


export async function createChildProfile(token, newProfileData) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/profiles/child`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProfileData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to sign up:", error);
    return null;
  }
}

export async function accessProfileToken(profileId, token) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/profiles/${profileId}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to sign up:", error);
    return null;
  }
}

// export async function accessRefreshToken(profileId, token) {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/api/auth/profiles/reissue${profileId}`, 
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Failed to sign up:", error);
//     return null;
//   }
// }

export async function accessMyProfileInfo(token) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/profiles/my`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to sign up:", error);
    return null;
  }
}

export async function logoutUser(childAccessToken) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/logout`,  
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
    console.error("Failed to sign up:", error);
    return null;
  }
}

export async function profileLogoutUser(childAccessToken) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/profiles/logout`,  
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
    console.error("Failed to sign up:", error);
    return null;
  }
}
