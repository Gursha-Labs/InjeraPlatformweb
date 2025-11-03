import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/user/Home"
import RootLayout from "./layout/RootLayout"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/sonner"
import Profile from "./pages/user/Profile"
import Login from "./pages/user/Login"
import Signup from "./pages/Signup"
import ProfileBuild from "./pages/user/ProfileBuild"


function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/login", element: <Login />
      },
      {
        path: "/signup", element: <Signup />
      },
      {
        path: "/user-profile-build", element: <ProfileBuild />
      },

      {
        element: <RootLayout />,
        children: [
          {
            index: true, element: <Home />
          },
          {
            path: "/search", element: <>search</>
          },
          {
            path: "/game", element: <>games</>
          },
          {
            path: "/setting", element: <Home />
          },
          {
            path: "/profile", element: <Profile />
          },

        ]
      }
    ])
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster position="top-center" expand={true} richColors />
    </ThemeProvider>
  )

}

export default App

