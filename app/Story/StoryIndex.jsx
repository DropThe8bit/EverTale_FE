
import { redirect } from "react-router";
import { createStoryId } from "~/api/story.server";
import { getSession } from "~/auth/auth.js";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString(); // "user=child" 같은 문자열이 됩니다.

  if (!session.has("childAccessToken")) {
    return redirect("/mypage/login");
  }
  const childAccessToken = session.get("childAccessToken");
  const result = await createStoryId(childAccessToken);

  if (result?.isSuccess && result?.result) {
    const storyId = result.result;

    // 기본 리다이렉트 경로
    let redirectPath = `/story/${storyId}`;
    // user=child 이면 경로 뒤에 붙여주기
    if (searchParams) {
      redirectPath += `?${searchParams}`;
    }
    return redirect(redirectPath);
  }
  return redirect("/mypage/login");
}


export default function StoryIndexPage() {
  return null;
}
