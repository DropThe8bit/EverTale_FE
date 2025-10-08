import { useEffect, useState } from 'react';
import { redirect, useActionData, useFetcher, useLoaderData, useLocation, useNavigate, useParams, useSubmit } from 'react-router';
import { createNextSceneQuestion, createNextStoryfromAnswer, createSceneImage, setStoryTitle, updateSceneStory } from '~/api/story.server';
import { commitSession, getSession } from '~/auth/auth';
import "~/styles/storyContent.css";


function EditStoryModal({ currentText, onClose, onSave }) {
  // 모달 내부에서 텍스트를 수정할 수 있도록 자체 state를 가집니다.
  const [editedText, setEditedText] = useState(currentText);

  const handleSave = () => {
    onSave(editedText); // 변경된 텍스트를 부모 컴포넌트로 전달
  };

  return (
    <div className="modal-overlay">
      <div className="story-edit-modal-content">
        <h2>줄거리 바꾸기</h2>
        <textarea
          value={editedText}
          className="story-edit-modal-textarea"
          onChange={(e) => setEditedText(e.target.value)}
          rows={10}
        />
        <div className="modal-buttons">
          <button onClick={onClose}>취소</button>
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
}


function NextStoryModal({ question, onClose, onSave }) {
  const [answerText, setAnswerText] = useState('');

  const handleSave = () => {
    onSave(answerText);
  };

  return (
    <div className="modal-overlay">
      <div className="next-story-modal-content">
        <h2>다음에는 어떤 내용이 나올까요?</h2>
        <p>{question}</p>
        <textarea
          className="next-story-modal-textarea"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="여기에 답변을 입력해주세요..."
        />
        <div className="modal-buttons">
          <button onClick={onClose} >취소</button>
          <button onClick={handleSave} >다음 줄거리 만들기</button>
        </div>
      </div>
    </div>
  );
}

function BookNameModal({ onClose, onSubmit }) {
  const [bookName, setBookName] = useState('');

  const handleSubmit = () => {
    onSubmit(bookName); // 입력받은 책 제목을 부모 컴포넌트로 전달
  };

  return (
    <div className="modal-overlay">
      <div className="bookname-modal-content">
        <h2>동화책 제목 정하기</h2>
        <p>어떤 이름으로 이야기를 간직할까요?</p>
        <input
          type="text"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          placeholder="예: 용감한 소연이의 모험"
        />
        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-btn">취소</button>
          <button onClick={handleSubmit} className="confirm-btn">완성된 동화책 보기</button>
        </div>
      </div>
    </div>
  );
}


function LoadingModal() {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 여기에 CSS 스피너나 GIF를 추가하기. */}
        <div className="spinner"></div>
        <p>생성중..</p>
      </div>
    </div>
  );
}





