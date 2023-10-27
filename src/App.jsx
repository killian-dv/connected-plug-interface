import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Switch from "@mui/material/Switch";
import "./App.css";

function App() {
  const [isOn, setIsOn] = useState(false);
  const [wifi, setWifi] = useState("");
  const [power, setPower] = useState("");

  const apiKey =
    "MWNiMjY5dWlk404459961993DCA83AE44BC6E3A6F58906952E7BECA0A5B69DC375C964915ACBC0EA536A0639CB73";
  const id = "4022d88e30e8";
  let data = new FormData();

  const toggleSwitch = async () => {
    const newState = !isOn;
    setIsOn(newState);

    data.append("channel", "0");
    data.append("turn", newState ? "on" : "off");
    data.append("id", id);
    data.append("auth_key", apiKey);

    try {
      const response = await axios.post(
        "https://shelly-77-eu.shelly.cloud/device/relay/control",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setIsOn(!newState);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `https://shelly-77-eu.shelly.cloud/device/status?id=${id}&auth_key=${apiKey}`
      );
      const status = response.data.data.device_status.relays[0].ison;
      const power = response.data.data.device_status.meters[0].power;
      const wifi = response.data.data.device_status.wifi_sta.ssid;
      setIsOn(status);
      setPower(power);
      setWifi(wifi);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const statusInterval = setInterval(fetchStatus, 3000);
    return () => clearInterval(statusInterval);
  }, []);

  return (
    <div>
      <div className="title">
        <h1>Controle Plug S</h1>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth={0}
          viewBox="0 0 14 16"
          height="4rem"
          width="4rem"
        >
          <path
            fillRule="evenodd"
            d="M14 6V5h-4V3H8v1H6c-1.03 0-1.77.81-2 2L3 7c-1.66 0-3 1.34-3 3v2h1v-2c0-1.11.89-2 2-2l1 1c.25 1.16.98 2 2 2h2v1h2v-2h4V9h-4V6h4z"
          />
        </svg>
      </div>
      <p>La prise est {isOn ? "allumée" : "éteinte"}</p>
      <p>Le ssid est {wifi}</p>
      <p>La consommation actuelle est de {power}W</p>
      <Switch onChange={toggleSwitch} checked={isOn} />
    </div>
  );
}

export default App;
