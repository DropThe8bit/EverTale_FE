import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import "~/styles/storyContent.css";

function EditNextStoryModal({ currentText, onClose, onSave }) {
	const [editedText, setEditedText] = useState(currentText);

	const handleSave = () => {
		onSave(editedText); // 수정된 텍스트를 부모로 전달
		setIsEditModalOpen(false);
	};

	return (
		<div className="modal-overlay">
			<div className="story-edit-modal-content">
				<h2>다음에는 어떤 내용이 나올까요?</h2>
				{/* 생성된 질문 */}
				<p>소연이는 할머니의 다락방에서 반짝이는 상자를 발견했어요.

					소연이는 뭘 발견했을까요?</p>
				<textarea
					className="story-edit-modal-textarea"
					value={editedText}
					onChange={(e) => setEditedText(e.target.value)}
				/>
				<div className="modal-buttons">
					<button onClick={onClose} className="cancel-btn">취소</button>
					<button onClick={handleSave} className="confirm-btn">줄거리 생성하기</button>
				</div>
			</div>
		</div>
	);
}

function BookNameModal({ onClose, onSubmit }) {
	const [bookName, setBookName] = useState('');

	const handleSubmit = () => {
		if (!bookName.trim()) {
			alert('동화책의 제목을 입력해주세요!');
			return;
		}
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


export default function StoryContentPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { pageId } = useParams(); // URL에서 현재 페이지 번호를 가져옵니다. (예: '1', '2'...)

	// 이전 페이지에서 전체 스토리에 대한 데이터를 받아옵니다.
	const storyInfo = location.state?.content;

	// Array.from()을 사용해 8개의 빈 페이지 객체를 미리 생성
	const [pages, setPages] = useState(() =>
		Array.from({ length: 8 }, (_, i) => ({
			pageNumber: i + 1,
			storyText: '',
			imageFile: null,
			imagePreview: null,
		}))
	);

	// 현재 페이지 번호 (URL에서 받은 pageId는 문자열이므로 숫자로 변환)
	const currentPageNumber = parseInt(pageId, 10);
	// 배열은 0부터 시작하므로 현재 페이지 데이터에 접근하기 위한 인덱스
	const currentPageIndex = currentPageNumber - 1;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// 입력창(textarea)의 내용이 바뀔 때마다 pages state를 업데이트하는 함수
	const handleTextChange = (e) => {
		const newText = e.target.value;
		// pages 배열의 복사본
		const updatedPages = [...pages];
		// 현재 페이지에 해당하는 객체의 storyText를 업데이트
		updatedPages[currentPageIndex].storyText = newText;
		// 전체 pages state를 업데이트
		setPages(updatedPages);
	};

	// 수정된 줄거리 저장하는 함수
	const handleSaveStoryText = (newText) => {
		const updatedPages = [...pages];
		updatedPages[currentPageIndex].storyText = newText;
		setPages(updatedPages);
		setIsEditModalOpen(false); // 저장 후 모달 닫기
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
	const handleNext = () => {
		setIsEditModalOpen(true);

		if (currentPageNumber < 8) {
			navigate(`/story/content/${currentPageNumber + 1}`, { state: { content: storyInfo } });
		} else {
			// 8페이지에서 제목 짓기
			setIsModalOpen(true);
		}
	};

	const handleFinalSubmit = async (bookName) => {
		setIsModalOpen(false); // 제출 시작과 함께 모달 닫기

		const formData = new FormData();
		formData.append('storyInfo', JSON.stringify({ ...storyInfo, bookName })); // 스토리 정보에 책 제목 추가
		pages.forEach((page) => {
			formData.append(`storyText_p${page.pageNumber}`, page.storyText);
			if (page.imageFile) {
				formData.append(`imageFile_p${page.pageNumber}`, page.imageFile);
			}
		});

		console.log('최종적으로 서버에 보낼 데이터 (책 제목 포함):', formData);
		alert('동화책이 완성되었어요!');

		try {
			const response = await fetch('/api/create-full-story', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) throw new Error('서버 응답 에러');

			const result = await response.json();
			console.log('서버로부터 받은 최종 결과:', result);
			// navigate(`/mybook/${result.bookName}/1`);

		} catch (error) {
			console.error('스토리 생성 중 오류 발생:', error);
			alert('스토리 생성에 실패했습니다. 다시 시도해주세요.');
		}
	};


	// // 이전 페이지에서 데이터를 못 받아온 경우 처리
	// if (!storyInfo) {
	//   return <div>잘못된 접근입니다. 이야기 만들기를 처음부터 시작해주세요.</div>;
	// }


	return (
		<>
			<div className="story-content-container">
				<div className="story-text-section">
					<div className="story-conetent-display">
						이전 페이지에서 AI가 생성해준 줄거리
					</div>
				</div>

				<div className="story-conetent-image-section">
					<div className="story-conetent-image-uploader-wrapper">
						<input
							type="file"
							id={`image-upload-${currentPageNumber}`} // 각 페이지마다 고유 id 부여
							accept="image/*"
							onChange={handleImageUpload}
							style={{ display: 'none' }}
						/>
						<label htmlFor={`image-upload-${currentPageNumber}`} className="story-conetent-image-uploader">
							{pages[currentPageIndex].imagePreview ? (
								<img src={pages[currentPageIndex].imagePreview} alt={`${currentPageNumber}페이지 그림`} className="story-conetent-image-preview" />
							) : (
								<div className="story-conetent-uploader-placeholder">
									<span>🖼️</span>
									<p>{currentPageNumber}페이지 그림을 올려주세요</p>
								</div>
							)}
						</label>
					</div>

					<textarea
						name="imageText" 
						value={pages[currentPageIndex].storyText} // 현재 페이지에 맞는 텍스트를 표시
						onChange={handleTextChange} // 핸들러 연결
						placeholder="그림에 대한 설명을 입력해주세요."
					/>
					<button className="story-conetent-submit-btn" onClick={handleNext}>
						{currentPageNumber < 8 ? '다음으로 넘어가기' : '이야기 완성하기'}
					</button>
				</div>
			</div>

			{isModalOpen &&
				<BookNameModal onClose={() => setIsModalOpen(false)} onSubmit={handleFinalSubmit}
				/>
			}
			{isEditModalOpen &&
				<EditNextStoryModal currentText={pages[currentPageIndex].storyText} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveStoryText}
				/>
			}

		</>
	);
}
