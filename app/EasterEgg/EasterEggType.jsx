
import { useEffect, useRef, useState } from "react";
import { Form, Link, redirect, useLoaderData, useNavigate, useSubmit } from "react-router";
import { inquiryGetCreatableLetterEasterEggBooks, inquiryGetCreatableVoiceEasterEggBooks, inquiryGetCreatedLetterEasterEggBooks, inquiryGetCreatedVoiceEasterEggBooks } from "~/api/easteregg.server";
import { getSession } from "~/auth/auth";
import "~/styles/easterEgg.css"

export default function EasterEggType() {
  const { voiceSummaries, completeVoiceSummaries, letterSummaries, completeLetterSummaries } = useLoaderData();
  // const voiceSummaries = voiceSummaries.filter(book => {
  //   return book && book.storyId && book.imageUrl && book.title;
  // });

  // const completeSummaries = completeBooksSummaries.filter(book => {
  //   return book && book.storyId && book.imageUrl && book.title;
  // });

  const summariesScrollRef = useRef(null);
  const completeScrollRef = useRef(null);

  const handleScrollLeft = () => {
    if (summariesScrollRef.current) {
      summariesScrollRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };
  const handleScrollRight = () => {
    if (summariesScrollRef.current) {
      summariesScrollRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };
  const handleCompleteScrollLeft = () => {
    if (completeScrollRef.current) {
      completeScrollRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };
  const handleCompleteScrollRight = () => {
    if (completeScrollRef.current) {
      completeScrollRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  const [selectedType, setSelectedType] = useState('');
  const [selectedStoryId, setSelectedStoryId] = useState('');
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  // selectedType 또는 selectedStoryId가 변경될 때마다 실행
  useEffect(() => {
    // 첫 렌더링 시에는 실행 방지
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (selectedType && selectedStoryId) {
      navigate(`/easter/${selectedType}/${selectedStoryId}`);
    }
  }, [selectedType, selectedStoryId, navigate]);


  let summaries = []; // 기본값: 빈 배열
  let completeSummaries = [];

  if (selectedType === 'voice') {
    summaries = voiceSummaries.filter(book => {
      return book && book.storyId && book.imageUrl && book.title;
    });
    completeSummaries = completeVoiceSummaries.filter(book => {
      return book && book.storyId && book.imageUrl && book.title;
    });
  } else if (selectedType === 'letter') {
    summaries = letterSummaries.filter(book => {
      return book && book.storyId && book.imageUrl && book.title;
    });
    completeSummaries = completeLetterSummaries.filter(book => {
      return book && book.storyId && book.imageUrl && book.title;
    });
  }


  return (
    <div className="easteregg-container">
      <div className="easteregg-title">
        <h1>이스터에그</h1>
        <p>부모와 아이의 상호작용을 돕는 이스터에그 시스템입니다.<br />
          원하는 시간대를 설정해서 아이에게 미래형 메세지를 보낼 수 있어요</p>
      </div>
      <Form method="post">
        <div className="easteregg-type-select">
          <label className={`easteregg-type ${selectedType === 'voice' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="type"
              value="voice"
              checked={selectedType === 'voice'}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ display: 'none' }}
            />
            <img src="/images/hidden_message.png" alt="hidden voice" />
            <p>숨은 메세지 찾기</p>
          </label>
          <label className={`easteregg-type ${selectedType === 'letter' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="type"
              value="letter"
              checked={selectedType === 'letter'}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ display: 'none' }}
            />
            <img src="/images/love_letter.png" alt="hidden Letter" />
            <p>사랑의 편지</p>
          </label>
        </div>

        {selectedType && (
          <>
            <div className="easteregg-tab-wrapper">
              <div className="easteregg-tab-bar">
                <div className="easteregg-tab-button">
                  이스터에그 만들기
                </div>
              </div >
            </div>
            <div className="easteregg-separator"></div>

            <div className="easteregg-books-container">
              {summaries && summaries.length > 0 ? (
                <div className="arrow-type" onClick={handleScrollLeft}>
                  <img src="/images/left_arrow.png" alt="scroll left" />
                </div>
              ) : ([])}

              <div className="easteregg-book-grid" ref={summariesScrollRef}>
                {summaries && summaries.length > 0 ? (
                  summaries.map((book) => (
                    <label
                      key={book.storyId}
                      className={`easteregg-book-card ${selectedStoryId === book.storyId ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="storyId"
                        value={book.storyId}
                        checked={selectedStoryId === book.storyId}
                        onChange={(e) => setSelectedStoryId(e.target.value)}
                        style={{ display: 'none' }}
                      />
                      <img src={book.imageUrl} alt={book.title} />
                      <div className="easteregg-book-title">{book.title}</div>
                    </label>
                  ))
                ) : (
                  <p className="easteregg-empty-message">
                    생성 가능한 책이 없습니다.
                  </p>
                )}
              </div>
              {summaries && summaries.length > 0 ? (
                <div className="arrow-type" onClick={handleScrollRight}>
                  <img src="/images/right_arrow.png" alt="scroll right" />
                </div>
              ) : ([])}
            </div>
          </>
        )}
      </Form>

      {selectedType && (
        <>
          <div className="easteregg-tab-wrapper">
            <div className="easteregg-tab-bar">
              <div className="check-tab-button">
                만들어진 이스터에그 확인하기
              </div>
            </div >
          </div>
          <div className="easteregg-separator"></div>
          <div className="easteregg-books-container">
            {completeSummaries && completeSummaries.length > 0 ? (
              <div className="arrow-type" onClick={handleCompleteScrollLeft}>
                <img src="/images/left_arrow.png" alt="scroll left" />
              </div>
            ) : ([])}
            <div className="easteregg-book-grid" ref={completeScrollRef}>
              {completeSummaries && completeSummaries.length > 0 ? (
                completeSummaries.map((book, index) => (
                  <div key={index} className="easteregg-book-card">
                    <Link to={`/mybook/bookview/${book.storyId}/1?title=${book.title}&author=${book.authorName}`} >
                      <img src={book.imageUrl} alt={book.title} />
                      <div className="easteregg-book-title">{book.title}</div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="easteregg-empty-message">
                  완성된 이스터에그가 없습니다.
                </p>
              )}
            </div>
            {completeSummaries && completeSummaries.length > 0 ? (
              <div className="arrow-type" onClick={handleCompleteScrollRight}>
                <img src="/images/right_arrow.png" alt="scroll right" />
              </div>
            ) : ([])}
          </div>
        </>
      )}
    </div >

  )
}


export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");
  const profileId = session.get("profileId");

  if (!childAccessToken) {
    return redirect(`/mypage/login`);
  }

  const [
    easterEggVoiceStories,
    completeEasterEggVoiceStories,
    easterEggMessageStories,
    completeEasterEggMessageStories,
  ] = await Promise.all([
    inquiryGetCreatedVoiceEasterEggBooks(childAccessToken, profileId),
    inquiryGetCreatableVoiceEasterEggBooks(childAccessToken, profileId),
    inquiryGetCreatedLetterEasterEggBooks(childAccessToken, profileId),
    inquiryGetCreatableLetterEasterEggBooks(childAccessToken, profileId),
  ]);

  const voiceSummaries = easterEggVoiceStories?.result?.easterEggVoiceStories?.storySummaries || [];
  const completeVoiceSummaries = completeEasterEggVoiceStories?.result?.easterEggVoiceStories?.storySummaries || [];
  const letterSummaries = easterEggMessageStories?.result?.easterEggVoiceStories?.storySummaries || [];
  const completeLetterSummaries = completeEasterEggMessageStories?.result?.easterEggVoiceStories?.storySummaries || [];

  return {
    voiceSummaries: voiceSummaries,
    completeVoiceSummaries: completeVoiceSummaries,
    letterSummaries: letterSummaries,
    completeLetterSummaries: completeLetterSummaries,
    view: 'eastereggstories'
  };
}

