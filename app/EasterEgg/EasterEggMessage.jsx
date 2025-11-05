const DUMMY = {
    "index": 8,
    "url": "https://evertale-static-files.s3.ap-northeast-2.amazonaws.com/generated_images/a990f8e4e480404f88920efc0bc01dfa.png",
    "detection": {
      "width": 167.7467803955078,
      "height": 258.39484,
      "xCoordinate": 520.0354,
      "yCoordinate": 293.59863
    }
  }
  
  // "url": "https://evertale-static-files.s3.ap-northeast-2.amazonaws.com/generated_images/b6d187ce00754b949ddf237c7b375b49.png",
  // "detection": {
  //   "width": 96.226,
  //   "height": 231.94855,
  //   "xCoordinate": 215.14238,
  //   "yCoordinate": 387.04285
  // }
  
  // "url": "https://evertale-static-files.s3.ap-northeast-2.amazonaws.com/generated_images/a990f8e4e480404f88920efc0bc01dfa.png",
  // "detection": {
  //   "width": 167.7467803955078,
  //   "height": 258.39484,
  //   "xCoordinate": 520.0354,
  //   "yCoordinate": 293.59863
  
  
  import { useEffect, useRef, useState } from "react";
  import { useFetcher, useNavigate } from "react-router";
  import "~/styles/easterEggVoice.css"
  
  export default function EasterEggVoice() {
    const { xCoordinate, yCoordinate, width, height } = DUMMY.detection;
    const original_xmin = xCoordinate - width;
    const original_ymin = yCoordinate - height;
    const original_width = width * 2;
    const original_height = height * 2;
    const [scaledDetection, setScaledDetection] = useState();
    const imgRef = useRef(null);
  
    const handleImageLoad = () => {
      if (!imgRef.current) return;
  
      if (scaledDetection) return;
  
      const { naturalWidth } = imgRef.current;
      const { offsetWidth } = imgRef.current;
  
      if (naturalWidth === 0) return;
  
      const scaleRatio = offsetWidth / naturalWidth;
      const scaledResult = {
        left: original_xmin * scaleRatio,
        top: original_ymin * scaleRatio,
        width: original_width * scaleRatio,
        height: original_height * scaleRatio,
      };
      setScaledDetection(scaledResult);
    };
  
    useEffect(() => {
      if (imgRef.current) {
        if (imgRef.current.complete) {
          console.log("이미지 (complete: true) - 수동으로 handleImageLoad 실행");
          handleImageLoad();
        }
      }
    }, []); // 컴포넌트가 처음 마운트될 때 '한 번만' 실행
  
    // 이미지 로드 실패 시 콘솔에 에러띄우기
    const handleImageError = () => {
      console.error("이미지 로드 실패! URL을 확인하세요:", DUMMY.url);
    };
  
  
  
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
    const [isVoiceRegistered, setIsVoiceRegistered] = useState(false);
    const navigate = useNavigate();
  
    const handleRegistrationSuccess = () => {
      setIsVoiceRegistered(true); // 음성 등록 상태를 true로 변경
      setIsVoiceModalOpen(false); // 모달 닫기
    };
  
    const handleBack = () => {
      navigate(`/easter`);
    };
  
    return (
      <div className="easteregg-voice-container">
        <p>들려줄 음성메세지를 추가해주세요.<br />
          {DUMMY.index}페이지 네모칸에 메세지가 저장됩니다!</p>
        <div className="easteregg-image-wrapper">
          <img
            ref={imgRef}
            onLoad={handleImageLoad}
            onError={handleImageError} 
            src={DUMMY.url}
            alt="easteregg-voice-image"
          />
  
          {scaledDetection && (
            <div
              className="easteregg-bounding-box"
              style={{
                left: `${scaledDetection.left}px`,
                top: `${scaledDetection.top}px`,
                width: `${scaledDetection.width}px`,
                height: `${scaledDetection.height}px`
              }}
            ></div>
          )}
  
          <div className="easteregg-voice-register">
          <button
              className="easteregg-voice-back-btn"
              onClick={handleBack}
            >메뉴로 돌아가기</button>
            <button
              className="easteregg-voice-submit-btn"
              onClick={() => setIsVoiceModalOpen(true)}
              disabled={isVoiceRegistered}
            >
              {isVoiceRegistered ? '음성 등록 완료' : '음성 녹음'}
            </button>
          </div>
        </div>
        {isVoiceModalOpen && (
          <VoiceRegistrationModal
            onClose={() => setIsVoiceModalOpen(false)}
            onSuccess={handleRegistrationSuccess}
          />
        )}
      </div>
    );
  }
  
  
  
  // 음성 등록 모달 컴포넌트
  function VoiceRegistrationModal({ onClose, onSuccess }) { // onSuccess prop 추가
    const [fileName, setFileName] = useState('');
  
    // 사용자가 파일을 선택했을 때 실행되는 함수
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setFileName(file.name);
      }
    };
  
    const fetcher = useFetcher();
    const isSuccess = fetcher.data?.success === true;
    const isSubmitting = fetcher.state === 'submitting';
  
    // 등록 성공 시(isSuccess가 true가 될 때) 실행되는 Effect
    useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => {
          onSuccess(); // onClose 대신 onSuccess를 호출하여 부모 상태 변경
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [isSuccess, onSuccess]); // 의존성 배열에 onSuccess 추가
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {isSuccess ? (
            <SuccessView />
          ) : (
            <>
              <div className="voice-modal-content">
                <h2>이스터에그 등록하기</h2>
                <p>사랑의 음성메세지를 등록해주세요!<br />마이크를 가까이 두고 10초 이내로 녹음해 주세요.</p>
              </div>
              <div className="voice-upload-wrapper">
                <p className="upload-label-text">
                  <h5>업로드할 음성 파일 (.wav, .mp3)</h5>
                </p>
                <fetcher.Form method="post" encType="multipart/form-data">
                  <input type="hidden" name="_action" value="registrationVoice" />
                  <div className="upload-box">
                    <input
                      id="voice-file-upload"
                      type="file"
                      name="voiceFile"
                      accept=".wav, .mp3, audio/*" // 오디오 파일 필터링
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      required
                    />
                    <label htmlFor="voice-file-upload" className="upload-button">
                      파일 찾기
                    </label>
                    <span className="file-name-display">{fileName || "선택된 파일 없음"}</span>
                  </div>
                  <div className="modal-buttons">
                    <button type="button" onClick={onClose}>취소</button>
                    {/* 파일이 선택되지 않으면 등록 버튼 비활성화 */}
                    <button type="submit" disabled={isSubmitting || !fileName}>
                      {isSubmitting ? '등록 중...' : '등록'}
                    </button>
                  </div>
                </fetcher.Form>
              </div>
            </>)}
        </div >
      </div >
    );
  }
  
  // 등록 완료 시 보여줄 컴포넌트
  function SuccessView() {
    return (
      <div className="success-view">
        <h3>등록 완료!</h3>
        <p>이스터에그에 음성메세지가 성공적으로 등록되었어요!</p>
      </div>
    );
  }
  