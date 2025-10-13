import { index, route, layout } from "@react-router/dev/routes";

export default [
  layout("./Layouts/IndexNav.jsx", [
    index("./index.jsx"), // 모두의 책장 (무조건 로그인 후에 서비스 사용가능하다고 전제!)
    route("/story", "./Story/StoryIndex.jsx"), // 스토리 만들기
    route("/story/:storyId", "./Story/StoryCharacterCreator.jsx"), 
    route("/story/:storyId/category", "./Story/StoryCategoryPage.jsx"),
    route("/story/:storyId/:pageNum", "./Story/StoryContentPage.jsx"),

    route("/easter", "./EasterEgg/EasterEggType.jsx", [ // 이스터 에그
    //   // route("/easter/message/:gid", "./Easter/"),
    //   // route("/easter/voice/:gid", "./Easter/") 
    ]),
    route("/mybook", "./Mybook/Mybook.jsx"),

    route("/mypage/signup", "./Mypage/SignUpPage.jsx"),
    route("/mypage/login", "./Mypage/LoginPage.jsx"),
    route("/mypage/naver", "./Mypage/NaverLogin.jsx"),
    route("/api/auth/naver-login", "./Mypage/api.auth.naver-login.jsx"),
    route("/mypage/profile", "./Mypage/ProfileSelect.jsx"),
    route("/mypage/childselect", "./Mypage/ChildProfileSelect.jsx"),
    route("/profilelogout", "./Mypage/ProfileLogoutPage.jsx"),
    route("/logout", "./Mypage/LogoutPage.jsx"),
  ]),
    layout("./Layouts/IndexNavSimple.jsx", [
    route("/mybook/bookview/:storyId/:pageNum", "./BookReader/BookReader.jsx"), // 책읽기 화면, 퀴즈 화면
    route("/play-voice", "./BookReader/play-voice.jsx"), // 책읽기 화면, 퀴즈 화면

    // // 이스터에그 포함된 나의 책 읽기
    // route("/mybook/:gid", "./Book/BookPage.jsx", { id: "mybook-reader" }),
    // route("/mybook/quiz/:gid", "./Book/QuizPage.jsx", { id: "mybook-quiz" })
  ]),

  layout("./Layouts/IndexNavSide.jsx", [ // 마이페이지
    route("/mypage", "./Mypage/IndexMypage.jsx"), 
  ]),
];
// 아이 화면 <-> 부모 화면 만들어 질거라 라우터 경로 잘 생성해야해!!!