import React, { useEffect, useMemo, useRef, useState } from 'react';
import "~/styles/bookReader.css";
import { Form, Link, redirect, useFetcher, useLoaderData, useNavigate, useParams, useSearchParams } from 'react-router';

import ReaderView from "~/components/bookReader/ReaderView"
import QuizView from "~/components/bookReader/QuizView"
import { getSession } from '~/auth/auth';
import { readingStoryPage } from '~/api/book.server';
import { inquiryVoiceList, registrationVoice } from '~/api/voice.server';

function VoiceRegistrationModal({ onClose, onSave }) {
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
      <div className="voice-modal-content">
        {isSuccess ? (
          <SuccessView />
        ) : (
          <>
            <h2>목소리 등록하기</h2>
            <p>감정을 풍부하게 담아 아래 문장을 천천히 읽어주세요.<br />마이크를 가까이 두고 10초 이내로 녹음해 주세요.</p>
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


export default function BookReader() {
  const navigate = useNavigate();
  const bookData = useLoaderData();
  const { storyId, pageNum } = useParams();
  const sceneId = bookData.sceneId;
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


  // 페이지별 스토리 관리
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


  // 음성 관리
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
    formData.append('sceneId', sceneId); // sceneId가 있다고 가정
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
                    <div className="add-voice-section">
                      <button className="add-voice-button" onClick={handleAddVoiceClick}>
                        목소리 등록
                      </button>
                    </div>
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
      {isVoiceModalOpen && (
        <VoiceRegistrationModal
          onClose={() => setIsVoiceModalOpen(false)}
        />
      )}

    </div>
  );
}


export async function loader({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");
  const storyId = params.storyId;
  const pageNum = params.pageNum;
  const url = new URL(request.url);

  if (!childAccessToken) return redirect(`/mypage/login`);

  try {
    if (url.searchParams.get("fetch") === "voicesList") {
      const voiceData = await inquiryVoiceList(childAccessToken);
      if (voiceData?.isSuccess) {
        return voiceData.result.voiceSummaries || [];
      }
    }
    const bookData = await readingStoryPage(childAccessToken, storyId, pageNum);
    // const bookDataAll = await readingStoryAllPage(childAccessToken, storyId);

    return bookData.result;
  } catch (error) {
    console.error("loader에서 심각한 오류 발생:", error);
    // return redirect(`/mypage/login`);
  }
}


export async function action({ request, params }) {
  const formData = await request.formData();
  const { storyId } = params;

  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("childAccessToken")) return redirect("/mypage/login");
  const childAccessToken = session.get("childAccessToken");

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
}