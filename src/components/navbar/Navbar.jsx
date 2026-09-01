import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  CarFront,
  Menu,
  UserCircle,
  X,
  LogOut,
  LayoutDashboard,
  Wrench,
} from "lucide-react";

import { useEffect, useState } from "react";

import { logoutUser } from "../../services/authApi";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null,
    user: null,
  });

  const [loggingOut, setLoggingOut] =
    useState(false);

  const getStoredUser = () => {
    try {
      const authUser =
        sessionStorage.getItem("authUser");

      if (authUser) {
        return JSON.parse(authUser);
      }

      const user =
        sessionStorage.getItem("user");

      if (user) {
        return JSON.parse(user);
      }

      return null;
    } catch (error) {
      console.error(
        "FAILED TO READ STORED USER:",
        error
      );

      return null;
    }
  };
  const getStoredRole = () => {
    const authRole =
      sessionStorage.getItem("authRole");

    if (
      authRole === "user" ||
      authRole === "mechanic" ||
      authRole === "admin"
    ) {
      return authRole;
    }

    const user =
      getStoredUser();

    if (
      user?.role === "user" ||
      user?.role === "mechanic" ||
      user?.role === "admin"
    ) {
      return user.role;
    }

    return null;
  };
  const checkAuth = () => {
    const accessToken =
      sessionStorage.getItem(
        "accessToken"
      );

    const user =
      getStoredUser();

    const role =
      getStoredRole();

    const isLoggedIn =
      Boolean(accessToken);

    setAuth({
      isLoggedIn,
      role: isLoggedIn
        ? role
        : null,
      user: isLoggedIn
        ? user
        : null,
    });
  };

  useEffect(() => {
    checkAuth();

    // Login/logout event
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener(
      "authChanged",
      handleAuthChange
    );

    // Backward compatibility
    window.addEventListener(
      "authChange",
      handleAuthChange
    );
    //

    window.addEventListener(
      "storage",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        handleAuthChange
      );

      window.removeEventListener(
        "authChange",
        handleAuthChange
      );

      window.removeEventListener(
        "storage",
        handleAuthChange
      );
    };
  }, []);

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const role = auth.role;

  const isMechanic =
    role === "mechanic";

  const isCustomer =
    role === "user";

  const customerNavItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "Bookings",
      path: "/bookings",
    },
    {
      name: "Mechanics",
      path: "/mechanics",
    },
    {
      name: "Vehicles",
      path: "/vehicles",
    },
    {
      name: "AI Assistant",
      path: "/AIassistant",
    },
    {
      name: "About Us",
      path: "/about",
    },
  ];
  const mechanicNavItems = [
    {
      name: "Dashboard",
      path: "/mechanic/dashboard",
    },
    {
      name: "Bookings",
      path: "/mechanic/bookings",
    },
    {
      name: "Customers",
      path: "/mechanic/customers",
    },
    {
      name: "Earnings",
      path: "/mechanic/earnings",
    },
    {
      name: "About Us",
      path: "/about",
    },
  ];

  const guestNavItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "Mechanics",
      path: "/mechanics",
    },
    {
      name: "Vehicles",
      path: "/vehicles",
    },
    {
      name: "AI Assistant",
      path: "/ai-chat",
    },
    {
      name: "About Us",
      path: "/about",
    },
  ];

  const navItems = isMechanic
    ? mechanicNavItems
    : isCustomer
      ? customerNavItems
      : guestNavItems;

  const userName =
    auth.user?.name ||
    auth.user?.fullName ||
    auth.user?.username ||
    (isMechanic
      ? "Mechanic"
      : "Customer");

  const profileRoute =
    isMechanic
      ? "/mechanic/profile"
      : "/profile";

  const dashboardRoute =
    isMechanic
      ? "/mechanic/dashboard"
      : "/dashboard";

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      try {
        await logoutUser();
      } catch (error) {
        console.warn(
          "BACKEND LOGOUT FAILED:",
          error?.response?.data ||
          error?.message
        );
      }
      sessionStorage.removeItem(
        "accessToken"
      );

      sessionStorage.removeItem(
        "refreshToken"
      );

      sessionStorage.removeItem(
        "authRole"
      );

      sessionStorage.removeItem(
        "authUser"
      );

      sessionStorage.removeItem(
        "user"
      );
      sessionStorage.removeItem(
        "verificationToken"
      );

      sessionStorage.removeItem(
        "mechanicVerificationToken"
      );

      sessionStorage.removeItem(
        "pendingAuthRole"
      );

      sessionStorage.removeItem(
        "pendingAuthEmail"
      );

      sessionStorage.removeItem(
        "resetPasswordToken"
      );
      setAuth({
        isLoggedIn: false,
        role: null,
        user: null,
      });

      setMobileOpen(false);
      window.dispatchEvent(
        new Event("authChanged")
      );

      window.dispatchEvent(
        new Event("authChange")
      );
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );
      sessionStorage.removeItem(
        "accessToken"
      );

      sessionStorage.removeItem(
        "refreshToken"
      );

      sessionStorage.removeItem(
        "authRole"
      );

      sessionStorage.removeItem(
        "authUser"
      );

      sessionStorage.removeItem(
        "user"
      );

      setAuth({
        isLoggedIn: false,
        role: null,
        user: null,
      });

      window.dispatchEvent(
        new Event("authChanged")
      );

      navigate("/login", {
        replace: true,
      });
    } finally {
      setLoggingOut(false);
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">

      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition duration-300 group-hover:-translate-y-0.5">
            <CarFront size={23} />
          </div>

          <div className="leading-none">
            <h1 className="text-[21px] font-extrabold tracking-tight text-slate-900">
              Quick
              <span className="text-blue-600">
                Fix
              </span>
            </h1>

            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Vehicle Care
            </p>
          </div>
        </Link>
        <nav className="hidden h-full items-center lg:flex">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex h-full items-center px-3 text-[14px] font-medium transition-colors ${isActive
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}

                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[3px] rounded-t-full bg-blue-600 transition-all duration-300 ${isActive
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0"
                      }`}
                  />
                </>
              )}
            </NavLink>
          ))}

        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {auth.isLoggedIn && (
            <>
              <button
                type="button"
                className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-blue-600 sm:flex"
              >
                <Bell size={20} />

                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  0
                </span>
              </button>

              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            </>
          )}
          {auth.isLoggedIn ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to={dashboardRoute}
                className="hidden max-w-[170px] items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-slate-50 md:flex"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  {isMechanic ? (
                    <Wrench size={18} />
                  ) : (
                    <UserCircle size={19} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-800">
                    {userName}
                  </p>

                  <p className="text-[10px] font-medium capitalize text-slate-400">
                    {isMechanic
                      ? "Mechanic"
                      : "Customer"}
                  </p>
                </div>
              </Link>
              <Link
                to={profileRoute}
                title="My Profile"
                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20"
              >
                <UserCircle
                  size={21}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={17} />
                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </button>

            </div>
          ) : (

            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/register"
                className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Login
              </Link>

            </div>
          )}
          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (previous) =>
                  !previous
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white lg:hidden">

          <nav className="mx-auto flex max-w-[1440px] flex-col gap-1 px-5 py-4 sm:px-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            {auth.isLoggedIn ? (
              <>
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {isMechanic ? (
                      <Wrench size={19} />
                    ) : (
                      <UserCircle size={20} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {userName}
                    </p>

                    <p className="text-xs capitalize text-slate-400">
                      {isMechanic
                        ? "Mechanic"
                        : "Customer"}
                    </p>
                  </div>

                </div>


                <Link
                  to={dashboardRoute}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-50 text-sm font-semibold text-blue-600"
                >
                  <LayoutDashboard
                    size={18}
                  />

                  Dashboard
                </Link>

                <Link
                  to={profileRoute}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
                >
                  <UserCircle
                    size={18}
                  />

                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-semibold text-red-600 disabled:opacity-60"
                >
                  <LogOut
                    size={18}
                  />

                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>

              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="mt-2 flex h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="flex h-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white"
                >
                  Login
                </Link>

              </>
            )}

          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;