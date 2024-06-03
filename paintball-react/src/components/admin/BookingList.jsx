import { useState, useEffect } from "react";
import Booking from "./Booking";

export default function BookingList() {
  const [booking, setBooking] = useState([]);

  useEffect(() => {
    const getBooking = async () => {
      let response = await fetch("http://localhost:3000/api/booking");
      let data = await response.json();
      setBooking(data);
    };
    getBooking();
  }, []);

  return booking.map((b) => (
    <Booking
      key={
        b.bookings._id +
        b.customer.firstname +
        b.customer.lastname +
        b.scenario.title +
        b.time +
        b.schedule.date +
        b.schedule.time
      }
      id={b.bookings._id}
      title={b.scenario.title}
      date={b.schedule.date}
      time={b.schedule.time}
      firstname={b.customer.firstname}
      lastname={b.customer.lastname}
    />
  ));
}
