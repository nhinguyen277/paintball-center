import UserHeader from "./components/Header";
import UserFooter from "./components/Footer";
import AdminFooter from "./components/admin/Footer";
import AdminHeader from "./components/admin/Header";
import CustomerHeader from "./components/customer/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import { AuthProvider } from "./customer/Auth";
import Register from "./pages/Register";
import CustomerDashboard from "./customer/Dashboard";
import CustomerScenarios from "./customer/Scenarios";
import CustomerScenario from "./customer/Scenario";
import CustomerBookings from "./customer/Booking";
import CustomerBooking from "./customer/BookingDetail";
import CustomerAddBooking from "./customer/AddBooking";
import CustomerEditBooking from "./customer/EditBooking";
import Admin from "./pages/AdminSignin";
import AdminDashboard from "./admin/Dashboard";
import Scenarios from "./admin/Scenarios";
import Schedules from "./admin/Schedules";
import Booking from "./admin/Booking";
import DetailBooking from "./admin/BookingDetail";
import AddBooking from "./admin/AddBooking";
import EditBooking from "./admin/EditBooking";
// import Admin from "./admin/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import "./App.css";
import CustomerLayout from "./components/customer/Layout";
import AdminLayout from "./components/admin/Layout";

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

  const Footer = () => {
    const location = useLocation();
    return location.pathname.startsWith("/admin") ? (
      <AdminFooter />
    ) : (
      <UserFooter />
    );
  };

  return (
    <>
      <AuthProvider>
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
              <Route path="/admin" element={<Admin />} />

              <Route path="/admin/*" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="scenarios" element={<Scenarios />} />
                <Route path="schedules" element={<Schedules />} />
                <Route path="booking" element={<Booking />} />
                <Route path="booking/:id" element={<DetailBooking />} />
                <Route path="booking/add" element={<AddBooking />} />
                <Route path="booking/edit/:id" element={<EditBooking />} />
              </Route>

              <Route path="/customer/*" element={<CustomerLayout />}>
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="scenarios" element={<CustomerScenarios />} />
                <Route path="scenarios/:id" element={<CustomerScenario />} />
                <Route path="booking" element={<CustomerBookings />} />
                <Route path="booking/:id" element={<CustomerBooking />} />
                <Route path="booking/add" element={<CustomerAddBooking />} />
                <Route
                  path="booking/edit/:id"
                  element={<CustomerEditBooking />}
                />
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
      </AuthProvider>
    </>
  );
}

export default App;
