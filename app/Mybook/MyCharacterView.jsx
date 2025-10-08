const dummyChars = [
  // { name: "소연이", title: "소연이와 다락방 요정", image: "/images/fairy_char.png" },
  // { name: "용용이", title: "용과 마음의 열쇠", image: "/images/dragon_char.png" },
  // { name: "소연이", title: "소연이와 다락방 요정", image: "/images/fairy_char.png" },
  // { name: "용용이", title: "용과 마음의 열쇠", image: "/images/dragon_char.png" },
  // { name: "소연이", title: "소연이와 다락방 요정", image: "/images/fairy_char.png" },
  // { name: "용용이", title: "용과 마음의 열쇠", image: "/images/dragon_char.png" },
  // { name: "소연이", title: "소연이와 다락방 요정", image: "/images/fairy_char.png" },
  // { name: "용용이", title: "용과 마음의 열쇠", image: "/images/dragon_char.png" },
];

export default function MyCharacterView(props) {
  const { characterSummaries } = props;

  return (
    <div className="mycharacter-grid">
      {characterSummaries.map((char, index) => (
        <div key={index} className="mycharacter-card">
          <img src={char.imageUrl} alt={char.name} />
          <div className="mycharacter-name">{char.name}</div>
          <div className="mycharacter-title">{char.storyTitle} 주인공</div>
        </div>
      ))}
    </div>
  )
}