import Home from "@/components/homepage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getServerSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return <Home />;
}
export default Page;
