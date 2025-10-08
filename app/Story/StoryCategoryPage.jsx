import React, { useEffect, useState } from 'react';
import { Form, redirect, useActionData, useLocation, useNavigate, useNavigation, useParams, useSearchParams } from 'react-router';
import { createInitStory } from '~/api/story.server';
import { getSession, commitSession } from '~/auth/auth';
import "~/styles/storyCategory.css";

// 카테고리 데이터를 배열로 관리하여 효율성을 높이기
const CATEGORIES = [
  { id: 1, genre: "ADVENTURE", name: '모험', imgSrc: '/images/category_adventure.png' },
  { id: 2, genre: "FRIENDSHIP", name: '우정', imgSrc: '/images/category_friendship.png' },
  { id: 3, genre: "MORAL", name: '교훈/도덕', imgSrc: '/images/category_moral.png' },
  { id: 4, genre: "FAMILY", name: '가족/사랑', imgSrc: '/images/category_family.png' },
];

export default function StoryCategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // const characterData = location.state?.character;

  // 선택된 카테고리, 첫 장면, 제작 모드를 관리할 state 추가
  const [selectedCategory, setSelectedCategory] = useState('');
  const [firstScene, setFirstScene] = useState('');
  const [generationMode, setGenerationMode] = useState('textOnly'); // 'textOnly' 또는 'textAndImage'
  const isFormValid = selectedCategory && firstScene.trim() !== '';

  // 카테고리 선택을 처리하는 핸들러
  const handleCategoryClick = (categoryGenre) => {
    setSelectedCategory(categoryGenre);
  };

  const [searchParams] = useSearchParams();
  const [characterName, setCharacterName] = useState("");

  useEffect(() => {
    // 페이지가 브라우저에 로드된 후에 이 코드가 실행됩니다.
    const name = searchParams.get('char');
    if (name) {
      setCharacterName(name);
    }
  }, [searchParams]); // searchParams가 변경될 때마다 실행

  const navigation = useNavigation();
  const isLoading = navigation.state === 'submitting';

  return (
    <div className="story-category-container">
      <p>{characterName}(이)와 어떤 신나는 이야기를 만들어볼까?</p>
      <div className='story-category-separator'></div>
      <Form method="post">
        <div className="story-category-group">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              className={`story-category-item ${selectedCategory === category.genre ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(category.genre)}
            >
              <div className="story-category-image-wrapper">
                <img src={category.imgSrc} alt={category.name} />
              </div>
            </div>
          ))}
        </div>
        <input type="hidden" name="genre" value={selectedCategory} />

        <textarea
          name="worldView"
          value={firstScene}
          onChange={(e) => setFirstScene(e.target.value)}
          placeholder="첫 장면이나 세계관에 대해서 설명해주세요. ex) 용이 몬스터를 향해 불을 내뿜고 있다."
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
          type="submit"
          className={`story-category-submit-btn ${isFormValid ? 'active' : ''}`}
          disabled={!isFormValid}
        >
          이야기 만들기
        </button>
      </Form>
      {isLoading && (
        <StoryPreviewModal
          isLoading={isLoading}
          onClose={() => window.location.reload()} // '다시 만들기'는 페이지 새로고침
        />
      )}
    </div>
  );
}




function StoryPreviewModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center', padding: '2rem' }}>
        <h3>줄거리 생성 중...</h3>
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', marginBottom: '16px', fontSize: '16px' }}>흥미로운 줄거리를 만들고 있어요!<br /> </p>
        <div className="form-buttons">
          <button type="button" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}


export async function action({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("childAccessToken");
  if (!token) {
    return redirect(`/mypage/login`);
  }

  const storyId = parseInt(params.storyId, 10);
  const formData = await request.formData();
  const genre = formData.get("genre");
  const worldView = formData.get("worldView");

  if (!genre || !worldView) {
    return json({ error: "장르와 첫 장면을 모두 입력해주세요." }, { status: 400 });
  }

  const initStoryData = {
    genre: genre,
    worldView: worldView,
  };

  const result = await createInitStory(token, storyId, initStoryData);

  if (result?.isSuccess) {
    session.flash("StoryResult", result.result);
    console.log(result.result)

    return redirect(`/story/${storyId}/1`, {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } else {
    // 실패 시에는 현재 페이지에 에러 메시지를 전달합니다.
    return { error: result?.message || "초기 줄거리 생성에 실패했습니다." };
  }
}

