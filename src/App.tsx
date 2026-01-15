import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hook";
import { fetchUser } from "./store/slices/authSlice";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

// layouts
import RootLayout from "./layout/RootLayout";
// import ProtectedRoute from "./components/ProtectedRoute";

// user pages
import Home from "./pages/user/Home";
import Profile from "./pages/user/Profile";
import ProfileBuild from "./pages/user/ProfileBuild";

// auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VarifyEmail from "./pages/auth/VarifyEmail";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// advertiser
import Page from "./pages/advertizer/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/advertizer/Index";
import UploadAd from "./pages/advertizer/UploadAd";
import Setting from "./pages/user/Setting";
import Search from "./pages/user/Search";
import Game from "./pages/user/Game";
import AdvertiserAd from "./pages/advertizer/AdvertiserAd";
import AdvertiserAddetail from "./pages/advertizer/AdvertiserAddetail";
import AdvertiserProfile from "./pages/advertizer/AdvertiserProfile";
import AdvertiserWallet from "./pages/advertizer/Wallet";
import AdvertiserOrders from "./pages/advertizer/Order";
import AdminPage from "./pages/admin/AdminPage";
import AdminOverview from "./pages/admin/AdminOverview";
import Users from "./pages/admin/Users";
import Advertisers from "./pages/admin/Advertisers";
import Trafic from "./pages/admin/Trafic";
import AdminSetting from "./pages/admin/AdminSetting";
import Money from "./pages/admin/Money";
import Log from "./pages/admin/Log";

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes key={location.pathname}>
        {/* Public Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/varify-otp/:email" element={<VarifyEmail />} />
        <Route path="/user-profile-build" element={<ProfileBuild />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword/:email" element={<ResetPassword />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute types={["user"]} />} >
          <Route path="/injera" element={<RootLayout />}>
            <Route index element={<Home />} />

            <Route path="search" element={<Search />} />
            <Route path="game" element={<Game />} />
            <Route path="setting" element={<Setting />} />
            <Route path="profile/:id" element={<Profile />} />
          </Route>
        </Route>

        {/* Advertiser Route */}
        <Route >
          <Route element={<ProtectedRoute types={["advertiser"]} />}>
            <Route path="/advertiser" element={<Page />} >
              <Route index element={<Index />} />
              <Route path="advideo" element={<AdvertiserAd />} />
              <Route path="advideo/:id" element={<AdvertiserAddetail />} />
              <Route path="orders" element={<AdvertiserOrders />} />
              <Route path="wallet" element={<AdvertiserWallet />} />
              <Route path="advideo/create" element={<UploadAd />} />
              <Route path="analytics" element={<UploadAd />} />
              <Route path="reports" element={<UploadAd />} />
              <Route path="help" element={<UploadAd />} />
              <Route path="settings" element={<AdvertiserProfile />} />
            </Route>
          </Route>

        </Route>

        {/* Admin Route */}
        <Route>
          <Route element={<ProtectedRoute types={["admin"]} />}>
            <Route path="/admin" element={<AdminPage />} >
              <Route index element={<AdminOverview />} />
              <Route path="advertisers" element={<Advertisers />} />
              <Route path="users" element={<Users />} />
              <Route path="trafic" element={<Trafic />} />
              <Route path="money" element={<Money />} />
              <Route path="log" element={<Log />} />
              <Route path="settings" element={<AdminSetting />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      <Toaster position="top-center" expand={true} richColors />
    </ThemeProvider >
  );
}
export default App;
