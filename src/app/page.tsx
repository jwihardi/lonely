import { getServerSession } from "next-auth";
import SessionProvider from "./components/SessionProvider";
import NavMenu from "./components/NavMenu";



export default async function Home() {
  const session = await getServerSession();

  return (
    <SessionProvider session={session}>
    <NavMenu />
    </SessionProvider>
  );
}