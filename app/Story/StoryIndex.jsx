
import { redirect } from "react-router"; 
import { createStoryId } from "~/api/story.server";
import { getSession } from "~/auth/auth.js";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("childAccessToken")) {
    return redirect("/mypage/login");
  }
  const childAccessToken = session.get("childAccessToken");
  const result = await createStoryId(childAccessToken);
  // console.log(result)

  if (result?.isSuccess && result?.result) {
    const storyId = result.result;
    return redirect(`/story/${storyId}`);
  }
  return redirect("/mypage/login");
}


export default function StoryIndexPage() {
  return null;
}
