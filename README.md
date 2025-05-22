# EverTale_FE

<br>

## 💻 Frontend 기술 스택

| 분류 | 사용 기술 | 설명 |
|------|------|------|
| **프레임워크** | [Remix.js](https://remix.run/) | React 기반의 서버 중심 렌더링(SSR) 프레임워크로, 빠른 라우팅과 데이터 로딩 최적화 |
| **UI 라이브러리** | React.js | 컴포넌트 기반 사용자 인터페이스 구현 |
| **스타일링** | [Tailwind CSS](https://tailwindcss.com/) | 유틸리티 기반의 CSS 프레임워크로 빠르고 일관된 UI 스타일링 |
| **좌표 연산** | DOM API (`getBoundingClientRect`) | 이미지 기준의 상대 좌표 계산을 위한 브라우저 내장 API |
| **객체 감지 (선택)** | [TensorFlow.js](https://www.tensorflow.org/js) + [COCO-SSD 모델](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) | 이미지 내 객체를 자동으로 감지하고 좌표로 변환 |
| **Canvas API** | HTML5 Canvas | 감지된 객체의 바운딩 박스를 이미지 위에 시각화 표시 |
