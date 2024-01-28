

import { Container, Row, Col } from "reactstrap";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageGallery from "../components/misc/ImageGallery";
import Logo from "../../src/logo.svg";
import AdFeatures from "../components/cards/recent/AdFeatures";
import { formatNumber } from "../helpers/ad";
import dayjs from "dayjs";
import LikeUnlike from "../components/misc/LikeUnlike";
import MapCard from "../components/cards/MapCard";
import ContactSeller from "../components/forms/ContactSeller";
import RecentCard from "../components/cards/recent/RecentCard";
import styles from "./adview1.module.css";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const AdDetails = () => {
  const [ad, setAd] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isrented, setRented] = useState();


  const params = useParams();

  useEffect(() => {
    setLoading(true);

    window.scrollTo(0, 0);

    const fetchAd = async () => {
      try {
        const { data } = await axios.get(`/ad/${params?.slug}`);
        setAd(data.ad);
        console.log("ad");
        console.log(data.ad);
        setRelated(data.related);
        setRented(data.ad.rented);
        setLoading(false);

      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchAd();
  }, []);


  const generatePhotosArray = (photos) => {
    if (photos?.length > 0) {
      const x = photos?.length === 1 ? 2 : 4;
      let arr = [];
      photos.map((p) =>
        arr.push({
          src: p.Location,
          width: x,
          height: x,
        })
      );
      return arr;
    } else {
      return [
        {
          src: Logo,
          width: 2,
          height: 1,
        },
      ];
    }
  };
  // const initPay = (order) => {
  //   axios.get("/getkey")
  //     .then(response => {
  //       const key = response.data.key;

  //       const options = {
  //         key: key,
  //         amount: order.amount,
  //         currency: "INR",
  //         name: "Rentify:RoomRentalWebApplication",
  //         description: "Test",
  //         image: "https://www.shutterstock.com/image-vector/home-rent-icon-real-estate-260nw-2139501253.jpg",
  //         order_id: order.id,
  //         // handler: (response) => {
  //         //   return new Promise(async (resolve, reject) => {
  //         //     try {
  //         //       const verifyData = {
  //         //         paymentResponse: response,
  //         //         adId: ad._id
  //         //       };
  //         //       console.log("ye response h adveiw me1 phle ", response);

  //         //       const data = await axios.post("/paymentVerification", verifyData);
  //         //       console.log("ye data h adveiw me1 ", data);
  //         //       resolve();
  //         //     } catch (error) {
  //         //       console.log(error);
  //         //       reject(error);
  //         //     }
  //         //   });
  //         // },
  //         theme: {
  //           color: "#121212"
  //         }
  //       };

  //       const razor = new window.Razorpay(options);
  //       razor.open();
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  const checkoutHandler = async (amount) => {
    try {
      const { data: { key } } = await axios.get("getkey");
      const adId = ad._id;
      const { data: { order } } = await axios.post("/checkout", { amount });
      // console.log(data);
      const options = {
        key, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Rentify",
        "description": "Room Rental",
        "image": "https://png.pngtree.com/element_our/20190528/ourmid/pngtree-small-url-icon-opened-on-the-computer-image_1132275.jpg",
        "order_id": order.id,
        // "callback_url": "http://localhost:8000/api/paymentverification",
        "handler": function (response) {
          // alert(response.razorpay_payment_id);
          // alert(response.razorpay_order_id);
          // alert(response.razorpay_signature)
          console.log(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
          const verify = async () => {
            const { data } = await axios.post("paymentverification", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              adid: adId
            });
            // console.log("data");
            console.log(data);
            setRented(data.success);

          }
          verify();



        },
        "prefill": {
          // logged in user name
          "name": "Gaurav Kumar",
          "email": "gaurav.kumar@example.com",
          "contact": "9000090000"
        },
        "notes": {
          "address": "Razorpay Corporate Office"
        },
        "theme": {
          "color": "#121212"
        }
      };
      var razor = new window.Razorpay(options);
      razor.open();


    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      {!loading ? (
        <>
          <section>
            <Container>
              <Row>
                <Col lg="6">
                  <ImageGallery photos={generatePhotosArray(ad?.photos)} />
                </Col>
                <Col lg="6" >
                  {/* <div className="car__info"> */}
                  <div className="card shadow px-4 py-4">

                    <div className=" d-flex align-items-center justify-content-between gap-5 mb-4 mt-3">
                      <h6 className="fw-bold fs-5">

                        <span style={{ background: ad.type === "House" ? "#25b5791a" : "#ff98001a", color: ad.type === "House" ? "#25b579" : "#ff9800" }}>{ad.type}</span>
                      </h6>
                      <LikeUnlike ad={ad} />
                    </div>
                    <div className=" d-flex align-items-center gap-5 mb-2 mt-2">

                      <h3 className="rent__price fw-bold fs-4">&#x20B9;{formatNumber(ad?.price)}</h3>
                    </div>


                    {/* <div className=" d-flex align-items-center justify-content-between gap-5"> */}
                    <h3>{ad.title}</h3>



                    {/* </div> */}
                    <h3 className="mt-3">{ad.label}</h3>
                    <p className="section__description">
                      {ad.description}
                    </p>

                    <div
                      className=" d-flex align-items-center  "
                      style={{ columnGap: "5rem" }}
                    >
                      <AdFeatures ad={ad} />
                    </div>
                    {/* book now payment button */}
                    {/* <button ></button> */}
                    {isrented ?
                      <div className={styles.margin1}>
                        <button disabled className={`${styles.btn3} ${styles.btnbooked} ${styles.disable}`} >Booked</button>
                      </div> :
                      <div className={styles.margin1}>
                        <button className={`${styles.btn2} ${styles.btnprice}`} onClick={() => { checkoutHandler(ad?.price) }}>Book Room</button>
                      </div>}


                  </div>

                </Col>

                <Col lg="6" className="mt-5">
                  <div className="booking-info mt-5">
                    {/* <h5 className="mb-4 fw-bold ">Contact Seller</h5> */}
                    {/* <BookingForm /> */}
                    <ContactSeller ad={ad} />
                  </div>
                </Col>

                <Col lg="6" className="mt-5">
                  <div className="payment__info mt-5">

                    <MapCard ad={ad} />
                  </div>
                </Col>
              </Row>
            </Container>
          </section>

          <section className='recent padding'>
            <div className='container'>
              <h4 className="text-center">Related Ads</h4>
              <hr style={{ width: '99%' }} />
              <RecentCard adsForRent={related} />
            </div>
          </section>
        </>
      ) : (
        <>
          <p>loading page....</p>
        </>
      )}
    </>
  );
};

export default AdDetails;