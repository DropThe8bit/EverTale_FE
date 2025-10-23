import { createVoiceNarration } from '~/api/voice.server'; 
import { getSession } from '~/auth/auth.js';

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");

  if (!childAccessToken) {
    return new Response("인증되지 않았습니다.", { status: 401 });
  }

  const url = new URL(request.url);
  const voiceId = url.searchParams.get('voiceId');
  const storyId = url.searchParams.get('storyId');
  const sceneId = url.searchParams.get('sceneId');

  try {
    // createVoiceNarration이 fetch의 Response 객체를 그대로 반환
    const apiResponse = await createVoiceNarration(childAccessToken, voiceId, storyId, sceneId);

    if (!apiResponse.ok) {
      throw new Error('API 서버에서 음성 생성 실패');
    }

    // API 서버가 보낸 스트리밍 본문과 헤더를 그대로 클라이언트에 전달
    return new Response(apiResponse.body, {
      status: apiResponse.status,
      headers: {
        // 이 헤더가 있어야 브라우저가 오디오 파일로 인식
        'Content-Type': 'audio/mpeg', 
      }
    });
  } catch (error) {
    console.error("음성 스트림 생성 실패:", error);
    return new Response("음성 생성에 실패했습니다.", { status: 500 });
  }
}