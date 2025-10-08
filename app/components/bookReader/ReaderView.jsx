
export default function StoryReaderView(props) {
  const { currentPage } = props;
  
  return (
    <div className="book-story-image-pages">
      <div className="book-page left-page">
        <img src={currentPage.imageUrl} alt={`${currentPage.pageNum} 페이지 그림`} />
      </div>
      <div className="book-page right-page">
        <p className="story-text">{currentPage.content}</p>
        <div className="story-conetent-page-number">
          <span>{currentPage.pageNum}</span>
        </div>
      </div>
    </div>
  )
}
