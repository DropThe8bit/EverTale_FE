# EverTale_FE
<br>

## 💻 프로젝트 소개
EverTale Frontend는 아이-부모 인터랙티브 동화를 제공하는 Web App의 사용자 화면을 구현합니다. remix 기반으로 서버와의 통신을 RESTful API 방식으로 구현하였고, Route 기반 UI 설계, 서버 리다이렉션, loader/action을 통해 백엔드와 데이터를 주고받습니다.

<br>

## 🌐 Frontend 기술 스택

| 분류 | 사용 기술 | 설명 |
|------|------|------|
| **Framework**    | Remix        | 서버 중심 렌더링(SSR) 및 라우팅 기반 UI 프레임워크   |
| **UI**           | React        | 컴포넌트 구조 기반 사용자 화면 구성               |
| **Build Tool**   | Vite         | 빠른 개발 환경 및 빌드 최적화                  |
| **Canvas**       | HTML5 Canvas | 사용자 그림 처리 및 YOLO 결과(바운딩 박스) 오버레이   |
| **Detection**    | DOM API      | 클릭 이벤트를 기반으로 이미지 내 상대 좌표를 계산       |
| **API Strategy** | REST API     | HTTP 기반 JSON 요청·응답을 통한 서버와의 데이터 통신 |

<br>

## 📁 Directory 구조 (Frontend)
```text
app/
 ├─ routes.js
 ├─ components/
 ├─ styles/
 ├─ api/
 ├─ auth/
 └─ (각 페이지별 화면 파일)
```

- routes: Remix 라우팅 역할을 수행한다. 주소 기반으로 페이지를 결정하며, loader/action을 통해 서버와 데이터를 주고받음.
- components: React UI 컴포넌트 집합이며, 공통 UI 요소 또는 조합 요소들을 포함.
- Styles: 전역 스타일 및 UI 스타일 관련 css 파일들이 위치.
- api: 백엔드 RESTful API와 통신하는 fetch wrapper 또는 API abstraction 코드가 포함됨. HTTP 통신 로직을 정리해서 route 또는 component에서 호출.
- auth: 프론트에서 인증 상태를 직접 관리하며, auth.js를 통해 쿠키 기반 인증을 수행함. 토큰을 쿠키에 저장하며, Remix session과 협력하여 로그인 상태를 유지.
- 각 페이지별 화면: URL 경로에 따라 렌더링되는 Remix Route 페이지이며, 페이지별 loader/action을 통해 서버 데이터를 주고받음.

<br>

## API 연동 방식

- Remix loader → GET
- Remix action → POST
- 토큰 포함 Authorization Header
- RESTful endpoint 사용
```text
fetch('/api/story', {
 method: 'GET',
 headers: {
   Authorization: `Bearer ${token}`
 }
})
```
<br>

## 실행 방법 (Run dev)
필수 ENV 변수 (이메일로 별도 첨부 .env파일)를 기입합니다.
```text
VITE_API_BASE_URL=
SESSION_SECRET=
```
개발 환경 실행은 아래와 같습니다!
```text
npm run dev
```
