# Frontend Installation Guide

본 문서는 Drop the 8bit / EverTale 프로젝트의 **Frontend 실행을 위한 설치 가이드**입니다.  
Frontend는 React 기반으로 구성되어 있으며, **Backend 서버가 반드시 실행 중인 상태**에서 동작합니다.

---

## 1. Prerequisites

아래 환경이 사전에 설치되어 있어야 합니다.

- Node.js (v18 이상 권장)
- npm (Node.js 설치 시 함께 설치됨)
- Git
- React 개발 환경

> ⚠️ 주의  
> Frontend는 단독으로 동작하지 않으며, **Backend(API) 서버가 반드시 실행 중이어야 정상 동작합니다.**

<br>

## 2. Repository Clone

GitHub 저장소를 로컬 환경으로 클론합니다.

```bash
git clone git clone https://github.com/DropThe8bit/EverTale_FE.git
cd EverTale_FE
```
<br>

## 3. Dependencies 설치

프로젝트 루트 디렉토리에서 아래 명령어를 실행합니다.

```
npm install
```
<br>

## 4. Environment Variables 설정

Frontend 실행을 위해 필수 환경 변수(.env 파일) 설정이 필요합니다.
해당 .env 파일은 이메일로 별도 첨부했습니다.

프로젝트 루트 디렉토리에 .env 파일을 생성한 후, 아래 항목을 기입합니다.

```
VITE_API_BASE_URL=
SESSION_SECRET=
```

> ⚠️ .env 파일은 보안상 GitHub에 포함되지 않습니다.

<br>

## 5. 실행 방법 (Run Dev)

개발 환경 실행은 아래 명령어를 사용합니다.

```
npm run dev
```

정상 실행 시, 터미널에 출력되는 로컬 주소로 접속합니다.

```
http://localhost:5173
```

<br>

## 6. Notes

본 가이드는 개발 환경(dev) 기준입니다. 오류 발생 시 .env 설정 및 Backend 서버 실행 여부를 우선 확인해주세요:)

<br>
