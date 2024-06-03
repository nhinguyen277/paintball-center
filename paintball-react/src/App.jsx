import UserHeader from "./components/Header";
import Footer from "./components/Footer";
import AdminHeader from "./components/admin/Header";
import CustomerHeader from "./components/customer/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import CustomerDashboard from "./customer/Dashboard";
import CustomerScenarios from "./customer/Scenarios";
import CustomerScenario from "./customer/Scenario";
import Scenarios from "./admin/Scenarios";
import Schedules from "./admin/Schedules";
import Booking from "./admin/Booking";
import DetailBooking from "./admin/BookingDetail";
// import Admin from "./admin/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import "./App.css";
import CustomerLayout from "./components/customer/Layout";

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
            <Route path="/admin/schedules" element={<Schedules />} />
            <Route path="/admin/booking" element={<Booking />} />
            <Route path="/admin/booking/:id" element={<DetailBooking />} />

            <Route path="/customer/*" element={<CustomerLayout />}>
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="scenarios" element={<CustomerScenarios />} />
              <Route path="scenarios/:id" element={<CustomerScenario />} />
              {/* Add more customer routes here */}
            </Route>
            {/* {location.pathname.startsWith("/customer") && (
              <Route
                path="/customer/dashboard"
                element={
                  <CustomerLayout>
                    <CustomerDashboard />
                  </CustomerLayout>
                }
              />
            )} */}

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
