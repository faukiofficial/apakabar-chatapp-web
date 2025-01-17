import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import useAuthStore from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Navbar from "./components/Navbar"
import Profile from "./pages/Profile"
import { useThemeStore } from "./store/useThemeStore"
import SettingPage from "./pages/SettingPage"
import Home from "./pages/Home"

function App() {
  const { user, isAuthenticated, checkAuthLoading, checkAuth } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (checkAuthLoading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={50} />
      </div>
    )
  }

  const isAuth = user && isAuthenticated
  const isNotAuthAndNotChecking = !user && !isAuthenticated && !checkAuthLoading

  return (
    <BrowserRouter>
      <div data-theme={theme} className="min-h-[calc(100vh-6rem)]">
      <Navbar />
      <Routes>
        <Route path="/" element=<Navigate to="/auth/login" /> />
        <Route path="/auth" element=<Navigate to="/auth/login" /> />
        <Route path="/auth" element={isAuth && <Navigate to="/message" />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/message" element={isNotAuthAndNotChecking ? <Navigate to="/auth/login" /> : <Home /> } />
        <Route path="/profile" element={isNotAuthAndNotChecking ? <Navigate to="/auth/login" /> : <Profile /> } />
      </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
