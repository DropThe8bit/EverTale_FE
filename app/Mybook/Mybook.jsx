import { useSearchParams, useLocation, Link, useLoaderData, redirect } from "react-router"
import "~/styles/mybook.css";

import MyCharacterView from "~/Mybook/MyCharacterView";
import MyStoryView from "~/Mybook/MyStoryView";
import { getSession } from "~/auth/auth";
import { inquiryMyStory, inquiryMyCharacter } from "~/api/book.server";

export default function MybookCollection() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // 'mycharacter' 또는 null
  const { username, summaries } = useLoaderData();

  const isCharacter = mode === "mycharacter";
  const isChildMode = searchParams.get("user") === "child";

  const storyLink = isChildMode
    ? "/mybook?user=child"
    : "/mybook";

  const characterLink = isChildMode
    ? "/mybook?mode=mycharacter&user=child"
    : "/mybook?mode=mycharacter";

  return (
    <div className="mybook-page">
      <h1>{username}님의 책장에 </h1><h1>오신것을 환영합니다</h1>

      <div className="mybook-tab-wrapper">

        <div className="mybook-tab-bar">
          <Link to={storyLink}>
            <div className={`mybook-tab-button ${!isCharacter ? "button-active" : ""}`}>
              스토리 모음
            </div>
          </Link>
          <Link to={characterLink}>
            <div className={`mybook-tab-button ${isCharacter ? "button-active" : ""}`}>
              주인공 모음
            </div>
          </Link>
        </div>
      </div>
      <div className="mybook-separator"></div>

      {isCharacter ? <MyCharacterView characterSummaries={summaries} /> : <MyStoryView storySummaries={summaries} />}

      {/* <div className="pagination">
        <button className="page-button" disabled>{"<"}</button>
        <button className="page-button active">1</button>
        <button className="page-button">2</button>
        <button className="page-button">3</button>
        <button className="page-button">{">"}</button>
      </div> */}
    </div>
  )

}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");
  const username = session.get("username");
  const profileId = session.get("profileId");

  if (!childAccessToken) {
    return redirect(`/mypage/login`);
  }
  console.log("세션에서 빼기",username, profileId, childAccessToken )
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");

  if (mode === 'mycharacter') {
    const myCharacterResult = await inquiryMyCharacter(childAccessToken);
    const characterSummaries = myCharacterResult?.result?.characterSummaries || [];
    return { username, summaries: characterSummaries };
    
  } else {
    const myStoryResult = await inquiryMyStory(childAccessToken, profileId);
    const storySummaries = myStoryResult?.result?.storySummaries || [];
    return { username, summaries: storySummaries };
  }
}