export default function StoryContentPage() {
  const location = useLocation();
  const { storyId, pageNum } = useParams(); // URL에서 현재 페이지 번호를 가져옵니다. (예: '1', '2'...)

  const currentStoryText = useLoaderData(); // loader가 제공하는 페이지의 줄거리
  const [isCurrentStoryText, setCurrentStoryText] = useState(currentStoryText);
  const submit = useSubmit();

  const imageGenerator = useFetcher();
  const isGenerating = imageGenerator.state === 'submitting';

  const questionFetcher = useFetcher();
  const question = questionFetcher.data?.result;
  const storyGeneratorFetcher = useFetcher();

  const isNextQuestion = questionFetcher.state === 'submitting';

  // Array.from()을 사용해 8개의 빈 페이지 객체를 미리 생성
  const [pages, setPages] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      pageNumber: i + 1,
      storyText: '',
      imageFile: null,
      imagePreview: null,
    }))
  );

  const currentPageNumber = parseInt(pageNum, 10);
  const currentPageIndex = currentPageNumber - 1;

  const [isBookNameModalOpen, setIsBookNameModalOpen] = useState(false);
  const [isNextStoryModalOpen, setIsNextStoryModalOpen] = useState(false);
  const [isEditStoryModalOpen, setIsEditStoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 입력창(textarea)의 내용이 바뀔 때마다 pages state를 업데이트하는 함수
  const handleTextChange = (e) => {
    const newText = e.target.value; // pages 배열의 복사본
    const updatedPages = [...pages]; // 현재 페이지에 해당하는 객체의 storyText를 업데이트
    updatedPages[currentPageIndex].storyText = newText;// 전체 pages state를 업데이트
    setPages(updatedPages);
  };

  // 수정된 스토리 저장
  const handleSaveEditStory = (updatedText) => {
    const formData = new FormData();
    formData.append('_action', 'updateStory');
    formData.append('storyText', updatedText);
    submit(formData, { method: 'PATCH' });

    setCurrentStoryText(updatedText);
    setIsEditStoryModalOpen(false);
  };

  // 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedPages = [...pages];
      updatedPages[currentPageIndex].imageFile = file;
      updatedPages[currentPageIndex].imagePreview = URL.createObjectURL(file);
      setPages(updatedPages);
    }
  };

  // '다음으로 넘어가기' 또는 '이야기 완성하기' 버튼 핸들러
  const handleFetchQuestionorSetTitle = () => {
    if (currentPageNumber < 8) {
      const formData = new FormData();
      formData.append('_action', 'nextSceneQuestion');
      questionFetcher.submit(formData, { method: 'post' });
    } else {
      // 8페이지에서 제목 짓기
      setIsBookNameModalOpen(true);
    }
  };

  useEffect(() => {
    // fetcher가 데이터를 받아왔고, 그 안에 결과값이 존재하면 모달을 열기
    if (questionFetcher.data?.result) {
      setIsNextStoryModalOpen(true);
    }
  }, [questionFetcher.data]);

  // 질문 답변 기반 줄거리 생성 
  const handleCreateNextStory = (userAnswer) => {
    const formData = new FormData();
    formData.append('_action', 'createNextStory');
    formData.append('question', question);
    formData.append('userAnswer', userAnswer);

    storyGeneratorFetcher.submit(formData, { method: 'post' });

    setIsNextStoryModalOpen(false);
    setIsLoading(true);
  };

  useEffect(() => {
    console.log("URL이 변경되었습니다:", location.pathname);
    // fetcher의 상태가 'idle'(작업 완료)이고, action으로부터 데이터를 받았다면
    if (isLoading) {
      setIsLoading(false);
      window.location.reload();
    }
  }, [location.pathname]);

  // 제목 저장
  const handleSaveStoryName = (storyName) => {
    const formData = new FormData();
    formData.append('_action', 'saveStoryName');
    formData.append('storyName', storyName);
    submit(formData, { method: 'PATCH' });

    setIsBookNameModalOpen(false);
  };


  return (
    <>
      <div className="story-content-container">
        <div className="story-text-section">
          <div className="story-conetent-display">
            {isCurrentStoryText}
            <div className="story-conetent-page-number">
              <span>{pageNum}</span>
              <div type="button" className="story-content-edit-button" onClick={() => { setIsEditStoryModalOpen(true) }} >
                줄거리 수정
              </div>
            </div>
          </div>
        </div>

        <div className="story-conetent-image-section">
          <imageGenerator.Form method="post" encType="multipart/form-data">
            <div className="story-conetent-image-uploader-wrapper">
              <input
                name="uploadedImage"
                type="file"
                id={`image-upload-${currentPageNumber}`}
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor={`image-upload-${currentPageNumber}`} className="story-conetent-image-uploader">
                {imageGenerator.data?.result ? (
                  <img src={imageGenerator.data.result} alt="생성된 그림" className="story-conetent-image-preview" />
                ) : pages[currentPageIndex].imagePreview ? (
                  <img src={pages[currentPageIndex].imagePreview} alt={`${currentPageNumber}페이지 그림`} className="story-conetent-image-preview" />
                ) : (
                  <div className="story-conetent-uploader-placeholder">
                    <span>🖼️</span>
                    <p>{currentPageNumber}페이지 그림을 올려주세요</p>
                  </div>
                )}
              </label>
            </div>

            <div className="story-conetent-image-textarea-wrapper">
              <textarea
                name="description"
                value={pages[currentPageIndex].storyText}
                onChange={handleTextChange}
                placeholder="그림에 대한 설명을 입력해주세요."
              />

              {/* action을 구분하기 위한 hidden input */}
              <input type="hidden" name="_action" value="generateImage" />

              <button className="story-conetent-image-generating-btn" disabled={isGenerating}>
                그림 생성
              </button>
              {isGenerating && <LoadingModal />}
            </div>

          </imageGenerator.Form>
          <button className="story-conetent-submit-btn" onClick={handleFetchQuestionorSetTitle} disabled={isNextQuestion} >
          {isNextQuestion && <LoadingModal />}

            {currentPageNumber < 8 ? '다음으로 넘어가기' : '이야기 완성하기'}
          </button>
        </div>
      </div>


      {isEditStoryModalOpen && (
        <EditStoryModal
          currentText={isCurrentStoryText}
          onClose={() => setIsEditStoryModalOpen(false)}
          onSave={handleSaveEditStory}
        />
      )
      }
      {isNextStoryModalOpen &&
        <NextStoryModal
          question={questionFetcher.data.result}
          onClose={() => setIsNextStoryModalOpen(false)}
          onSave={handleCreateNextStory}
        />
      }
      {isLoading && <LoadingModal />}

      {isBookNameModalOpen &&
        <BookNameModal onClose={() => setIsBookNameModalOpen(false)} onSubmit={handleSaveStoryName}
        />
      }

    </>
  );
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const StoryResult = session.get("StoryResult");

  if (!StoryResult) {
    return redirect("/");
  }

  return StoryResult;
}



