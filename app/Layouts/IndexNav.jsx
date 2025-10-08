import { useSearchParams, Outlet, useLoaderData } from "react-router";

import NavHeader from "../components/navigation/NavHeader";
import NavHeaderChild from "../components/navigation/NavHeaderChild"
import { getSession } from "~/auth/auth";

export default function IndexNav() {
  const [searchParams] = useSearchParams();
  const isChildUser = searchParams.get("user") == "child";
  const { username, myName } = useLoaderData() || {};
  return (
    <div>
      {isChildUser ? (
        <>
          <NavHeaderChild username={username}/>
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
    const username = session.get("username") || [];
    const myName = session.get("myName") || [];
    return { username, myName };
  }
  return { username: null, myName: null };
}

