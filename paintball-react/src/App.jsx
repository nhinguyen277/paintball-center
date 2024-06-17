import UserHeader from "./components/Header";
import UserFooter from "./components/Footer";
import AdminFooter from "./components/admin/Footer";
import AdminHeader from "./components/admin/Header";
import CustomerHeader from "./components/customer/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import BookingInfor from "./pages/BookingInfor";
import { AuthProvider } from "./customer/Auth";
import Register from "./pages/Register";
import CustomerDashboard from "./customer/Dashboard";
import Profile from "./customer/Profile";
import EditProfile from "./customer/EditProfile";
import CustomerScenarios from "./customer/Scenarios";
import CustomerScenario from "./customer/Scenario";
import CustomerBookings from "./customer/Booking";
import CustomerBooking from "./customer/BookingDetail";
import CustomerAddBooking from "./customer/AddBooking";
import CustomerEditBooking from "./customer/EditBooking";
import CustomerCoupon from "./customer/Coupon";
import CustomerCouponDetail from "./customer/CouponDetail";
import Admin from "./pages/AdminSignin";
import AdminDashboard from "./admin/Dashboard";
import Scenarios from "./admin/Scenarios";
import AdminScenario from "./admin/Scenario";
import AddScenario from "./admin/AddScenario";
import EditScenario from "./admin/EditScenario";
import Schedules from "./admin/Schedules";
import ScheduleDetail from "./admin/ScheduleDetail";
import AddSchedule from "./admin/AddSchedule";
import EditASchedule from "./admin/EditSchedule";
import Booking from "./admin/Booking";
import DetailBooking from "./admin/BookingDetail";
import AddBooking from "./admin/AddBooking";
import EditBooking from "./admin/EditBooking";
import Customers from "./admin/Customers";
import CustomerDetail from "./admin/CustomerDetail";
import AddCustomer from "./admin/AddCustomer";
import EditCustomer from "./admin/EditCustomer";
import Staffs from "./admin/Staff";
import DetailStaff from "./admin/StaffDetail";
import AddStaff from "./admin/AddStaff";
import EditStaff from "./admin/EditStaff";
import Coupons from "./admin/Coupon";
import DetailCoupon from "./admin/CouponDetail";
import AddCoupon from "./admin/AddCoupon";
import EditCoupon from "./admin/EditCoupon";
import Memberships from "./admin/Membership";
import DetailMembership from "./admin/MembershipDetail";
import AddMembership from "./admin/AddMembership";
import MembershipEdit from "./admin/EditMembership";
import Equipment from "./admin/Equipment";
import DetailEquipment from "./admin/EquipmentDetail";
import AddEquipment from "./admin/AddEquipment";
import EquipmentEdit from "./admin/EditEquipment";
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
              <Route path="/explore" element={<Explore />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/bookingInfor/:id" element={<BookingInfor />} />

              <Route path="/admin/*" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="booking" element={<Booking />} />
                <Route path="booking/:id" element={<DetailBooking />} />
                <Route path="booking/add" element={<AddBooking />} />
                <Route path="booking/edit/:id" element={<EditBooking />} />
                <Route path="scenarios" element={<Scenarios />} />
                <Route path="scenarios/:id" element={<AdminScenario />} />
                <Route path="scenarios/add" element={<AddScenario />} />
                <Route path="scenarios/edit/:id" element={<EditScenario />} />
                <Route path="schedules" element={<Schedules />} />
                <Route path="schedule/:id" element={<ScheduleDetail />} />
                <Route path="schedule/add" element={<AddSchedule />} />
                <Route path="schedule/edit/:id" element={<EditASchedule />} />
                <Route path="customer" element={<Customers />} />
                <Route path="customer/:id" element={<CustomerDetail />} />
                <Route path="customer/add" element={<AddCustomer />} />
                <Route path="customer/edit/:id" element={<EditCustomer />} />
                <Route path="staff" element={<Staffs />} />
                <Route path="staff/:id" element={<DetailStaff />} />
                <Route path="staff/add" element={<AddStaff />} />
                <Route path="staff/edit/:id" element={<EditStaff />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="coupon/:id" element={<DetailCoupon />} />
                <Route path="coupon/add" element={<AddCoupon />} />
                <Route path="coupon/edit/:id" element={<EditCoupon />} />
                <Route path="memberships" element={<Memberships />} />
                <Route path="membership/:id" element={<DetailMembership />} />
                <Route path="membership/add" element={<AddMembership />} />
                <Route
                  path="membership/edit/:id"
                  element={<MembershipEdit />}
                />
                <Route path="equipment" element={<Equipment />} />
                <Route path="equipment/:id" element={<DetailEquipment />} />
                <Route path="equipment/add" element={<AddEquipment />} />
                <Route path="equipment/edit/:id" element={<EquipmentEdit />} />
              </Route>

              <Route path="/customer/*" element={<CustomerLayout />}>
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/edit/:id" element={<EditProfile />} />
                <Route path="scenarios" element={<CustomerScenarios />} />
                <Route path="scenarios/:id" element={<CustomerScenario />} />
                <Route path="booking" element={<CustomerBookings />} />
                <Route path="booking/:id" element={<CustomerBooking />} />
                <Route path="booking/add" element={<CustomerAddBooking />} />
                <Route
                  path="booking/edit/:id"
                  element={<CustomerEditBooking />}
                />
                <Route path="coupons" element={<CustomerCoupon />} />
                <Route path="coupon/:id" element={<CustomerCouponDetail />} />
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
