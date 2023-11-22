import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import 'dotenv/config';
const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.post("/weather", async(req, res) =>{
  const city_name = req.body["city"];
  try{
    const response = await axios.get(`${process.env.API_URL}?q=${city_name}&APPID=${process.env.API_KEY}`);
    const result = response.data;
    const title_name = result.weather[0].main;
    const description = result.weather[0].description;
    const icon_id = result.weather[0].icon;
    const temperature_k = result.main.temp;
    const temperature_c = (temperature_k - 273.15).toFixed(2);
    const icon = `https://openweathermap.org/img/wn/${icon_id}@2x.png`
    res.render("weather.ejs", {title: title_name, desc: description, icon_link: icon, city: city_name,temp: temperature_c});
  }catch(error){
    console.error("Failed to make request:", error.message);
    res.render("error.ejs", {
    error: error.message,
    });
  }
  
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
