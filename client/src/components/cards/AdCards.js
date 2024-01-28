
// import { Badge } from "antd";
import { Link } from "react-router-dom";
import AdFeatures from "./recent/AdFeatures";
import { formatNumber } from "../../helpers/ad";
// import "../../index.css";

export default function AdCard({ ad }) {

  return (
    <div className="col-lg-4 p-4 gx-4 gy-4">
      <Link to={`/ad/${ad.slug}`} className="nav-link">
        <div className="card hoverable shadow">
          <img
            src={ad?.photos?.[0]?.Location}
            // alt={`${ad?.type}-${ad?.address}-${ad?.action}-${ad?.price}`}
            alt={"img"}
            style={{ height: "250px", objectFit: "cover" }}
          />

          <div className="card-body">
            <h3>&#x20B9;{formatNumber(ad?.price)}</h3>
            <p className="card-text">{ad?.label}</p>
            <AdFeatures ad={ad} />
          </div>
        </div>
      </Link>
    </div>
  )
}