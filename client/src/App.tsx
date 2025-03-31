
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BlogProvider } from "@/contexts/BlogContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import BlogList from "@/pages/BlogList";
import BlogDetail from "@/pages/BlogDetail";
import BlogCreate from "@/pages/BlogCreate";
import BlogEdit from "@/pages/BlogEdit";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import MyBlogs from "./pages/MyBlogs";
import EditBlog from "./pages/EditBlog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BlogProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={
                      <Login />
                  } />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/blogs" element={<BlogList />} />
                  <Route path="/my-blogs" element={<MyBlogs />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/edit/:id" element={<EditBlog />} />
                  <Route path="/create" element={
                    <ProtectedRoute>
                      <BlogCreate />
                    </ProtectedRoute>
                  } />
                  <Route path="/edit/:id" element={
                    <ProtectedRoute>
                      <BlogEdit />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </BlogProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
