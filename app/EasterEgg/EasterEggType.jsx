
import "~/styles/easterEgg.css"

export default function EasterEggType() {

  return (
    <div className="easteregg-container">

      <div className="easteregg-title">
        <h1>이스터에그</h1>
        <p>부모와 아이의 상호작용을 돕는 이스터에그 시스템입니다.
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

    </div>
  )
}