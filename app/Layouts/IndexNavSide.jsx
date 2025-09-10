import { Outlet, useSearchParams } from "react-router";

import NavSide from "../components/navigation/NavSide";
import NavSideChild from "../components/navigation/NavSideChild"


export default function IndexNavSide() {
	const [searchParams] = useSearchParams();
	const isChildUser = searchParams.get("user") == "child";
	return (
		<div>
			{isChildUser ? (
				<>
					<NavSideChild />
				</>
			) : (
				<>
					<NavSide />
				</>
			)}
			<Outlet />
		</div>
	)
}