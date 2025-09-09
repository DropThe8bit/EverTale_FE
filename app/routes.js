import { index, route, layout } from "@react-router/dev/routes";

export default [
  layout("./Layouts/IndexNav.jsx", [
    index("./index.jsx"), // 모두의 책장 (무조건 로그인 후에 서비스 사용가능하다고 전제!)
    route("/story", "./Story/StoryCharacterCreator.jsx"), // 스토리 만들기
    route("/story/category", "./Story/StoryCategoryPage.jsx"),
    route("/story/content/:pageId", "./Story/StoryContentPage.jsx"),

    // route("/easter", "./EasterEgg/EasterEggChoice.jsx", [ // 이스터 에그
    //   // route("/easter/message/:gid", "./Easter/"),
    //   // route("/easter/voice/:gid", "./Easter/") 
    // ]),
    route("/mybook", "./Mybook/Mybook.jsx"),

    route("/mypage/auth/signup", "./Mypage/SignUpPage.jsx"),
    route("/mypage/auth/login", "./Mypage/LoginPage.jsx"),
    route("/mypage/auth/profile", "./Mypage/ProfileSelect.jsx"),
    // route("/signup")
  ]),
  // layout("./Layouts/NavHeaderChild.jsx", [
  //   route("/childindex.jsx", "./index.jsx"), // 모두의 책장 (무조건 로그인 후에 서비스 사용가능하다고 전제!)
  // ]),
  // layout("./Layouts/reading.jsx", [
  // route("/book", "./BookView/BookReader.jsx"),
  //   // 다른 작가의 책읽기 
  //   route("/book", "./BookView/BookReader.jsx", { id: "book-reader" }),
  //   route("/book/quiz/:gid", "./Book/QuizPage.jsx", { id: "book-quiz" }),
  //   // 이스터에그 포함된 나의 책 읽기
  //   route("/mybook/:gid", "./Book/BookPage.jsx", { id: "mybook-reader" }),
  //   route("/mybook/quiz/:gid", "./Book/QuizPage.jsx", { id: "mybook-quiz" })
  // ]),

  layout("./Layouts/IndexNavSide.jsx", [ // 마이페이지
    route("/mypage", "./Mypage/IndexMypage.jsx"), // 부모 화면


  ]),
  // layout("./Layouts/NavSide.jsx", [ // 마이페이지
  //   route("/mypage", "./Mypage/ParentPage.jsx"), // 부모 화면
  // ]),
  // layout("./Layouts/NavSideChild.jsx", [ // 마이페이지
  //   // route("/auth/signup", "./Mypage/SignUpPage.jsx"),
  //   route("/mypage?user=child", "./Mypage/ChildPage.jsx"), // 아이 화면
  // ]),
];
// 아이 화면 <-> 부모 화면 만들어 질거라 라우터 경로 잘 생성해야해!!!