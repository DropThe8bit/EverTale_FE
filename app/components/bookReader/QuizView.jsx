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
export default function MyStroyView() {
  const currentPage = bookData.pages[0];

  return (
    <div className="book-story-image-pages">
      <div className="book-page left-page">
        <img src={currentPage.image} alt={`${currentPage.pageNumber} 페이지 그림`} />
      </div>
      <div className="book-page right-page">
        {/* <p className="story-text">{currentPage.text}</p> */}
      </div>
    </div>
  )
}
