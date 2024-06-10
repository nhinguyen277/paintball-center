import React from "react";
import SideNav from "../SideNav";
import "../../css/customer.css";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="layout">
      <SideNav />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
