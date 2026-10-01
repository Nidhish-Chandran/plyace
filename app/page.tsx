import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/db";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("plyace_session")?.value;
  const user = token ? getSession(token) : null;

  if (user) {
    if (user.role === "admin") {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  redirect("/login");
}
