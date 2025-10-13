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


export default function MyCharacterView({ characterSummaries, onCardClick }) {
  const filteredCharacters = characterSummaries.filter(character => {
    // 필수 값 중 null포함되어 있으면 걸러내기 
    return character && character.name && character.characterId && character.imageUrl && character.storyTitle;
  });
  return (
      <div className="mycharacter-grid">
        {filteredCharacters.map((char) => (
          <div 
            key={char.characterId} 
            className="mycharacter-card" 
            onClick={() => onCardClick(char.characterId)}
          >
            <img src={char.imageUrl} alt={char.name} />
            <div className="mycharacter-name">{char.name}</div>
            <div className="mycharacter-title">{char.storyTitle} 주인공</div>
          </div>
        ))}
      </div>
    );
  }
  