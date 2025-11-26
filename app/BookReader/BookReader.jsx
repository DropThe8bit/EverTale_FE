import React, { useEffect, useMemo, useRef, useState } from 'react';
import "~/styles/bookReader.css";
import { Form, Link, redirect, useFetcher, useLoaderData, useNavigate, useParams, useSearchParams } from 'react-router';

import ReaderView from "~/components/bookReader/ReaderView"
import QuizView from "~/components/bookReader/QuizView"
import { getSession } from '~/auth/auth';
import { createQuiz, inquiryAllQuiz, readingStoryPage, responseAllQuiz, selectedAnswerQuiz } from '~/api/book.server';
import { inquiryVoiceList, registrationVoice } from '~/api/voice.server';
import { clickEasterEggVoice, showEasterWggLetter } from '~/api/easteregg.server';


function VoiceRegistrationModal({ onClose }) {
  const [fileName, setFileName] = useState('');

  // 사용자가 파일을 선택했을 때 실행되는 함수
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };
  const fetcher = useFetcher();
  const isSuccess = fetcher.data?.success === true;
  const isSubmitting = fetcher.state === 'submitting';

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isSuccess ? (
          <SuccessView />
        ) : (
          <>
            <div className="voice-modal-content">
              <h2>목소리 등록하기</h2>
              <p>감정을 풍부하게 담아 아래 문장을 천천히 읽어주세요.<br />마이크를 가까이 두고 10초 이내로 녹음해 주세요.</p>
            </div>
            <div className="voice-modal-sample">
              <p>빗방울이 창문에 톡톡톡 떨어지며<br />'오늘도 수고했어'라고 말하는 것 같았어요.</p>
            </div>
            <div className="voice-upload-wrapper">
              <p className="upload-label-text">업로드할 음성 파일 (.wav, .mp3)<br />
                <h5>파일 이름이 등록될 목소리 이름이 됩니다. (예: 엄마.mp3, 아빠.wav)</h5>
              </p>
              <fetcher.Form method="post" encType="multipart/form-data">
                <input type="hidden" name="_action" value="registrationVoice" />

                <div className="upload-box">
                  <input
                    id="voice-file-upload"
                    type="file"
                    name="voiceFile"
                    accept=".wav, .mp3, audio/*" // 오디오 파일 필터링
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    required
                  />
                  <label htmlFor="voice-file-upload" className="upload-button">
                    파일 찾기
                  </label>
                  <span className="file-name-display">{fileName || "선택된 파일 없음"}</span>
                </div>
                <div className="modal-buttons">
                  <button type="button" onClick={onClose}>취소</button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '등록 중...' : '등록'}
                  </button>
                </div>
              </fetcher.Form>
            </div>
          </>)}
      </div >
    </div >
  );
}

function SuccessView() {
  return (
    <div className="success-view">
      <h3>등록 완료!</h3>
      <p>목소리가 성공적으로 등록되었어요!</p>
    </div>
  );
}

function ResultsQuizModal({ onClose, quizResult }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isChildMode = searchParams.get("user") === "child";

  const handleClick = () => {
    navigate(`/mybook${isChildMode ? '?user=child' : ''}`);
  };

  const handleBack = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('mode');
    setSearchParams(newParams);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <div className="modal-guide">
          <img src="/images/quiz_end.png" alt="quiz-end image" />
          <h4>{quizResult.badge}님</h4>
          <p>지금까지 총 {quizResult.correctAnswerCount}문제를 맞추셨어요!</p>
        </div>

        <div className="modal-buttons">
          <button onClick={handleBack}>책 읽기</button>
          <button onClick={handleClick}>책장으로 돌아가기</button>
        </div>
      </div >
    </div >
  );
}

function BookEndingModal({ onClose }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isChildMode = searchParams.get("user") === "child";

  const handleClick = () => {
    navigate(`/mybook${isChildMode ? '?user=child' : ''}`);
  };

  const handleQuiz = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('mode', 'quiz');
    setSearchParams(newParams);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <div className="modal-guide">
          <img src="/images/read_end.png" alt="read-end image" />
          <p>퀴즈를 푸시겠어요?</p>
        </div>

        <div className="modal-buttons">
          <button onClick={handleClick}>책장으로 돌아가기</button>
          <button onClick={handleQuiz}>퀴즈 풀기</button>
        </div>
      </div >
    </div >
  );
}

