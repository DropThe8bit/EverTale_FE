
export default function StoryReaderView(props) {
  const { currentPage, onImageClick } = props;
  /**
     * 이미지 클릭 시 실행되는 핸들러
     * @param {React.MouseEvent<HTMLImageElement>} event
     */
  const handleImageClick = (event) => {
    const imgElement = event.target;

    // 원본 이미지의 크기와 비율
    const naturalWidth = imgElement.naturalWidth;
    const naturalHeight = imgElement.naturalHeight;
    const naturalRatio = naturalWidth / naturalHeight;

    // CSS에서 padding 값을 가져오기
    const style = window.getComputedStyle(imgElement);
    const paddingLeft = parseFloat(style.paddingLeft);
    const paddingTop = parseFloat(style.paddingTop);
    const paddingRight = parseFloat(style.paddingRight);
    const paddingBottom = parseFloat(style.paddingBottom);

    // 패딩을 제외한 실제 컨텐츠 박스의 크기를 계산
    const contentBoxWidth = imgElement.clientWidth - paddingLeft - paddingRight;
    const contentBoxHeight = imgElement.clientHeight - paddingTop - paddingBottom;
    const contentBoxRatio = contentBoxWidth / contentBoxHeight;

    // 보여지는 이미지의 크기와 위치(여백)를 계산
    let renderedImgWidth, renderedImgHeight, offsetX, offsetY;

    if (contentBoxRatio > naturalRatio) {
      // 컨텐츠 박스가 원본보다 가로로 넓음 -> (상하 여백 생김)
      renderedImgHeight = contentBoxHeight;
      renderedImgWidth = renderedImgHeight * naturalRatio;
      offsetX = paddingLeft + (contentBoxWidth - renderedImgWidth) / 2; // 왼쪽 패딩 + 왼쪽 여백
      offsetY = paddingTop;
    } else {
      // 컨텐츠 박스가 원본보다 세로로 넓음 -> (좌우 여백 생김)
      renderedImgWidth = contentBoxWidth;
      renderedImgHeight = renderedImgWidth / naturalRatio;
      offsetX = paddingLeft;
      offsetY = paddingTop + (contentBoxHeight - renderedImgHeight) / 2; // 위쪽 패딩 + 위쪽 여백
    }

    // 보여지는 이미지 기준의 실제 클릭 좌표를 얻기
    const clickXOnImg = event.nativeEvent.offsetX - offsetX;
    const clickYOnImg = event.nativeEvent.offsetY - offsetY;

    // 여백(패딩, 레터박스)을 클릭했는지 확인
    if (clickXOnImg < 0 || clickXOnImg > renderedImgWidth ||
      clickYOnImg < 0 || clickYOnImg > renderedImgHeight) {
      console.log("여백(패딩/레터박스) 클릭됨. 좌표 전송 안 함.");
      if (onImageClick) {
        onImageClick(null);
      }
      return;
    }

    // 보여지는 이미지 기준 좌표를 원본 이미지 기준 좌표로 비율 맞추기
    const xRatio = clickXOnImg / renderedImgWidth;
    const yRatio = clickYOnImg / renderedImgHeight;

    const originalX = xRatio * naturalWidth;
    const originalY = yRatio * naturalHeight;

    const originalCoordinates = {
      x: Math.round(originalX),
      y: Math.round(originalY),
    };
    
    // 최종 원본 좌표를 콘솔에 찍고 부모에게 전달
    if (onImageClick) {
      onImageClick(originalCoordinates);
    }
  };


  return (
    <div className="book-story-image-pages">
      <div className="book-page left-page">
        <img
          src={currentPage.imageUrl}
          alt={`${currentPage.pageNum} 페이지 그림`}
          onClick={handleImageClick}
        />
      </div>
      <div className="book-page right-page">
        <p className="story-text">{currentPage.content}</p>
        <div className="story-conetent-page-number">
          <span>{currentPage.pageNum}</span>
        </div>
      </div>
    </div>
  );
}