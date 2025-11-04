const filteredStories = [
  { storyId: 1, imageUrl: "/images/fairy.png", title: "1소연이와 다락방" },
  { storyId: 1, imageUrl: "/images/fairy.png", title: "2소연이와 다락방" },
  { storyId: 1, imageUrl: "/images/fairy.png", title: "3소연이와 다락방" },
  { storyId: 1, imageUrl: "/images/fairy.png", title: "4소연이와 다락방" },
  { storyId: 1, imageUrl: "/images/fairy.png", title: "5소연이와 다락방" },
  { storyId: 1, imageUrl: "/images/fairy.png", title: "6소연이와 다락방" },
  { storyId: 1, imageUrl: "/images/fairy.png", title: "7소연이와 다락방" },
  { storyId: 1, imageUrl: "/images/fairy.png", title: "8소연이와 다락방" },
]

import { useRef } from "react";
import "~/styles/easterEgg.css"

export default function EasterEggType() {
  const scrollContainerRef = useRef(null);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -420, 
        behavior: 'smooth'
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 420,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="easteregg-container">

      <div className="easteregg-title">
        <h1>이스터에그</h1>
        <p>부모와 아이의 상호작용을 돕는 이스터에그 시스템입니다.<br />
          원하는 시간대를 설정해서 아이에게 미래형 메세지를 보낼 수 있어요</p>
      </div>
      <div className="easteregg-type-select">
        <div className="easteregg-type">
          <img src="/images/hidden_message.png" alt="hidden message" />
          <p>숨은 메세지 찾기</p>
        </div>
        <div className="easteregg-type">
          <img src="/images/love_letter.png" alt="hidden message" />
          <p>사랑의 편지</p>
        </div>
      </div>

      <div className="easteregg-tab-wrapper">
        <div className="easteregg-tab-bar">
          <div className="easteregg-tab-button">
            이스터에그 만들기
          </div>
        </div >
      </div>
      <div className="easteregg-separator"></div>

      <div className="easteregg-books-container">
        <div className="arrow-type" onClick={handleScrollLeft}>
          <img src="/images/left_arrow.png" alt="scroll left" />
        </div>
        <div className="book-grid" ref={scrollContainerRef}> {/* 👈 3. (JS를 위한 ref 추가) */}
          {filteredStories.map((book, index) => (
            <div key={index} className="book-card">
              <img src={book.imageUrl} alt={book.title} />
              <div className="book-title">{book.title}</div>
            </div>
          ))}
        </div>
        <div className="arrow-type" onClick={handleScrollRight}>
          <img src="/images/right_arrow.png" alt="scroll right" /> 
        </div>
      </div>

      <div className="easteregg-tab-wrapper">
        <div className="easteregg-tab-bar">
          <div className="check-tab-button">
            만들어진 이스터에그 확인하기
          </div>
        </div >
      </div>
      <div className="easteregg-separator"></div>
      <div className="easteregg-books-container">
        <div className="arrow-type" onClick={handleScrollLeft}>
          <img src="/images/left_arrow.png" alt="scroll left" />
        </div>
        <div className="book-grid" ref={scrollContainerRef}> {/* 👈 3. (JS를 위한 ref 추가) */}
          {filteredStories.map((book, index) => (
            <div key={index} className="book-card">
              <img src={book.imageUrl} alt={book.title} />
              <div className="book-title">{book.title}</div>
            </div>
          ))}
        </div>
        <div className="arrow-type" onClick={handleScrollRight}>
          <img src="/images/right_arrow.png" alt="scroll right" /> 
        </div>
      </div>
    </div >
  )
}