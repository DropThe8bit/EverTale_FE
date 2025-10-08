import { Link, redirect, useLoaderData } from "react-router";
import { inquiryAllStory } from "./api/book.server";
import { getSession } from "./auth/auth";

// const dummyBooks = [
//   { title: "소연이와 다락방 요정", image: "/images/fairy.png" },
//   { title: "용과 마음의 열쇠", image: "/images/dragon.png" },
//   { title: "소연이와 다락방 요정", image: "/images/fairy.png" },
//   { title: "용과 마음의 열쇠", image: "/images/dragon.png" },
//   { title: "소연이와 다락방 요정", image: "/images/fairy.png" },
//   { title: "용과 마음의 열쇠", image: "/images/dragon.png" },
//   { title: "소연이와 다락방 요정", image: "/images/fairy.png" },
//   { title: "용과 마음의 열쇠", image: "/images/dragon.png" },
// ];


export default function EveryLibrary() {
  const storydata = useLoaderData();
  const filteredStories = storydata.filter(book => {
    // 필수 값 중 null포함되어 있으면 걸러내기 
    return book && book.storyId && book.imageUrl && book.title;
  });

  return (
    <div className="every-library-page">
      <h1>모두의 책장</h1>
      <p>세상 모든 꼬마 작가님들을 응원합니다!</p>
      <div className="separator"></div>

      <div className="book-grid">
        {filteredStories.map((book, index) => (
          <div key={index} className="book-card">
            <Link to={`/mybook/bookview/${book.storyId}/1?title=${book.title}&author=${book.authorName}`} >
              <img src={book.imageUrl} alt={book.title} />
              <div className="book-title">{book.title}</div>
            </Link>
          </div>
        ))}
      </div>
      {/* <div className="pagination">
        <button className="page-button" disabled>{"<"}</button>
        <button className="page-button active">1</button>
        <button className="page-button">2</button>
        <button className="page-button">3</button>
        <button className="page-button">{">"}</button>
      </div> */}
    </div>
  );
}



export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");

  if (!childAccessToken) {
    return redirect(`/mypage/login`);
  }
  const profileId = session.get("profileId");

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");

  const allStoryList = await inquiryAllStory(childAccessToken, profileId);
  return allStoryList.result.storySummaries;

}