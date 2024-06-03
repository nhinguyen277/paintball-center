import React from "react";
import Sidebar from "./Sidebar";
import "../../css/customer.css";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};
export default CustomerLayout;
