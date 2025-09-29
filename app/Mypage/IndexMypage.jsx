import { useSearchParams, useLoaderData } from "react-router";
import ParentPage from "~/components/mypage/ParentPage";
import ChildPage from "~/components/mypage/ChildPage"
import { getSession } from "~/auth/auth";
import { accessMyProfileInfo } from "~/api/mypage.server";

export default function IndexMypage() {
	console.log("1");

	const [searchParams] = useSearchParams();
	const isChildUser = searchParams.get("user") == "child";
	const myProfileData = useLoaderData() ||[];

	console.log("결과", myProfileData);
	return (
		<div>
			{isChildUser ? (
				<>
					<ChildPage profile = {myProfileData}/>
				</>
			) : (
				<>
					<ParentPage profile = {myProfileData}/>
				</>
			)}
		</div>
	)
}


export async function loader({ request }) {
	const session = await getSession(request.headers.get("Cookie"));
	if (!session.has("childAccessToken")) {
		return redirect("/mypage/login");
	}
	const childAccessToken = session.get("childAccessToken");

	try {
		const myProfileDataResult = await accessMyProfileInfo(childAccessToken);
		console.log("loader: API 호출 결과:", myProfileDataResult);
		if (myProfileDataResult?.isSuccess && myProfileDataResult?.result) {
			return myProfileDataResult.result;
		}

	} catch (error) {
		console.error("loader에서 심각한 오류 발생:", error);
		return [];
	}
}