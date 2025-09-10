import { useSearchParams, Outlet } from "react-router";

import NavHeader from "../components/navigation/NavHeader";
import NavHeaderChild from "../components/navigation/NavHeaderChild"

export default function IndexNav() {
	const [searchParams] = useSearchParams();
	const isChildUser = searchParams.get("user") == "child";
	return (
		<div>
			{isChildUser ? (
				<>
					<NavHeaderChild />
				</>
			) : (
				<>
					<NavHeader />
				</>
			)}
			<Outlet />
		</div>
	)
}