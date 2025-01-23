import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Login from "./pages/Login.jsx";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import store from "./store/index.jsx";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RootLayout from "./components/root.jsx";
import Marks from "./pages/Marks-Entry.jsx";
import Analysis from "./pages/Analysis.jsx";
import Students from "./pages/Students.jsx";
import CompleteAnalysis from "./pages/completeAnalysis.tsx";
import StudentLogin from "./pages/studentlogin.jsx";
import TotalAnalysis from "./pages/TotalAnalysis.jsx";

const loaderFunction = () => {
  // const url = new URL(request.url);
  // const pathname = url.pathname;
  // console.log(pathname)
  const status = localStorage.getItem("status");
  if (status === "false") {
    return redirect("/login");
  }
  // if (status === "true" && pathname === "/login") return redirect("/");
};
const userLoaderFunction = () => {
  const status = localStorage.getItem("userstatus");
  if (status === "false") {
    return redirect("/studentlogin");
  }
};
const router = createBrowserRouter([
  { id: 1, path: "/login", element: <Login /> },
  { id: 10, path: "/Studentlogin", element: <StudentLogin /> },
  {
    id: 10,
    path: "/totalAnalysis",
    element: <TotalAnalysis />,
    loader: userLoaderFunction,
  },
  {
    id: 2,
    path: "/",
    element: <RootLayout />,
    loader: loaderFunction,
    children: [
      {
        index: true,
        path: "/",
        element: <Dashboard />,
        loader: loaderFunction,
      },
      {
        path: "/marking",
        element: <Marks />,
        loader: loaderFunction,
      },
      {
        path: "/analysis",
        element: <Analysis />,
        loader: loaderFunction,
      },
      {
        path: "/students",
        element: <Students />,
        loader: loaderFunction,
      },
      {
        path: "/completeAnalysis",
        element: <CompleteAnalysis />,
        loader: loaderFunction,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <StrictMode>
        <App />
      </StrictMode>
    </RouterProvider>
  </Provider>
);
