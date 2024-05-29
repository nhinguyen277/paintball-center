import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function MySideNav() {
  const navigate = useNavigate();
  return (
    <SideNav
      onSelect={(selected) => {
        console.log(selected);
        navigate("/admin/" + selected);
      }}
      className="mySideNav"
    >
      <SideNav.Toggle />
      <SideNav.Nav defaultSelected="home">
        <NavItem eventKey="home">
          <NavIcon>
            <i className="fa fa-fw fa-home" style={{ fontSize: "1.5em" }} />
          </NavIcon>
          <NavText style={{ fontSize: "22px" }}>Home</NavText>
        </NavItem>
        <NavItem eventKey="scenarios">
          <NavIcon>
            <i
              className="fa-solid fa-person-rifle"
              style={{ fontSize: "1.5em" }}
            />
          </NavIcon>
          <NavText style={{ fontSize: "22px" }}>Scenarios</NavText>
        </NavItem>

        <NavItem eventKey="booking">
          <NavIcon>
            <i
              className="fa-solid fa-check-to-slot"
              style={{ fontSize: "1.5em" }}
            />
          </NavIcon>
          <NavText style={{ fontSize: "22px" }}>Booking</NavText>
        </NavItem>
        <NavItem eventKey="receipt">
          <NavIcon>
            <i className="fa-solid fa-receipt" style={{ fontSize: "1.5em" }} />
          </NavIcon>
          <NavText style={{ fontSize: "22px" }}>Receipt</NavText>
        </NavItem>
        <NavItem eventKey="coupon">
          <NavIcon>
            <i className="fa-solid fa-ticket" style={{ fontSize: "1.5em" }} />
          </NavIcon>
          <NavText style={{ fontSize: "22px" }}>Coupon</NavText>
        </NavItem>
        <NavItem eventKey="membership">
          <NavIcon>
            <i className="fa-solid fa-crown" style={{ fontSize: "1.5em" }} />
          </NavIcon>
          <NavText style={{ fontSize: "22px" }}>Membership</NavText>
        </NavItem>
        <NavItem eventKey="equipment">
          <NavIcon>
            <i className="fa-solid fa-toolbox" style={{ fontSize: "1.5em" }} />
          </NavIcon>
          <NavText style={{ fontSize: "22px" }}>Equipment</NavText>
        </NavItem>
        <NavItem eventKey="staff">
          <NavIcon>
            <i
              className="fa-solid fa-clipboard-user"
              style={{ fontSize: "1.5em" }}
            />
          </NavIcon>
          <NavText style={{ fontSize: "22px" }}>Staff</NavText>
        </NavItem>
        <NavItem eventKey="customer">
          <NavIcon>
            <i className="fa-solid fa-users" style={{ fontSize: "1.5em" }} />
          </NavIcon>
          <NavText style={{ fontSize: "22px" }}>Customers</NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
}
