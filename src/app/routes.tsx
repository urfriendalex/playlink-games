import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/app/layout/RootLayout";
import GamesPage from "@/pages/GamesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <GamesPage /> },
      { path: "games", element: <GamesPage /> },
    ],
  },
]);

export default router;
