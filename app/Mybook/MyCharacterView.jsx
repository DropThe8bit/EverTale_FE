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
  