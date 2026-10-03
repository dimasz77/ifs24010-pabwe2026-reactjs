import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./features/auth/layouts/AuthLayout";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

// Halaman dashboard dimuat lazy: pengunjung yang hanya membuka halaman login
// tidak perlu mengunduh kode dashboard (mengurangi "unused JavaScript").
const LostFoundLayout = lazy(() => import("./features/lost-founds/layouts/LostFoundLayout"));
const HomePage = lazy(() => import("./features/lost-founds/pages/HomePage"));
const DetailPage = lazy(() => import("./features/lost-founds/pages/DetailPage"));
const UsersPage = lazy(() => import("./features/users/pages/UsersPage"));
const ProfilePage = lazy(() => import("./features/users/pages/ProfilePage"));

// Tamu langsung diarahkan ke login tanpa mengunduh chunk dashboard.
function PrivateArea({ children }) {
  const token = useSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/auth/login" replace />;
  return children;
}

const lazyPage = (element) => <Suspense fallback={null}>{element}</Suspense>;

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/"
        element={<PrivateArea>{lazyPage(<LostFoundLayout />)}</PrivateArea>}
      >
        <Route index element={lazyPage(<HomePage />)} />
        <Route path="lost-founds/:id" element={lazyPage(<DetailPage />)} />
        <Route path="users" element={lazyPage(<UsersPage />)} />
        <Route path="profile" element={lazyPage(<ProfilePage />)} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
