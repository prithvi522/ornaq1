import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import BusinessFooter from "./components/BusinessFooter";
import ToastViewport from "./components/ToastViewport";
import { useAuth } from "./context/AuthContext";

// Load page code only when its route is opened. Shared navigation, auth, and
// notification UI stays immediately available while storefront/admin pages no
// longer inflate the initial JavaScript download.
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const UserLoginPage = lazy(() => import("./pages/UserLoginPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderResultPage = lazy(() => import("./pages/OrderResultPage"));
const OrderTrackingPage = lazy(() => import("./pages/OrderTrackingPage"));
const ProductManagementPage = lazy(() => import("./pages/ProductManagementPage"));
const AddProductPage = lazy(() => import("./pages/AddProductPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminStoriesPage = lazy(() => import("./pages/AdminStoriesPage"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const PolicyManagementPage = lazy(() => import("./pages/PolicyManagementPage"));
const OrderHistoryPage = lazy(() => import("./pages/OrderHistoryPage"));

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

function EntryRoute() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-stone-500">Loading your account...</div>;
  return <Navigate to={isAdmin ? "/admin/dashboard" : "/home"} replace />;
}

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLoginRoute = location.pathname === "/admin" || location.pathname === "/admin/login";
  const showAdminChrome = isAdminRoute && !isAdminLoginRoute;

  return (
    <>
      <ScrollToTop />
      {showAdminChrome ? <AdminNavbar /> : <Navbar />}
      <ToastViewport />
      <main className="pt-16 overflow-x-hidden min-h-screen bg-[#fffdf9]">
        <Suspense fallback={<div className="p-8 text-center text-stone-500">Loading page...</div>}>
          <Routes>
          <Route path="/" element={<EntryRoute />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-result" element={<OrderResultPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/profile/orders" element={<OrderHistoryPage />} />
          <Route path="/profile/orders/:id" element={<ProtectedRoute adminOnly><OrderTrackingPage /></ProtectedRoute>} />
          <Route path="/track-order/:id" element={<ProtectedRoute adminOnly><OrderTrackingPage /></ProtectedRoute>} />
          <Route path="/admin" element={<LoginPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute adminOnly><ProductManagementPage /></ProtectedRoute>} />
          <Route path="/admin/products/add" element={<ProtectedRoute adminOnly><AddProductPage /></ProtectedRoute>} />
          <Route path="/admin/stories" element={<ProtectedRoute adminOnly><AdminStoriesPage /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrdersPage /></ProtectedRoute>} />
          <Route path="/admin/policies" element={<ProtectedRoute adminOnly><PolicyManagementPage /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<InfoPage slug="privacy-policy" />} />
          <Route path="/terms-and-conditions" element={<InfoPage slug="terms-and-conditions" />} />
          <Route path="/refund-return-replacement-policy" element={<InfoPage slug="refund-return-replacement-policy" />} />
          <Route path="/refund-policy" element={<InfoPage slug="refund-return-replacement-policy" />} />
          <Route path="/shipping-policy" element={<InfoPage slug="shipping-policy" />} />
          <Route path="/cancellation-policy" element={<InfoPage slug="cancellation-policy" />} />
          <Route path="/disclaimer" element={<InfoPage slug="disclaimer" />} />
          <Route path="/contact" element={<InfoPage slug="contact" />} />
          <Route path="/faq" element={<InfoPage slug="faq" />} />
          <Route path="/policies/:slug" element={<InfoPage />} />
          <Route
  path="/profile/orders"
  element={<OrderHistoryPage />}
/>
          <Route
            path="/saree/:code"
            element={<ProductDetails />}
          />
          </Routes>
        </Suspense>
        {!showAdminChrome && <BusinessFooter />}
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
