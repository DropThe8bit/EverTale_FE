import { useLoaderData, useNavigate, Form, redirect } from "react-router"; // react-router-dom 사용 가정
import { childProfileList } from '~/api/mypage.server';
import { getSession, commitSession } from '~/auth/auth.js';
import "~/styles/profileSelect.css";

function ProfileItem({ profile }) {
  return (
    <div className="profile-item">
      <Form method="post">
        <input type="hidden" name="profileId" value={profile.id} />
        <input type="hidden" name="profileName" value={profile.name} />
        <input type="hidden" name="_action" value="selectProfile" />
        <button type="submit" className="profile-item-button">
          <div className="profile-avatar-wrapper">
            <img src={profile.image} alt={profile.name} className="profile-avatar" />
          </div>
          <div className="profile-name">{profile.name}</div>
        </button>
      </Form>
    </div>
  );
}

export default function ChildProfileSelect() {
  const childProfilesList = useLoaderData() || [];

  const profileImages = [
    '/images/profile2.png',
    '/images/profile3.png',
    '/images/profile4.png',
    '/images/profile1.png',
  ];

  // 로더 데이터에 이미지를 매핑하여 초기 상태를 설정합니다.
  const profiles = childProfilesList.map((profile, index) => ({
    id: profile.profileId,
    name: profile.name,
    image: profileImages[index % profileImages.length],
  }));

  return (
    <div className="profile-selector-container">
      <p>함께할 아이를 선택해 주세요</p>
      <div className="profile-list-wrapper">
        <div className="profile-list">
          {profiles.map((profile) => (
            <ProfileItem
              key={profile.id}
              profile={profile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


// 프로필 조회
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("accessToken");
  // 토큰이 없는 경우에 대한 처리
  if (!token) {
    redirect("/mypage/login");
    return [];
  }
  const childProfileListResult = await childProfileList(token);
  console.log(childProfileListResult.result)
  if (childProfileListResult?.isSuccess && childProfileListResult?.result?.profiles) {
    return childProfileListResult.result.profiles;
  }
  redirect("/mypage/login");
  return [];
}



export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("accessToken");

  if (!token) redirect("/mypage/login");

  const formData = await request.formData();
  const actionType = formData.get("_action");

  // [프로필 선택] 로직
  if (actionType === "selectProfile") {
    const profileId = formData.get("profileId");
    const profileName = formData.get("profileName");
    console.log("그외 세션 저장:", profileId, profileName)

    try {
      // 무조건 부모 인터페이스로  
      session.set("profileId", profileId);
      session.set("username", profileName);
      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (error) {
      console.error("Profile access failed:", error);
    }
  }

}
