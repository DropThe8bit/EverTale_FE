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


export default function MyStroyView() {
  return (
    <div className="mybook-grid">
      {dummyBooks.map((book, index) => (
        <div key={index} className="mybook-card">
          <img src={book.image} alt={book.title} />
          <div className="mybook-title">{book.title}</div>
        </div>
      ))}
    </div>
  )
}
