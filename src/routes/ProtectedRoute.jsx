import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
    const location = useLocation();

    const accessToken =
        sessionStorage.getItem("accessToken");

    const token =
        sessionStorage.getItem("token");

    const isAuthenticated =
        Boolean(accessToken || token);

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;