import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import useAuthStore from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import Register from "./pages/Register"
import Login from "./pages/Login"


function App() {
  const { user, isAuthenticated, checkAuthLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (checkAuthLoading && !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader className="animate-spin" size={50} color="white" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element=<Navigate to="/auth/login" /> />
        <Route path="/auth" element=<Navigate to="/auth/login" /> />
        <Route path="/auth" element={user && isAuthenticated && <Navigate to="/message" />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="/message" element={!user && !isAuthenticated && !checkAuthLoading ? <Navigate to="/auth/login" /> : <h1>Dashboard</h1> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
