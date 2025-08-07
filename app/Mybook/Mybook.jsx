import { useSearchParams, Link } from "react-router"
import "~/styles/mybook.css";

import MyCharacterView from "~/components/mybookDetail/MyCharacterView";
import MyStoryView from "~/components/mybookDetail/MyStoryView";

export default function MybookCollection() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // 'mycharacter' 또는 null

  const isCharacter = mode === "mycharacter";

  return (
    <div className="mybook-page">
      <h1>이화님의 책장에 </h1><h1>오신것을 환영합니다</h1>

      <div className="mybook-tab-wrapper">

        <div className="mybook-tab-bar">
          <Link to="/mybook?mode=story">
            <div className={`mybook-tab-button ${!isCharacter ? "button-active" : ""}`}>
              스토리 모음
            </div>
          </Link>
          <Link to="/mybook?mode=mycharacter">
            <div className={`mybook-tab-button ${isCharacter ? "button-active" : ""}`}>
              주인공 모음
            </div>
          </Link>
        </div>
      </div>
      <div className="mybook-separator"></div>

      {isCharacter ? <MyCharacterView /> : <MyStoryView />}

      <div className="pagination">
        <button className="page-button" disabled>{"<"}</button>
        <button className="page-button active">1</button>
        <button className="page-button">2</button>
        <button className="page-button">3</button>
        <button className="page-button">{">"}</button>
      </div>
    </div>
  )

}