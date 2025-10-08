import { redirect, useLoaderData, useSearchParams } from "react-router";
import ParentPage from "~/Mypage/ParentPage.jsx";
import ChildPage from "~/Mypage/ChildPage.jsx"
import { getSession } from "~/auth/auth";
import { accessMyProfileInfo } from "~/api/mypage.server";

export default function IndexMypage() {
  const [searchParams] = useSearchParams();
  const isChildUser = searchParams.get("user") == "child";
  const { username, profileData } = useLoaderData();

  return (
    <div>
      {isChildUser ? (
        <>
          <ChildPage profile={profileData} />
        </>
      ) : (
        <>
          <ParentPage username={username} profile={profileData} />
        </>
      )}
    </div>
  )
}


export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");
  const username = session.get("username");

  if (!childAccessToken) {
    console.log("토큰 만료 expire");
    return redirect(`/mypage/login`);
  }

  try {
    const myProfileDataResult = await accessMyProfileInfo(childAccessToken);

    if (myProfileDataResult?.isSuccess) {
      const myProfileDataSummaries = myProfileDataResult?.result || [];
      return { username, profileData: myProfileDataSummaries };

    } else {
      // 토큰이 만료되었을 때 
      console.log("API indicated failure, possibly expired token:", myProfileDataResult.message);
      return redirect(`/mypage/login`);
    }

  } catch (error) {
    console.error("loader에서 심각한 오류 발생:", error);
    return redirect(`/mypage/login`);
  }
}

