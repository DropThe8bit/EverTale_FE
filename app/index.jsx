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

// export default function Index() {

//   return (
//     <div className="every-library-page">
//       <h1>모두의 책장</h1>
//       <p>세상 모든 꼬마 작가님들을 응원합니다!</p>

//       <div className="book-grid">
//         {books.map((book, i) => (
//           <div className="book-card" key={i}>
//             <img src={book.imageUrl} alt={book.title} />
//             <div className="book-title">{book.title}</div>
//           </div>
//         ))}
//       </div>
//     </div>

//   );
// }


export default function EveryLibrary() {
  return (
    <div className="every-library-page">
      <h1>모두의 책장</h1>
      <p>세상 모든 꼬마 작가님들을 응원합니다!</p>
      <div className="separator"></div>

      <div className="book-grid">
        {dummyBooks.map((book, index) => (
          <div key={index} className="book-card">
            <img src={book.image} alt={book.title} />
            <div className="book-title">{book.title}</div>
          </div>
        ))}
      </div>
      <div className="pagination">
  <button className="page-button" disabled>{"<"}</button>
  <button className="page-button active">1</button>
  <button className="page-button">2</button>
  <button className="page-button">3</button>
  <button className="page-button">{">"}</button>
</div>

    </div>
  );
}
