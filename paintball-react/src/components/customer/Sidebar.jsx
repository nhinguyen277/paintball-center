import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import "../../App";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
  const navigate = useNavigate();
  return (
    <SideNav
      onSelect={(selected) => {
        navigate("/customer/" + selected);
      }}
      className="mySideNav"
    >
      <SideNav.Toggle />
      <SideNav.Nav defaultSelected="dashboard">
        <NavItem eventKey="dashboard">
          <NavIcon>
            <i className="fa fa-fw fa-home" style={{ fontSize: "1.5em" }} />
          </NavIcon>
          <NavText
            style={{
              fontSize: "22px",
              backgroundColor: "black",
              width: "180px",
            }}
          >
            DashBoard
          </NavText>
        </NavItem>
        <NavItem eventKey="profile">
          <NavIcon>
            <i
              className="fa-solid fa-address-card"
              style={{ fontSize: "1.5em" }}
            />
          </NavIcon>
          <NavText
            style={{
              fontSize: "22px",
              backgroundColor: "black",
              width: "180px",
            }}
          >
            Profile
          </NavText>
        </NavItem>
        <NavItem eventKey="scenarios">
          <NavIcon>
            <i
              className="fa-solid fa-person-rifle"
              style={{ fontSize: "1.5em" }}
            />
          </NavIcon>
          <NavText
            style={{
              fontSize: "22px",
              backgroundColor: "black",
              width: "180px",
            }}
          >
            Scenarios
          </NavText>
        </NavItem>

        <NavItem eventKey="booking">
          <NavIcon>
            <i
              className="fa-solid fa-check-to-slot"
              style={{ fontSize: "1.5em" }}
            />
          </NavIcon>
          <NavText
            style={{
              fontSize: "22px",
              backgroundColor: "black",
              width: "180px",
            }}
          >
            Booking
          </NavText>
        </NavItem>
        {/* <NavItem eventKey="receipt">
          <NavIcon>
            <i className="fa-solid fa-receipt" style={{ fontSize: "1.5em" }} />
          </NavIcon>
          <NavText
            style={{
              fontSize: "22px",
              backgroundColor: "black",
              width: "180px",
            }}
          >
            Receipt
          </NavText>
        </NavItem> */}
        <NavItem eventKey="coupons">
          <NavIcon>
            <i className="fa-solid fa-ticket" style={{ fontSize: "1.5em" }} />
          </NavIcon>
          <NavText
            style={{
              fontSize: "22px",
              backgroundColor: "black",
              width: "180px",
            }}
          >
            Coupons
          </NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
}
