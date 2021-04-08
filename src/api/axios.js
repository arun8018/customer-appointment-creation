import axios from "axios";
const token = "bbd1fdeae1adc7aa2b79d3c08fa86dcadc376b84";
// const token = window.scheduleapi_token;
// `Bearer ${token}`;
const instance = axios.create({
  baseURL: "https://schedule-app.litmus7.com/",
  // baseURL: window.scheduleapi_url,
});

instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
instance.defaults.headers.post["Content-Type"] = "application/json";
export default instance;
