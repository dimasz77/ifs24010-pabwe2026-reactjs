import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconLoader2 } from "@tabler/icons-react";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";
import { asyncLogout } from "../../auth/states/action";
import { asyncGetProfile } from "../../users/states/action";

// Route guard: tanpa token -> login; token tidak valid -> sesi dibersihkan.
export default function LostFoundLayout() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.users.profile);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    dispatch(asyncGetProfile()).then((valid) => {
      if (!valid) dispatch(asyncLogout());
    });
  }, [token, dispatch]);

  if (!token) return <Navigate to="/auth/login" replace />;

  if (!profile) {
    return (
      <div role="status" className="grid min-h-screen place-items-center text-indigo-950">
        <span className="flex items-center gap-3 font-semibold">
          <IconLoader2 className="animate-spin" /> Memuat sesi…
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:pl-72">
      <SidebarComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <NavbarComponent onOpenMenu={() => setDrawerOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
