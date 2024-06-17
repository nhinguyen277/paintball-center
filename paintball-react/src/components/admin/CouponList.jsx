import { useState, useEffect } from "react";
import Coupon from "./Coupon";

export default function CouponList() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const getCoupons = async () => {
      let response = await fetch("http://localhost:3000/api/coupons");
      let data = await response.json();
      // Format dates to yyyy-mm-dd
      const formattedCoupons = data.map((coupon) => ({
        ...coupon,
        start_date: formatDate(coupon.start_date),
        end_date: formatDate(coupon.end_date),
      }));
      setCoupons(formattedCoupons);
    };
    getCoupons();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    return `${year}-${month}-${day}`;
  };

  return coupons.map((coupon, index) => (
    <Coupon
      key={
        coupon._id +
        coupon.title +
        coupon.discount +
        coupon.image +
        coupon.start_date +
        coupon.end_date +
        coupon.code
      }
      id={index + 1}
      _id={coupon._id}
      title={coupon.title}
      discount={coupon.discount}
      image={coupon.image}
      startDate={coupon.start_date}
      endDate={coupon.end_date}
      code={coupon.code}
    />
  ));
}
