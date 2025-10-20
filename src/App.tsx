import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/user/Home"
import RootLayout from "./layout/RootLayout"


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
    <RouterProvider router={router} />
  )

}

export default App

