import { isAuthenticated } from "@/lib/auth";
import AdminApp from "./AdminApp";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | Cleannit Janitorial Services",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="admin-shell">
      <h1 style={{ fontSize: "1.6rem" }}>Cleannit Admin</h1>
      {isAuthenticated() ? <AdminApp /> : <LoginForm />}
    </div>
  );
}
