import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = (await cookies()).get("session")?.value;
  const isLoggedIn = Boolean(sessionCookie);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}