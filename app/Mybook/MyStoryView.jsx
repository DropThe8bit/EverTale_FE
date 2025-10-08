const dummyBooks = [
  { title: "소연이와 다락방 요정", image: "/images/fairy.png" },
  { title: "용과 마음의 열쇠", image: "/images/dragon.png" },
  { title: "소연이와 다락방 요정", image: "/images/fairy.png" },
  { title: "용과 마음의 열쇠", image: "/images/dragon.png" },
  { title: "소연이와 다락방 요정", image: "/images/fairy.png" },
  { title: "용과 마음의 열쇠", image: "/images/dragon.png" },
  { title: "소연이와 다락방 요정", image: "/images/fairy.png" },
  { title: "용과 마음의 열쇠", image: "/images/dragon.png" },
];

import { Link } from "react-router";

export default function MyStroyView(props) {
  const { storySummaries } = props;
  // console.log(storySummaries)
  return (
    <div className="mybook-grid">
      {storySummaries.map((book, index) => (
        <div key={index} className="mybook-card">
          <Link to={`/mybook/bookview/${book.storyId}/1?title=${book.title}&author=${book.authorName}`} >
            <img src={book.imageUrl} alt={book.title} />
            <div className="mybook-title">{book.title}</div>
          </Link>
        </div>
      ))}
    </div>
  )
}