export async function action({ request, params }) {
  const formData = await request.formData();
  const { storyId, pageNum } = params;

  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("childAccessToken")) return redirect("/mypage/login");
  const childAccessToken = session.get("childAccessToken");

  const actionType = formData.get("_action");

  // actionType에 따라 분기 처리
  if (actionType === 'updateStory') {
    const updatedContent = formData.get("storyText");
    const result = await updateSceneStory(childAccessToken, storyId, pageNum, updatedContent);
  }

  else if (actionType === 'generateImage') {
    const sketch = formData.get("uploadedImage");
    const prompt = formData.get("description");

    const generatedImageUrl = await createSceneImage(childAccessToken, storyId, pageNum, sketch, prompt);

    return generatedImageUrl;
  }

  else if (actionType === 'nextSceneQuestion') {
    const nextPageNum = parseInt(pageNum, 10) + 1;
    const nextSceneQuestion = await createNextSceneQuestion(childAccessToken, storyId, nextPageNum);
    return nextSceneQuestion;
  }

  else if (actionType === 'createNextStory') {
    const question = formData.get('question');
    const answer = formData.get('userAnswer');
    const nextPageNum = parseInt(pageNum, 10) + 1;
    const newStoryResult = await createNextStoryfromAnswer(childAccessToken, storyId, nextPageNum, question, answer);

    if (newStoryResult.isSuccess) {
      session.flash("StoryResult", newStoryResult.result);
      return redirect(`/story/${storyId}/${nextPageNum}`, {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    } else {
      return { error: newStoryResult.message };
    }
  }

  else if (actionType === 'saveStoryName') {
    const title = formData.get('storyName');
    const storyTitle = await setStoryTitle(childAccessToken, storyId, title);
    return redirect("/mybook");
  }

  return { error: "알 수 없는 요청입니다." };
}

