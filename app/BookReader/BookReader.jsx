import React from 'react';
import "~/styles/bookReader.css";
import { Link, useSearchParams } from 'react-router';

import ReaderView from "~/components/bookReader/ReaderView"
import QuizView from "~/components/bookReader/QuizView"
// 예시 책 데이터
const bookData = {
	title: "소연이와 다락방 요정",
	author: "김이화",
	pages: [
		{
			pageNumber: 1,
			image: "/images/fairy.png", // 왼쪽 페이지에 들어갈 삽화
			text: "소연이는 그림 그리기를 좋아하는 아이였어요.\n\n하지만 가끔씩은 어떤 그림을 그려야 할지 고민이 되었어요.\n\n어느 날, 소연이는 할머니의 다락방에서 반짝이는 색연필 상자를 발견했어요.\n\n상자를 열자, 작은 요정이 나타나 말했어요."
		}
	]
};

export default function BookReader() {
	const [searchParams] = useSearchParams();
	const mode = searchParams.get("mode"); // 'mycharacter' 또는 null

	const isQuiz = mode === "quiz";
  const isChildMode = searchParams.get("user") === "child";

  // 2. isChildMode 값에 따라 각 링크의 최종 경로를 동적으로 만듭니다.
  const readerLink = isChildMode
    ? "/mybook/bookview?user=child"
    : "/mybook/bookview";

  const quizLink = isChildMode
    ? "/mybook/bookview?mode=quiz&user=child"
    : "/mybook/bookview?mode=quiz";


	
	return (
		<div className="book-reader-view-layout">
			<div className="book-info-container">
				<div className="book-info">
					<div className="book-info-title">
						<h2>{bookData.title}</h2>
						<button className="book-reader-voice-button"> 읽어주기 <span>⌵</span></button>
					</div>
					<p>{bookData.author} 작가님</p>
				</div>
			</div>

			<div className="book-view-wrapper">
				<div className="bookmark-tab-wrapper">
					<div className="bookmark-tab-bar">
						<Link to= {readerLink}>
							<div className={`bookmark-tab-button ${!isQuiz ? "button-active" : ""}`}>
								책 읽기
							</div>
						</Link>
						<Link to= {quizLink}>
							<div className={`bookmark-tab-button ${isQuiz ? "button-active" : ""}`}>
								퀴즈
							</div>
						</Link>
					</div>
				</div>

				<div className="book-cover-container" style={{ backgroundImage: `url(/images/book_cover.png)` }}>
					{isQuiz ? <QuizView /> : <ReaderView bookData={bookData.pages} />}
				</div>
			</div>
		</div>
	);
}