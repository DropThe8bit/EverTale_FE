import { index, route, layout } from "@react-router/dev/routes";

export default [
  layout("./Layouts/NavHeader.jsx", [
    index("./index.jsx"), // 모두의 책장 (무조건 로그인 후에 서비스 사용가능하다고 전제!)
    // route("/story", "./Story/StoryCharacter.jsx", [ // 스토리 만들기
    //   route("/story/category/:gid", "./Story/StoryCategoryPage.jsx"),
    //   route("/story/content/:gid", "./Story/StoryContentPage.jsx"),
    // ]),
    // route("/easter", "./EasterEgg/EasterEggChoice.jsx", [ // 이스터 에그
    //   // route("/easter/message/:gid", "./Easter/"),
    //   // route("/easter/voice/:gid", "./Easter/") 
    //   // 작품을 고르고 ..? 
    // ]),
    route("/mybook", "./Mybook/Mybook.jsx"),
  ]),
  // layout("./Layouts/reading.jsx", [
  //   // 다른 작가의 책읽기 
  //   route("/book/:gid", "./Book/BookPage.jsx", { id: "book-reader" }),
  //   route("/book/quiz/:gid", "./Book/QuizPage.jsx", { id: "book-quiz" }),
  //   // 이스터에그 포함된 나의 책 읽기
  //   route("/mybook/:gid", "./Book/BookPage.jsx", { id: "mybook-reader" }),
  //   route("/mybook/quiz/:gid", "./Book/QuizPage.jsx", { id: "mybook-quiz" })
  // ]),

  layout("./Layouts/NavSide.jsx", [ // 마이페이지
    route("/mypage", "./Mypage/ParentPage.jsx"),
  ]),
];
