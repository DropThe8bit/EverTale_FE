const LETTERS = [
  { imageNum: 1, imgSrc: '/images/easteregg_letter_1.png' },
  { imageNum: 2, imgSrc: '/images/easteregg_letter_2.png' },
  { imageNum: 4, imgSrc: '/images/easteregg_letter_4.png' },
  { imageNum: 5, imgSrc: '/images/easteregg_letter_5.png' },
  { imageNum: 6, imgSrc: '/images/easteregg_letter_6.png' },
  { imageNum: 7, imgSrc: '/images/easteregg_letter_7.png' },
];

import { useEffect, useRef, useState } from "react";
import { Link, useFetcher, useLoaderData, useNavigate } from "react-router";
import { createEasterEggLetter } from "~/api/easteregg.server";
import { getSession } from "~/auth/auth";
import "~/styles/easterEggLetter.css"

export default function EasterEggLetter() {
  const username = useLoaderData();
  const navigate = useNavigate();
  const [letterContent, setLetterContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 선택된 이미지 인덱스
  const [isLetterRegistered, setIsLetterRegistered] = useState(false); // 전송 완료 상태
  const [availableAtDate, setAvailableAtDate] = useState(''); // 예: "2025-10-10"

  const letterFetcher = useFetcher();
  const isSubmitting = letterFetcher.state !== 'idle';
  const selectedImageNum = LETTERS[currentIndex].imageNum;

  const handlePrevPage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? LETTERS.length - 1 : prevIndex - 1
    );
  };

  const handleNextPage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === LETTERS.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDateChange = (event) => setAvailableAtDate(event.target.value);

  const handleLetterChange = (event) => {
    setLetterContent(event.target.value);
  };

  const handleSubmitLetter = () => {
    // 1차 유효성 검사
    if (!letterContent.trim()) {
      alert("편지 내용을 작성해 주세요.");
      return;
    }
    // 날짜 유효성 검사
    if (!availableAtDate) {
      alert("공개 날짜를 설정해주세요.");
      return;
    }

    // 공개 날짜가 오늘 또는 미래의 날짜인지 검사
    const selectedDate = new Date(availableAtDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 정보를 제거하여 날짜만 비교

    if (selectedDate < today) {
      alert("공개 날짜는 오늘 또는 미래의 날짜여야 합니다.");
      return;
    }
    const formData = new FormData();
    formData.append('_action', 'registerEasterEggLetter');
    formData.append('content', letterContent);
    formData.append('imageNum', selectedImageNum.toString());
    formData.append('availableAt', availableAtDate);
    letterFetcher.submit(formData, { method: 'post' });
  };


  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (letterFetcher.data?.success === true && letterFetcher.state === 'idle') {
      setIsSuccessModalOpen(true);
      setIsLetterRegistered(true);
    }
  }, [letterFetcher.data, letterFetcher.state]);

  const handleBack = () => {
    navigate(`/easter`);
  };

  return (
    <div className="easteregg-letter-container">
      <p><span>{username} 작가님</span>을 위한 편지를 적어주세요.<br />
        설정한 시간을 기준으로 책을 끝까지 읽을 때 편지가 나와요!</p>
      <div className="easteregg-letter-image-background">
        <button
          className="nav-arrow "
          onClick={handlePrevPage}
          type="button"
        >
          ‹
        </button>
        <div key={LETTERS[currentIndex].imageNum}>
          <img
            src={LETTERS[currentIndex].imgSrc}
            alt={`Letter ${LETTERS[currentIndex].imageNum}`}
          />
        </div>
        <div className="easteregg-text-overlay">
          <textarea
            className="letter-input-box"
            placeholder="아이를 위한 사랑의 편지를 적어주세요."
            value={letterContent}
            onChange={handleLetterChange}
            disabled={isSubmitting || isLetterRegistered}
          />
        </div>
        <button
          className="nav-arrow"
          onClick={handleNextPage}
          type="button"
        >
          ›
        </button>
      </div>

      <div className="easteregg-available-time-setting">
        <div className="time-inputs">
          <input
            type="date"
            value={availableAtDate}
            onChange={handleDateChange}
            required
            disabled={isSubmitting || isLetterRegistered}
          />
        </div>
        <strong>부터 편지 확인 가능</strong>
      </div>

      <div className="easteregg-letter-register">
        <button
          className="easteregg-letter-back-btn"
          onClick={handleBack}
        >취소</button>
        <button
          className="easteregg-letter-submit-btn"
          onClick={handleSubmitLetter}
          type="button"
          disabled={isSubmitting || isLetterRegistered || !letterContent.trim()} // 전송 조건 추가
        >
          {isSubmitting ? '전송 중...' : (isLetterRegistered ? '편지 전송 완료' : '편지 전송')}
        </button>
      </div>
      {isSuccessModalOpen && (
        <LetterSuccessModal />
      )}
    </div >
  );
}

function LetterSuccessModal({}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>등록 완료!</h3>
        <p>사랑의 편지가 성공적으로 전송되었어요!</p>
        <div className="modal-buttons">
            <Link to={`/easter`} >
              <div className="easteregg-complete-btn">
                확인
              </div>
            </Link>
        </div>
      </div>
    </div>
  );
}



export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const username = session.get("username");
  return username;
}

export async function action({ request, params }) {
  const { storyId } = params;
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("childAccessToken")) return redirect("/mypage/login");
  const childAccessToken = session.get("childAccessToken");

  const formData = await request.formData();
  const actionType = formData.get("_action");

  // actionType에 따라 분기 처리
  if (actionType === 'registerEasterEggLetter') {
    const content = formData.get("content");
    const imageNum = formData.get("imageNum");
    const availableAt = formData.get("availableAt");

    const result = await createEasterEggLetter(childAccessToken, storyId, content, imageNum, availableAt);
    if (result.isSuccess) {
      return { success: true, message: "편지가 성공적으로 등록되었습니다." };
    }
  }
}