function EasterEggVoicePlayerModal({ audioUrl, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>숨은 메세지를 찾았어요!</h3><br />
        <audio controls autoPlay src={audioUrl} style={{ width: '100%' }}>
          오디오 재생을 지원하지 않습니다.
        </audio>

        <div className="modal-buttons" style={{ marginTop: '20px' }}>
          <button type="button" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

function LetterModal({ letterData, onConfirm }) {
  const { content, imageNum } = letterData;
  const imagePath = `/images/easteregg_letter_${imageNum}.png`;
  const [isClick, setIsClick] = useState(false);

  return (
    <>
      {!isClick ? (
        <div className="modal-overlay">
          <div className="letter-preview-modal-layout">
            <button
              type="button"
              className="letter-image-button"
              onClick={() => setIsClick(true)}
            >
              <img src="/images/arrive_letter.png" alt="arrive_letter" />
            </button>
            <div className="preview-letter-content">
              <p>편지가 도착했어요!<br />클릭해서 편지를 열어주세요.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="modal-overlay">
          <div className="letter-modal-layout">
            <button className="modal-close-button" onClick={onConfirm}>
              &times;
            </button>
            <div className="letter-modal-content">
              <img
                src={imagePath}
                alt={`편지 배경 이미지 ${imageNum}`}
                className="letter-background-image"
              />
              <div className="letter-content-overlay">
                <p className="letter-text">
                  {content.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <div className="letter-modal-buttons">
              <button type="button" onClick={onConfirm} className="confirm-letter-btn">
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


export default function BookReader() {
  const navigate = useNavigate();
  const { username, bookData } = useLoaderData();
  const { storyId, pageNum } = useParams();
  const sceneId = bookData.sceneId;
  const currentPageNumber = parseInt(pageNum, 10);

  const [searchParams] = useSearchParams();
  const currentMode = searchParams.get("mode");
  const user = searchParams.get("user");
  const title = searchParams.get("title");
  const author = searchParams.get("author");

  const isChildMode = user === "child";
  const isQuiz = currentMode === "quiz";



  // =============이스터에그 사랑의 편지 관리===============

  const letterFetcher = useFetcher();
  const [isShowLetterModal, setIsShowLetterModal] = useState(false);
  const [finalLetterContent, setFinalLetterContent] = useState(undefined); // null 대신 undefined로 초기화

  useEffect(() => {
    if (storyId && letterFetcher.state === 'idle' && finalLetterContent === undefined) {
      letterFetcher.load(`?fetch=showLetter`);
    }
  }, [letterFetcher, storyId, finalLetterContent]);

  useEffect(() => {
    if (letterFetcher.data && letterFetcher.state === 'idle' && finalLetterContent === undefined) {
      const data = letterFetcher.data;
      if (data?.isSuccess === false) {
        setFinalLetterContent(null);
      } else {
        setFinalLetterContent(data);
      }
    }
  }, [letterFetcher.data, letterFetcher.state, finalLetterContent]);


  // 편지 모달 닫고 엔딩 모달 열기
  const handleConfirmLetter = () => {
    setIsShowLetterModal(false); // 편지 모달 닫기
    setShowEndingModal(true);   // 엔딩 모달 열기
  };



  // ========퀴즈/읽기 모드 전환 링크==========
  const readerLink = useMemo(() => {
    const params = new URLSearchParams({ user, title, author });
    return `/mybook/bookview/${storyId}/${pageNum}?${params.toString()}`;
  }, [storyId, pageNum, user, title, author]);

  const quizLink = useMemo(() => {
    const params = new URLSearchParams({ mode: 'quiz', user, title, author });
    return `/mybook/bookview/${storyId}/${pageNum}?${params.toString()}`;
  }, [storyId, pageNum, user, title, author]);


  const isFirstPage = currentPageNumber === 1;
  const isLastPage = currentPageNumber === bookData.length;
  const [showEndingModal, setShowEndingModal] = useState(false);

  // 페이지별 스토리 관리
  const handleNextPage = () => {
    const nextPage = currentPageNumber + 1;
    const params = new URLSearchParams({ user, title, author });
    if (currentPageNumber < 8) {
      navigate(`/mybook/bookview/${storyId}/${nextPage}?${params.toString()}`);
    } else if (currentPageNumber >= 8) {
      if (author === username) { // 내 책일때만 이스터에그 볼 수 있음.
        if (finalLetterContent) {
          // 마지막 편지가 존재함 -> 편지 모달을 먼저 띄움
          setIsShowLetterModal(true);
        } else {
          // [마지막 편지가 없거나 미공개일 -> 엔딩 모달을 바로 띄움
          setShowEndingModal(true);
        }
      } else {
        setShowEndingModal(true);
      }
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

  const handleCloseEndingModal = () => {
    setShowEndingModal(false);
  };



  // ============음성 관리=============
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const dropdownRef = useRef(null);
  const voiceFetcher = useFetcher();
  const voiceNarrationFetcher = useFetcher();

  // 드롭다운 배경 클릭 
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

  useEffect(() => {
    if (isOpen && voiceFetcher.state === 'idle' && !voiceFetcher.data) {
      voiceFetcher.load('?fetch=voicesList');
    }
  }, [isOpen, voiceFetcher]);

  const playVoice = (voice) => {
    if (!voice) return; // 선택된 목소리가 없으면 아무것도 안 함
    console.log(`${voice.name} 목소리 재생 요청`);
    const formData = new FormData();
    formData.append('_action', 'playVoice');
    formData.append('voiceId', voice.voiceId);
    formData.append('sceneId', sceneId);
    voiceNarrationFetcher.submit(formData, { method: 'post' });
  };

  // 드롭다운 목록에서 목소리를 선택했을 때 즉시 실행
  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
    setIsOpen(false);
    playVoice(voice);
  };

  // 이미 선택된 목소리가 있다면 재생하고, 없다면 메뉴를 열기
  const handleMainButtonClick = () => {
    if (selectedVoice) {
      playVoice(selectedVoice);
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    // action이 반환한 audioUrl이 존재하면
    if (voiceNarrationFetcher.data?.audioUrl) {
      // 해당 URL로 오디오 객체를 만들어 재생합니다.
      const audio = new Audio(voiceNarrationFetcher.data.audioUrl);
      audio.play();
    }
  }, [voiceNarrationFetcher.data]);


  const handleAddVoiceClick = () => {
    setIsVoiceModalOpen(true);
    setIsOpen(false);
  };




  // =============퀴즈 관리===============
  const quizFetcher = useFetcher();
  const quizCreator = useFetcher();
  const answerFetcher = useFetcher();
  const quizResultFetcher = useFetcher();

  // 퀴즈 생성이 한 번 시도되었는지 추적하는 state
  const [hasAttemptedQuizCreation, setHasAttemptedQuizCreation] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showResultsModal, setShowResultsModal] = useState(false);

  useEffect(() => {
    if (!isQuiz) return;

    if (isQuiz && quizFetcher.state === 'idle' && !quizFetcher.data && quizFetcher.type !== 'action') {
      console.log("새로고침", quizFetcher.data)
      quizFetcher.load('?fetch=quiz');

      // 생성 시도 여부 초기화
      setHasAttemptedQuizCreation(false);
    }
  }, [isQuiz, quizFetcher.state, quizFetcher.data, quizFetcher.load, quizFetcher.type]);

  useEffect(() => {
    if (
      quizFetcher.data &&
      quizFetcher.state === 'idle' &&
      quizCreator.state === 'idle' &&
      !hasAttemptedQuizCreation
    ) {
      const quizzes = quizFetcher.data;
      if (Array.isArray(quizzes)) {

        // 4개에서 현재 퀴즈 개수를 뺀 '부족한 개수'를 계산
        const quizzesToCreate = 4 - quizzes.length;
        if (quizzesToCreate > 0) {
          setHasAttemptedQuizCreation(true); // 생성 시도 플래그

          const formData = new FormData();
          formData.append('_action', 'createQuizzes');
          formData.append('count', quizzesToCreate.toString());
          quizCreator.submit(formData, { method: 'post' });
        } else {
          console.log("퀴즈가 이미 4개 이상이므로 생성하지 않습니다.");
        }
      }
    }
  }, [quizFetcher.data, quizFetcher.state, quizCreator.state, hasAttemptedQuizCreation]);

  // 퀴즈 생성이 완료되면 퀴즈 목록을 다시 불러옴
  useEffect(() => {
    if (!isQuiz) return;

    if (quizCreator.data?.success && quizCreator.state === 'idle') {
      quizFetcher.load('?fetch=quiz');
    }
  }, [isQuiz, quizCreator.data, quizCreator.state, quizFetcher.load]);


  useEffect(() => {
    const result = answerFetcher.data?.result;
    if (result) {
      if (result.correct) {
        alert("정답입니다! 🥳");
      } else {
        alert("틀렸습니다. 😭");
      }
    }
  }, [answerFetcher.data]);

  const handleSubmitAnswer = (quizId, selectedAnswer) => {
    const formData = new FormData();
    formData.append('_action', 'selectedAnswerQuiz');
    formData.append('quizId', quizId);
    formData.append('selectedAnswer', selectedAnswer);
    answerFetcher.submit(formData, { method: 'post' });
  };

  const handleQuizCompletion = () => {
    quizResultFetcher.load('?fetch=quizResult');
  };

  useEffect(() => {
    if (!isQuiz) return;
    if (quizResultFetcher.data) {
      setShowResultsModal(true);
    }
  }, [isQuiz, quizResultFetcher.data]);

  // 모달을 닫는 함수
  const handleCloseModal = () => {
    setShowResultsModal(false);
  };



  // =============이스터에그 객체 클릭 관리===============
  const clickFetcher = useFetcher();
  const [voiceModalUrl, setVoiceModalUrl] = useState(null);

  // 자식 컴포넌트(StoryReaderView)에 prop으로 전달할 함수
  const handleImageClick = (coordinates) => {
    if (author === username) { // 내 책일때만 이스터에그 볼 수 있음.
      // coordinates가 null일 경우 기본값 0으로 처리
      const safeCoordinates = coordinates || { x: 0, y: 0 };
      const formData = new FormData();
      formData.append('_action', 'easterEggVoice');
      formData.append('sceneId', sceneId);
      formData.append('xcoordinate', 0);
      formData.append('ycoordinate', 0);
      formData.append('coordinates.x', safeCoordinates.x);
      formData.append('coordinates.y', safeCoordinates.y);
      clickFetcher.submit(formData, { method: 'post' });
    }
  };

  useEffect(() => {
    if (!clickFetcher.data || clickFetcher.state !== 'idle') return;
    const data = clickFetcher.data;

    switch (data.type) {
      case 'voice_url':
        setVoiceModalUrl(data.url);
        break;
      case 'no_voice':
        break;
      case 'message':
        break;
      default:
        console.warn("알 수 없는 clickFetcher 데이터 타입:", data.type);
    }
  }, [clickFetcher.data, clickFetcher.state, setVoiceModalUrl]);


  return (
    <div className="book-layout">
      <div className="book-reader-view-layout">
        <div className="book-info-container">
          <div className="book-info">
            <div className="book-info-title">
              <h2>{title}</h2>
              <div className="voice-selector-container" ref={dropdownRef}>
                <div className="book-reader-voice-button">
                  <div className="voice-button-text" onClick={handleMainButtonClick}>
                    {selectedVoice ? selectedVoice.name : '읽어주기'}
                  </div>
                  <div className="voice-button-toggle" onClick={() => setIsOpen(!isOpen)}>
                    <span className={`toggle-svg-arrow ${isOpen ? 'open' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </span>
                  </div>
                </div>


                {isOpen && (
                  <div className="voice-dropdown-menu">
                    <p>목소리 선택하기</p>
                    <div className="voice-dropdown-separator"></div>
                    <div className="voice-list">
                      {voiceFetcher.state === 'loading' ? (
                        <div className="loading-message">목록을 불러오는 중...</div>
                      ) : (
                        voiceFetcher.data?.map((voice) => (
                          <div
                            key={voice.voiceId} // 고유한 key 사용
                            className="voice-dropdown-item"
                            onClick={() => handleVoiceSelect(voice)}
                          >
                            {voice.name}
                          </div>
                        ))
                      )}
                    </div>
                    {!isChildMode && (
                      <div className="add-voice-section">
                        <button className="add-voice-button" onClick={handleAddVoiceClick}>
                          목소리 등록
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {audioUrl && (
                  <audio
                    autoPlay
                    src={audioUrl}
                    onEnded={() => setAudioUrl(null)} // 재생이 끝나면 URL을 초기화
                    hidden // 플레이어 UI는 화면에 보이지 않게 처리
                  />
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
            {!isQuiz ? <button
              className="nav-arrow prev-arrow"
              onClick={handlePrevPage}
              disabled={isFirstPage}
            >
              ‹
            </button> : ""}

            <div className="book-cover-container" style={{ backgroundImage: `url(/images/book_cover.png)` }}>
              {isQuiz ? (
                <>
                  {(quizFetcher.state === 'idle' && quizFetcher.data) ? (
                    <QuizView
                      quizzes={quizFetcher.data}
                      currentPage={bookData}
                      currentQuizIndex={currentQuizIndex}
                      setCurrentQuizIndex={setCurrentQuizIndex}
                      onAnswerSubmit={handleSubmitAnswer}
                      onQuizComplete={handleQuizCompletion}
                    />
                  ) : (
                    <>
                    </>
                    // <div className="modal-overlay">
                    //   <div className="modal-content" style={{ padding: '40px' }}>
                    //     <div className="loading-message" style={{ textAlign: 'center', fontSize: '18px', fontWeight: '600' }}>
                    //       퀴즈를 불러오는 중...
                    //     </div>
                    //   </div>
                    // </div>
                  )}
                </>
              ) : (
                <ReaderView
                  currentPage={bookData}
                  onImageClick={handleImageClick}
                />
              )}
            </div>

            {!isQuiz ? <button
              className="nav-arrow next-arrow"
              onClick={handleNextPage}
            >
              ›
            </button> : ""}
          </div>
        </div>
      </div>
      {isVoiceModalOpen && (
        <VoiceRegistrationModal
          onClose={() => setIsVoiceModalOpen(false)}
        />
      )}
      {showEndingModal && (
        <BookEndingModal onClose={handleCloseEndingModal} />
      )}
      {showResultsModal && (
        <ResultsQuizModal
          onClose={handleCloseModal}
          quizResult={quizResultFetcher.data}
        />
      )}
      {voiceModalUrl && (
        <EasterEggVoicePlayerModal
          audioUrl={voiceModalUrl}
          onClose={() => setVoiceModalUrl(null)}
        />
      )}
      {isShowLetterModal && finalLetterContent && (
        <LetterModal
          letterData={finalLetterContent}
          onConfirm={handleConfirmLetter} // 모달 닫고 엔딩 모달을 띄우는 핸들러 연결
        />
      )}
    </div>
  );
}


export async function loader({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");
  const username = session.get("username");

  const storyId = params.storyId;
  const pageNum = params.pageNum;
  const url = new URL(request.url);

  if (!childAccessToken) return redirect(`/mypage/login`);

  try {
    const fetchParam = url.searchParams.get("fetch");

    if (fetchParam === "voicesList") {
      const voiceData = await inquiryVoiceList(childAccessToken);
      if (voiceData?.isSuccess) {
        return voiceData.result.voiceSummaries || [];
      }
    }

    else if (fetchParam === "quiz") {
      const quizData = await inquiryAllQuiz(childAccessToken, storyId);
      console.log("퀴즈 있나", quizData.result);
      if (quizData?.isSuccess) {
        return quizData.result || [];
      }
      return [];
    }

    else if (fetchParam === "quizResult") {
      const resultData = await responseAllQuiz(childAccessToken);
      if (resultData?.isSuccess) {
        return resultData.result || [];
      }
      return [];
    }


    else if (fetchParam === "showLetter") {
      const letterData = await showEasterWggLetter(childAccessToken, storyId);
      console.log("편지 결과", letterData);
      if (letterData?.isSuccess && letterData.result) {
        const availableDate = new Date(letterData.result.availableAt);
        const now = new Date();
        const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
        
        const nowKSTMoment = new Date(now.getTime() + KST_OFFSET_MS); // KST맞추기
        console.log(nowKSTMoment);
        if (availableDate.getTime() <= nowKSTMoment.getTime()) { // 공개 날짜가 아닐 경우 반환하지 않음
          return letterData.result || [];
        } else return { isSuccess: false, message: "편지 공개일이 아닙니다." };
      }
      return { isSuccess: false };
    }

    const bookData = await readingStoryPage(childAccessToken, storyId, pageNum);
    if (bookData?.isSuccess) {
      // console.log(bookData)
      return { username, bookData: bookData.result };
    }

  } catch (error) {
    console.error("loader에서 심각한 오류 발생:", error);
    // return redirect(`/mypage/login`);
  }
}


export async function action({ request, params }) {
  const { storyId } = params;

  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("childAccessToken")) return redirect("/mypage/login");
  const childAccessToken = session.get("childAccessToken");

  const formData = await request.formData();
  const actionType = formData.get("_action");

  // actionType에 따라 분기 처리
  if (actionType === 'registrationVoice') {
    const voiceFile = formData.get("voiceFile");
    const result = await registrationVoice(childAccessToken, voiceFile);
    if (result.isSuccess) {
      return { success: true, message: "목소리가 성공적으로 등록되었습니다." };
    }
  }
  else if (actionType === 'playVoice') {
    const voiceId = formData.get("voiceId");
    const sceneId = formData.get("sceneId");
    const streamUrl = `/play-voice?voiceId=${voiceId}&storyId=${storyId}&sceneId=${sceneId}`;
    return { audioUrl: streamUrl };
  }
  else if (actionType === 'createQuizzes') {
    try { // 컴포넌트가 보낸 'count' 값을 읽어오기 (기본값 0)
      console.error("퀴즈 생성 :");

      const count = parseInt(formData.get("count") || "0", 10);
      if (count > 0) {
        const quizPromises = [];
        for (let i = 0; i < count; i++) { // 부족한 퀴즈 횟수만큼만 반복
          quizPromises.push(createQuiz(childAccessToken, storyId));
        }
        await Promise.all(quizPromises);
        return { success: true, created: count };
      }
      return { success: true, created: 0 };

    } catch (error) {
      console.error("action에서 퀴즈 생성 오류:", error);
    }
  }
  else if (actionType === 'selectedAnswerQuiz') {// 해당 퀴즈번호와 정답을 입력하면 결과를 반환
    const quizId = formData.get("quizId");
    const selectedAnswer = formData.get("selectedAnswer");
    const result = await selectedAnswerQuiz(childAccessToken, quizId, selectedAnswer);
    if (result.isSuccess) {
      return result;
    }
  }
  else if (actionType === "easterEggVoice") {
    const sceneId = formData.get("sceneId");
    const xcoordinateStr = formData.get("xcoordinate");
    const ycoordinateStr = formData.get("ycoordinate");
    const coordinatesXStr = formData.get("coordinates.x");
    const coordinatesYStr = formData.get("coordinates.y");

    const clickDto = {
      xcoordinate: parseInt(xcoordinateStr, 10) || 0,
      ycoordinate: parseInt(ycoordinateStr, 10) || 0,
      xCoordinate: parseInt(coordinatesXStr, 10) || 0,
      yCoordinate: parseInt(coordinatesYStr, 10) || 0,
    };

    const clickData = await clickEasterEggVoice(childAccessToken, sceneId, clickDto);
    if (clickData?.isSuccess) {
      const resultMessage = clickData.result;

      if (resultMessage === '이곳에는 음성이 없네요. 다른 장면을 눌러 숨겨진 목소리를 찾아볼까요?') {
        return { type: 'no_voice', message: resultMessage };
      }
      if (typeof resultMessage === 'string' &&
        (resultMessage.startsWith('http') ||
          resultMessage.endsWith('.mp3') ||
          resultMessage.endsWith('.wav'))) {
        return { type: 'voice_url', url: resultMessage };
      }
      return { type: 'message', text: resultMessage || "" };

    } else {
      return { type: 'error', message: clickData?.message || 'API 호출 실패' }, { status: 400 };
    }
  }
}