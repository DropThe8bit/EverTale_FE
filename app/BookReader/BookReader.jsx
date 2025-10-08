import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import "~/styles/bookReader.css";
import { Link, useLoaderData, useNavigate, useParams, useSearchParams } from 'react-router';

import ReaderView from "~/components/bookReader/ReaderView"
import QuizView from "~/components/bookReader/QuizView"
import { getSession } from '~/auth/auth';
import { readingStoryfromBook } from '~/api/book.server';

export default function BookReader() {
  const navigate = useNavigate();
  const bookData = useLoaderData();
  const { storyId, pageNum } = useParams();

  const currentPageNumber = parseInt(pageNum, 10);

  const [searchParams] = useSearchParams();
  const currentMode = searchParams.get("mode");
  const user = searchParams.get("user");
  const title = searchParams.get("title");
  const author = searchParams.get("author");

  const isQuiz = currentMode === "quiz";

  // 퀴즈/읽기 모드 전환 링크 생성
  const readerLink = useMemo(() => {
    const params = new URLSearchParams({ user, title, author });
    return `/mybook/bookview/${storyId}/${pageNum}?${params.toString()}`;
  }, [storyId, pageNum, user, title, author]);

  const quizLink = useMemo(() => {
    const params = new URLSearchParams({ mode: 'quiz', user, title, author });
    return `/mybook/bookview/${storyId}/${pageNum}?${params.toString()}`;
  }, [storyId, pageNum, user, title, author]);

  const handleNextPage = () => {
    if (currentPageNumber < 8) {
      const nextPage = currentPageNumber + 1;
      const params = new URLSearchParams({ user, title, author });
      navigate(`/mybook/bookview/${storyId}/${nextPage}?${params.toString()}`);
    }
  };

  const handlePrevPage = () => {
    // 첫 페이지가 아닐 때만 이전 페이지로 이동
    if (currentPageNumber > 1) {
      const prevPage = currentPageNumber - 1;
      const params = new URLSearchParams({ user, title, author });
      navigate(`/mybook/bookview/${storyId}/${prevPage}?${params.toString()}`);
    }
  };

  const isFirstPage = currentPageNumber === 1;
  const isLastPage = currentPageNumber === bookData.length;


  const voices = ['엄마', '아빠'];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
    setIsOpen(false);
  };

  // '목소리 추가' 버튼 클릭 시 실행될 함수 (기능은 비워둠)
  const handleAddVoiceClick = () => {
    console.log("목소리 추가 버튼 클릭됨!");
    // 여기에 목소리 추가 화면으로 이동하는 로직 등을 추가
    setIsOpen(false); // 버튼 클릭 후 메뉴 닫기
  };

  return (
    <div className="book-layout">
      <div className="book-reader-view-layout">
        <div className="book-info-container">
          <div className="book-info">
            <div className="book-info-title">
              <h2>{title}</h2>
              <div className="voice-selector-container" ref={dropdownRef}>
                <button className="book-reader-voice-button" onClick={() => setIsOpen(!isOpen)}>
                  {selectedVoice} <span>{isOpen ? '⌃' : '⌵'}</span>
                </button>

                {isOpen && (
                  <div className="voice-dropdown-menu">
                    <p>목소리 선택하기</p>
                    <div className="voice-dropdown-separator"></div>
                    <div className="voice-list">
                      {voices.map((voice) => (
                        <div
                          key={voice}
                          className="voice-dropdown-item"
                          onClick={() => handleVoiceSelect(voice)}
                        >
                          {voice}
                        </div>
                      ))}
                    </div>
                    <div className="add-voice-section">
                      <button className="add-voice-button" onClick={handleAddVoiceClick}>
                        목소리 추가
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>
            <p>{author} 작가님</p>
          </div>
        </div>

        <div className="book-view-wrapper">
          <div className="bookmark-tab-wrapper">
            <div className="bookmark-tab-bar">
              <Link to={readerLink}>
                <div className={`bookmark-tab-button ${!isQuiz ? "button-active" : ""}`}>
                  책 읽기
                </div>
              </Link>
              <Link to={quizLink}>
                <div className={`bookmark-tab-button ${isQuiz ? "button-active" : ""}`}>
                  퀴즈
                </div>
              </Link>
            </div>
          </div>

          <div className="main-reader-wrapper">
            <button
              className="nav-arrow prev-arrow"
              onClick={handlePrevPage}
              disabled={isFirstPage}
            >
              ‹
            </button>

            <div className="book-cover-container" style={{ backgroundImage: `url(/images/book_cover.png)` }}>
              {isQuiz ? <QuizView /> : <ReaderView currentPage={bookData} />}
            </div>

            <button
              className="nav-arrow next-arrow"
              onClick={handleNextPage}
              disabled={isLastPage}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export async function loader({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");
  const storyId = params.storyId;
  const pageNum = params.pageNum;

  if (!childAccessToken) {
    return redirect(`/mypage/login`);
  }

  const bookData = await readingStoryfromBook(childAccessToken, storyId, pageNum);
  console.log(bookData)
  return bookData.result;
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const { storyId, pageNum } = params;

  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("childAccessToken")) return redirect("/mypage/login");
  const childAccessToken = session.get("childAccessToken");

  const actionType = formData.get("_action");

  // actionType에 따라 분기 처리
  if (actionType === 'registrationVoice') {
    const updatedContent = formData.get("storyText");
    const result = await registrationVoice(childAccessToken);
  }

  // else if (actionType === 'generateImage') {
  //   const sketch = formData.get("uploadedImage");
  //   const prompt = formData.get("description");

  //   const generatedImageUrl = await createSceneImage(childAccessToken, storyId, pageNum, sketch, prompt);

  //   return generatedImageUrl;
  // }
}