
import { useEffect, useRef, useState } from "react";
import { Link, useFetcher, useLoaderData, useNavigate } from "react-router";
import { detectYoloModel, registrationEasterEggVoice } from "~/api/easteregg.server";
import { getSession } from "~/auth/auth";
import "~/styles/easterEggVoice.css"

export default function EasterEggVoice() {
  const { username, detectData } = useLoaderData();
  const { xcoordinate, ycoordinate, xCoordinate, yCoordinate, width, height } = detectData.detection;

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
  };

  const handleBack = () => {
    navigate(`/easter`);
  };

  return (
    <div className="easteregg-voice-container">
      <p><span>{username} 작가님</span>에게 들려줄 음성메세지를 추가해주세요. {detectData.index}페이지의 해당 네모칸에 메세지가 저장됩니다.<br />
        책을 읽다가 해당 부분을 누르면 사랑의 음성 메세지가 나와요!</p>
      <div className="easteregg-image-wrapper">
        <img
          ref={imgRef}
          onLoad={handleImageLoad}
          onError={handleImageError}
          src={detectData.url}
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
          >취소</button>
          <button
            className="easteregg-voice-submit-btn"
            onClick={() => setIsVoiceModalOpen(true)}
            disabled={isVoiceRegistered}
          >
            {isVoiceRegistered ? '음성 등록 완료' : '음성 메세지 등록'}
          </button>
        </div>
      </div>
      {isVoiceModalOpen && (
        <EasterEggVoiceRegistrationModal
          onClose={() => setIsVoiceModalOpen(false)}
          onSuccess={handleRegistrationSuccess}
          index={detectData.index}
          detection={detectData.detection}
        />
      )}
    </div>
  );
}


// 음성 등록 모달 컴포넌트
function EasterEggVoiceRegistrationModal({ onClose, onSuccess, index, detection }) { // onSuccess prop 추가
  const [fileName, setFileName] = useState('');

  const requestDto = {
    index: index,
    detection: detection,
  };
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

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isSuccess ? (
          <EasterEggSuccessView />
        ) : (
          <>
            <div className="voice-modal-content">
              <h2>이스터에그 등록하기</h2>
              <p>사랑의 음성메세지를 등록해주세요!</p>
            </div>

            <div className="voice-upload-wrapper">
              <p className="upload-label-text">
                <h5>업로드할 음성 파일 (.wav, .mp3)</h5>
              </p>
              <fetcher.Form method="post" encType="multipart/form-data">
                <input type="hidden" name="_action" value="registerEasterEggVoice" />
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
                  <input
                    type="hidden"
                    name="requestDto"
                    value={JSON.stringify(requestDto)}
                  />
                  <label htmlFor="voice-file-upload" className="upload-button">
                    파일 찾기
                  </label>
                  <div className="file-name-display">{fileName || "선택된 파일 없음"}</div>
                </div>
                <div className="modal-buttons">
                  <button type="button" onClick={onClose}>취소</button>
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
function EasterEggSuccessView() {
  return (
    <div className="success-view">
      <h3>등록 완료!</h3>
      <p>이스터에그에 음성메세지가 성공적으로 등록되었어요!</p>
      <Link to={`/easter`} >
        <div className="easteregg-complete-btn">
          확인
        </div>
      </Link>
    </div>
  );
}


export async function loader({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");
  const username = session.get("username");
  const storyId = params.storyId;

  if (!childAccessToken) return redirect(`/mypage/login`);

  const detectData = await detectYoloModel(childAccessToken, storyId);
  if (detectData?.isSuccess) {
    return { username , detectData: detectData.result || [] };
  }
}


export async function action({ request, params }) {
  const { storyId } = params;
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("childAccessToken")) return redirect("/mypage/login");
  const childAccessToken = session.get("childAccessToken");

  const formData = await request.formData();
  const actionType = formData.get("_action");

  // actionType에 따라 분기 처리
  if (actionType === 'registerEasterEggVoice') {
    const voiceFile = formData.get("voiceFile");
    const requestDto_string = formData.get("requestDto");

    console.log(requestDto_string)
    let requestDto = null;
    try {
      requestDto = JSON.parse(requestDto_string);
    } catch (e) {
      // JSON 파싱 실패 시 에러 처리
      return { success: false, message: "잘못된 요청 데이터입니다. (JSON 파싱 실패)" };
    }

    const result = await registrationEasterEggVoice(childAccessToken, voiceFile, storyId, requestDto);
    if (result.isSuccess) {
      return { success: true, message: "목소리가 성공적으로 등록되었습니다." };
    }
  }
}

