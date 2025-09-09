import { useSearchParams } from "react-router";

import ParentPage from "~/Mypage/ParentPage";
import ChildPage from "~/Mypage/ChildPage"

export default function IndexMypage() {
	const [searchParams] = useSearchParams();
	const isChildUser = searchParams.get("user") == "child";
	return (
		<div>
			{isChildUser ? (
				<>
					<ChildPage />
				</>
			) : (
				<>
					<ParentPage />
				</>
			)}
		</div>
	)
}