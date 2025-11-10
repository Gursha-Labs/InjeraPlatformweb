import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/user/Home"
import RootLayout from "./layout/RootLayout"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/sonner"
import Profile from "./pages/user/Profile"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import ProfileBuild from "./pages/user/ProfileBuild"
import VarifyEmail from "./pages/auth/VarifyEmail"
import ForgetPassword from "./pages/auth/ForgetPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import Page from "./pages/advertizer/dashboard"


function App() {
  const router = createBrowserRouter(
    [
      // auth route
      {
        path: "/login", element: <Login />
      },
      {
        path: `/varify-otp/:email`, element: <VarifyEmail />
      },
      {
        path: "/signup", element: <Signup />
      },
      {
        path: "/user-profile-build", element: <ProfileBuild />
      },
      {

        path: "/forgetpassword", element: <ForgetPassword />

      },
      {
        path: "/resetpassword/:email", element: <ResetPassword />
      },
      // user route 
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
      },

      // adveriser route
      {
        path: "/advertiser",
        element: <Page />
      },
      // admin route 
      {
        path: "/admin",
        element: <>admin page</>
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

