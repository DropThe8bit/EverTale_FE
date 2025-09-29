import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import "~/styles/storyCategory.css";

// 카테고리 데이터를 배열로 관리하여 효율성을 높이기
const CATEGORIES = [
  { genre: 'adventure', name: '모험', imgSrc: '/images/category_adventure.png' },
  { genre: 'friendship', name: '우정', imgSrc: '/images/category_friendship.png' },
  { genre: 'moral', name: '교훈/도덕', imgSrc: '/images/category_moral.png' },
  { genre: 'family', name: '가족/사랑', imgSrc: '/images/category_family.png' },
];

export default function StoryCategoryPage() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const characterData = location.state?.character;

  // 선택된 카테고리, 첫 장면, 제작 모드를 관리할 state 추가
  const [selectedCategory, setSelectedCategory] = useState('');
  const [firstScene, setFirstScene] = useState('');
  const [generationMode, setGenerationMode] = useState('textOnly'); // 'textOnly' 또는 'textAndImage'
  const isFormValid = selectedCategory && firstScene.trim() !== '';

  // 카테고리 선택을 처리하는 핸들러
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // 모든 데이터를 취합하여 백엔드로 전송하는 핸들러
  const handleSubmit = async () => {
    // 유효성 검사: 카테고리와 첫 장면이 모두 입력되었는지 확인
    if (!selectedCategory || !firstScene.trim()) {
      return;
    }

    // 백엔드로 보낼 전체 데이터 객체 생성
    const storyData = {
      character: characterData,
      category: selectedCategory,
      firstScene: firstScene,
      // mode: generationMode,
    };

    console.log('백엔드로 전송할 데이터:', storyData);

    try {
      // fetch API를 사용하여 백엔드 서버에 POST 요청
      // '/api/create-story'는 실제 백엔드 API 주소로 변경하기
      const response = await fetch('/api/create-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });

      // if (!response.ok) {
      //   throw new Error('서버 응답에 문제가 발생했습니다.');
      // }

      // const result = await response.json(); // 백엔드로부터 받은 결과
      // console.log('서버로부터 받은 응답:', result);

      alert('멋진 이야기가 곧 시작됩니다!');
      // 성공 시 결과 페이지 등으로 이동할 수 있습니다.
      // navigate('/story/content', { state: { story: result } });
			navigate('/story/content/1');


    } catch (error) {
      console.error('스토리 생성 중 오류 발생:', error);
      alert('스토리 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!characterData) {
    return <div>캐릭터 정보가 없습니다. 캐릭터를 먼저 생성해주세요.</div>;
  }

  return (
    <div className="story-category-container">
      <p>{characterData.name}(이)와 어떤 신나는 이야기를 만들어볼까?</p>
      <div className='story-category-separator'></div>

      <div className="story-category-group">
        {CATEGORIES.map((category) => (
          <div
            key={category.id}
            className={`story-category-item ${selectedCategory === category.name ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="story-category-image-wrapper">
              <img src={category.imgSrc} alt={category.name} />
            </div>
          </div>
        ))}
      </div>

      <textarea
        value={firstScene}
        onChange={(e) => setFirstScene(e.target.value)}
        placeholder="첫 장면에 대해서 설명해주세요. ex) 용이 몬스터를 향해 불을 내뿜고 있다."
      />

      {/* 이거 달리 삭제였던가..? */}
      {/* <div className="generation-mode-selector">
        <button
          className={`mode-btn ${generationMode === 'textOnly' ? 'active' : ''}`}
          onClick={() => setGenerationMode('textOnly')}
        >
          줄거리만 만들래요
        </button>
        <button
          className={`mode-btn ${generationMode === 'textAndImage' ? 'active' : ''}`}
          onClick={() => setGenerationMode('textAndImage')}
        >
          줄거리랑 그림 만들래요
        </button>
      </div> */}

      {/* isFormValid 값에 따라 disabled 상태와 active 클래스가 결정됩니다. */}
      <button
        className={`story-category-submit-btn ${isFormValid ? 'active' : ''}`}
        onClick={handleSubmit}
        disabled={!isFormValid}
      >
        이야기 만들기
      </button>
    </div>

  );
}