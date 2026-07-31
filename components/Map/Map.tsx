// "use client";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChurch } from "@fortawesome/free-solid-svg-icons";

// import { renderToString } from "react-dom/server";

// import "leaflet/dist/leaflet.css";

// const position: [number, number] = [14.392407126637883, 120.86220430292863];

// // Create FontAwesome marker icon
// const customIcon = L.divIcon({
//   html: renderToString(
//     <div
//       style={{
//         background: "#ffffff",
//         width: "48px",
//         height: "48px",
//         borderRadius: "999px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//         border: "2px solid #000",
//       }}
//     >
//       <FontAwesomeIcon
//         icon={faChurch}
//         style={{
//           fontSize: "20px",
//           color: "#000",
//         }}
//       />
//     </div>,
//   ),

//   className: "",

//   iconSize: [48, 48],
//   iconAnchor: [24, 48],
// });

// export default function Map() {
//   return (
//     <MapContainer
//       center={position}
//       zoom={15}
//       scrollWheelZoom={false}
//       style={{
//         height: "400px",
//         width: "100%",
//       }}
//     >
//       <TileLayer
//         attribution="&copy; OpenStreetMap contributors"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       <Marker position={position} icon={customIcon}>
//         <Popup>Our Church Location</Popup>
//       </Marker>
//     </MapContainer>
//   );
// }

"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChurch } from "@fortawesome/free-solid-svg-icons";
import { renderToString } from "react-dom/server";

const position: [number, number] = [14.392407126637883, 120.86220430292863];

export default function Map() {
  const customIcon = useMemo(
    () =>
      L.divIcon({
        html: renderToString(
          <div
            style={{
              background: "#ffffff",
              width: "48px",
              height: "48px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              border: "2px solid #000",
            }}
          >
            <FontAwesomeIcon
              icon={faChurch}
              style={{
                fontSize: "20px",
                color: "#000",
              }}
            />
          </div>,
        ),
        className: "",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      }),
    [],
  );

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      style={{
        height: "400px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={customIcon}>
        <Popup>Our Church Location</Popup>
      </Marker>
    </MapContainer>
  );
}
