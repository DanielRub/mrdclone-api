import express from "express";
import data from "./data.json";
import cors from "cors";

const app = express();
app.use(cors());
app.options("*", cors());
const PORT = 3001;
const RADIUS = 8; // search in 8km radius
app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});

app.get("/", (req, res) => {
  res.send("GET /");
});
app.get("/restaurants", (req, res) => {
  const name = req.query.name || null;
  const lat = req.query.latitude || null;
  const lon = req.query.longitude || null;

  const cuisines = req.query.cuisines ? req.query.cuisines.split(",") : null;
  if (name) {
    res.json(data.filter((item) => item.name == name));
  } else if (cuisines) {
    res.json(
      data.filter((item) => item.cuisines.some((r) => cuisines.includes(r)))
    );
  } else if (lat && lon) {
    res.json(
      data.filter(({ latitude, longitude }) => {
        const distance = getDistanceFromLatLonInKm(
          lat,
          lon,
          latitude,
          longitude
        ).toFixed(1);
        //console.log("distance=", distance);
        return distance <= RADIUS;
      })
    );
  } else {
    res.json(data);
  }
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  //console.log(lat1, lon1, lat2, lon2);
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
