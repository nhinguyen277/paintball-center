import UserHeader from "./components/Header";
import Footer from "./components/Footer";
import AdminHeader from "./components/admin/Header";
import CustomerHeader from "./components/customer/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/customer/Sidebar";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import CustomerDashboard from "./customer/Dashboard";
import Scenarios from "./admin/Scenarios";
// import Admin from "./admin/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import "./App.css";

function App() {
  const Header = () => {
    const location = useLocation();
    return location.pathname.startsWith("/admin") ? (
      <AdminHeader />
    ) : location.pathname.startsWith("/customer") ? (
      <CustomerHeader />
    ) : (
      <UserHeader />
    );
  };

  return (
    <>
      <BrowserRouter>
        <Header />
        {/* { if (user === "admin") {

        }

        } */}
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/scenarios" element={<Scenarios />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            {/*<Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} /> */}
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
