import { useSearchParams, useLocation, Link, useLoaderData, redirect, useFetcher } from "react-router"
import "~/styles/mybook.css";

import MyCharacterView from "~/Mybook/MyCharacterView";
import MyStoryView from "~/Mybook/MyStoryView";
import { getSession } from "~/auth/auth";
import { inquiryMyStory, inquiryMyCharacter, detailMyCharacter } from "~/api/book.server";
import { useEffect, useState } from "react";


function ProfileModal({ character, onClose }) {
  // console.log("모달에 전달된 character 데이터:", character.reult);
  if (!character) {
    return null;
  }
  const [searchParams] = useSearchParams();
  const isChildMode = searchParams.get("user") === "child";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h1>{character.name}</h1>
        <hr className="separator" />
        <img className="profile-image" src={character.imageUrl} alt={character.name} />
        <div className="info-section">
          <p><strong>나이:</strong> {character.age}살</p>
          <p><strong>성별:</strong> {character.gender === 'FEMALE' ? '여자' : (character.gender === 'MALE' ? '남자' : '동물')}</p>
          <p><strong>성격:</strong> {character.personalities.join(', ')}</p>
        </div>
        <p className="story-protagonist">
          &lt;{character.storyTitle}&gt;의 주인공
        </p>
        <Link to={`/mybook/bookview/${character.storyId}/1?title=${encodeURIComponent(character.storyTitle)}&author=${encodeURIComponent(character.authorName)}
        ${isChildMode ? '&user=child' : ''}`} >
          <button className="action-button">
            책 읽으러 가기
          </button>
        </Link>
      </div>
    </div>
  );
}


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

  const characterFetcher = useFetcher();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (characterId) => {
    characterFetcher.load(`?charId=${characterId}`);
  };

  useEffect(() => {
    // fetcher가 데이터를 로딩했고(data가 null이 아님), 로딩 상태가 아니라면
    if (characterFetcher.data && characterFetcher.state === 'idle') {
      setIsModalOpen(true);
      console.log("모달에 전달된 character 데이터:", characterFetcher.data);
    }
  }, [characterFetcher.data, characterFetcher.state]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="mybook-page">
      <h1>{username}님의 책장에 </h1><h1>오신것을 환영합니다</h1>
      <div className="mybook-tab-wrapper">
        <div className="mybook-tab-bar">
          <Link to={storyLink}>
            <div className={`mybook-tab-button ${!isCharacter ? "button-active" : ""}`}>
              {!isCharacter && <img src="/images/mybook_selector.png" alt="선택됨" />}
              스토리 모음
            </div>
          </Link>
          <Link to={characterLink}>
            <div className={`mybook-tab-button ${isCharacter ? "button-active" : ""}`}>
              {isCharacter && <img src="/images/mybook_selector.png" alt="선택됨" />}
              주인공 모음
            </div>
          </Link>
        </div>
      </div>
      <div className="mybook-separator"></div>

      {isCharacter ? (
        <MyCharacterView
          characterSummaries={summaries}
          onCardClick={handleCardClick}
        />
      ) : (
        <MyStoryView storySummaries={summaries} />
      )}
      {isModalOpen && (
        <ProfileModal
          character={characterFetcher.data.result}
          onClose={handleCloseModal}
        />
      )}

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

  const url = new URL(request.url);
  const characterId = url.searchParams.get("charId");
  const mode = url.searchParams.get("mode");

  if (characterId) {
    const characterData = await detailMyCharacter(childAccessToken, characterId);
    // console.log(characterData);
    return characterData;
  }

  if (mode === 'mycharacter') {
    const myCharacterResult = await inquiryMyCharacter(childAccessToken, profileId);
    const characterSummaries = myCharacterResult?.result?.characterSummaries || [];
    return { username, summaries: characterSummaries, view: 'characters' };
  }

  else {
    const myStoryResult = await inquiryMyStory(childAccessToken, profileId);
    const storySummaries = myStoryResult?.result?.storySummaries || [];
    return { username, summaries: storySummaries, view: 'stories' };

  }
}
