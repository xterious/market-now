import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CustomerProvider } from "@/contexts/CustomerContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import AuthWrapper from "@/components/AuthWrapper";
import Chatbot from "@/components/Chatbot";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserProtectedRoute from "@/components/UserProtectedRoute";
import Index from "./pages/Index";
import Stocks from "./pages/Stocks";
import News from "./pages/News";
import Currency from "./pages/Currency";
import Wishlist from "./pages/Wishlist";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <AuthWrapper>
        <CustomerProvider>
          <WishlistProvider>
            <CurrencyProvider>
              <AdminAuthProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/stocks" element={<Stocks />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/currency" element={<Currency />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <Admin />
                        </ProtectedRoute>
                      } 
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Chatbot />
              </AdminAuthProvider>
            </CurrencyProvider>
          </WishlistProvider>
        </CustomerProvider>
        </AuthWrapper>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
