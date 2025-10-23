import { Link, useSearchParams } from "react-router";

export default function MyStroyView(props) {
  const { storySummaries } = props;
  const [searchParams] = useSearchParams();
  const isChildUser = searchParams.get("user") == "child";

  const filteredStories = storySummaries.filter(story => {
    // 필수 값 중 null포함되어 있으면 걸러내기 
    return story && story.storyId && story.imageUrl && story.title;
  });

  return (
    <div className="mybook-grid">
      {filteredStories.map((book, index) => (
        <div key={index} className="mybook-card">
          <Link to={`/mybook/bookview/${book.storyId}/1?title=${book.title}&author=${book.authorName}&${isChildUser ? '&user=child' : ''}`} >
            <img src={book.imageUrl} alt={book.title} />
            <div className="mybook-title">{book.title}</div>
          </Link>
        </div>
      ))}
    </div>
  )
}


