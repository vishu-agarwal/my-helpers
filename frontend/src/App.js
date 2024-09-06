import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header";
import Profile from "./components/ProfileFiles/ClientProfile";
import Footer from "./components/layouts/Footer";
import About from "./components/Homepage/AboutPage";
import { lazy, Suspense } from "react";
import Loader from "./components/layouts/LoadingFile";
import ProtectedRoutes from "./RouteComponents/ProtectedRoutes"; //Authenticated routes
import PublicRoute from "./RouteComponents/PublicRoutes";
import PrivateRoute from "./RouteComponents/PrivateRoutes";
const RolePage = lazy(() => import("./components/LoginFiles/Content"));
const LoginPage = lazy(() => import("./components/LoginFiles/Login"));
const HomePage = lazy(() => import("./components/Homepage/HomePage"));
const NoFoundComponent = lazy(() =>
  import("./components/layouts/PageNotFound")
);

const publicRoutes = [
  {
    path: "/",
    Component: RolePage,
  },
  {
    path: "/login/:role",
    Component: LoginPage,
  },
];

const protectedRoutes = [
  {
    path: "/Client/home",
    element: HomePage,
    exact: true,
    role: "C",
  },
  {
    path: "/findHelper",
    element: lazy(() => import("./components/DisplayDataPages/DisplayData")),
    exact: true,
    role: "C",
  },
  {
    path: "/viewHelperDetails/:rid",
    element: lazy(() =>
      import("./components/DisplayDataPages/ViewProfileDetail")
    ),
    exact: true,
    role: "C",
  },
  {
    path: "/Helper/home",
    element: lazy(() => import("./components/Homepage/HiringProcess")),
    exact: true,
    role: "H",
  },
  {
    path: "viewClientDetails/:rid",
    element: lazy(() =>
      import("./components/DisplayDataPages/ViewClientProfile")
    ),
    exact: true,
    role: "H",
  },
];

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className="main-content">
          <Suspense fallback={<Loader isLoad={true} />}>
            <Routes>
              {/* private route for both client and helper */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <PrivateRoute>
                    <About />
                  </PrivateRoute>
                }
              />
              {publicRoutes.map(({ path, Component }) => (
                <Route
                  path={path}
                  key={`public-${path}`}
                  element={
                    <PublicRoute>
                      <Component />
                    </PublicRoute>
                  }
                />
              ))}
              {protectedRoutes.map(({ path, element: Component, role }) => (
                <Route
                  key={`private-${path}`}
                  path={path}
                  element={
                    <PrivateRoute>
                      <ProtectedRoutes role={role}>
                        <Component />
                      </ProtectedRoutes>
                    </PrivateRoute>
                  }
                />
              ))}
              <Route path="*" element={<NoFoundComponent />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
