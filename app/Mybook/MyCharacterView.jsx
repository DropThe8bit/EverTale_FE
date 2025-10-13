import { useState } from "react";
import { Link, useFetcher, useLoaderData } from "react-router";

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
  const filteredCharacters = characterSummaries.filter(character => {
    // 필수 값 중 null포함되어 있으면 걸러내기 
    return character && character.name && character.characterId && character.imageUrl && character.storyTitle;
  });
  
  const characterFetcher = useFetcher();

  const handleCardClick = (characterId) => {
    characterFetcher.load(`?mode=mycharacter&charId=${characterId}`);
    setIsModalOpen(true);
  };


  return (
    <div className="mycharacter-grid">
      {filteredCharacters.map((char) => (
        <Link 
          key={char.id} 
          className="mycharacter-card" 
          to={`?charId=${char.characterId}`}
        >
          <img src={char.imageUrl} alt={char.name} />
          <div className="mycharacter-name">{char.name}</div>
          <div className="mycharacter-title">{char.storyTitle} 주인공</div>
        </Link>
      ))}
      {/* {isModalOpen && (
        <ProfileModal
          // 8. characterFetcher.data가 바로 loader가 반환한 상세 정보입니다.
          //    데이터가 로딩 중일 때는 undefined일 수 있으므로 모달 내부에서 처리해야 합니다.
          character={characterFetcher.data}
          onClose={() => setIsModalOpen(false)}
        />
      )} */}
    </div>
  )
}