import { useSearchParams, Outlet, useLoaderData } from "react-router";

import NavHeader from "../components/navigation/NavHeader";
import NavHeaderChild from "../components/navigation/NavHeaderChild"
import { getSession } from "~/auth/auth";

export default function IndexNav() {
  const [searchParams] = useSearchParams();
  const isChildUser = searchParams.get("user") == "child";
  const { myName } = useLoaderData() || {};
  return (
    <div>
      {isChildUser ? (
        <>
          <NavHeaderChild myName={myName}/>
        </>
      ) : (
        <>
          <NavHeader myName={myName} />
        </>
      )}
      <Outlet />
    </div>
  )
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const childAccessToken = session.get("childAccessToken");

  if (childAccessToken) {
    const myName = session.get("myName") || [];
    return { myName };
  }
  return { myName: null };
}

