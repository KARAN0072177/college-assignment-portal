import Link from "next/link";

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Site name */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          College Assignment Portal
        </Link>

        {/* Right: Navigation */}
        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </>
          )}

          {isLoggedIn && (
            <form action="/api/logout" method="POST">
              <button
                type="submit"
                className="text-red-600 hover:underline"
              >
                Logout
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}