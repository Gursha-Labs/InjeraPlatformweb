import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/user/Home"
import RootLayout from "./layout/RootLayout"
import { ThemeProvider } from "./components/theme-provider"


function App() {
  const router = createBrowserRouter(
    [
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
          }
        ]
      }
    ])
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )

}

export default App

