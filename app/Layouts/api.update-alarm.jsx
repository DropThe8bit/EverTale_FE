import { changeStateAlarm } from "~/api/mypage.server";
import { getSession } from "~/auth/auth";

export async function action({ request }) {
    console.log("--- 서버: action 함수 실행 시작 ---"); // [!!!] 이 로그가 찍히는지 확인
    const session = await getSession(request.headers.get("Cookie"));
    const childAccessToken = session.get("childAccessToken");
  
    if (!childAccessToken) {
      return { success: false, message: "인증 실패" };
    }
  
    const formData = await request.formData();
    const actionType = formData.get('_action');
    
    if (actionType === 'changeStateAlarm') {
      const alarmId = formData.get('alarmId');
      const result = await changeStateAlarm(childAccessToken, alarmId);
      console.log("알람 결과", result)
      return { success: true };
    }
  
    return null;
  }