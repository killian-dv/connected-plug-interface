import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Switch from "@mui/material/Switch";

function App() {
  const [isOn, setIsOn] = useState(false);
  let label = { inputProps: isOn ? "Éteindre" : "Allumer" };

  const toggleSwitch = () => {
    const newState = !isOn;
    setIsOn(newState);

    axios
      .post(`http://192.168.1.100/relay/0?turn=${newState ? "on" : "off"}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
        setIsOn(!newState);
      });
  };

  const fetchStatus = () => {
    axios
      .get("http://192.168.1.100/status")
      .then((response) => {
        const status = response.data.relays[0].ison;
        console.log(status);
        setIsOn(status);
        label = { inputProps: isOn ? "Éteindre" : "Allumer" };
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchStatus();
    const statusInterval = setInterval(fetchStatus, 3000);
    return () => clearInterval(statusInterval);
  }, []);

  return (
    <div>
      <h1>Controle Plug S</h1>
      <p>La prise est {isOn ? "allumé" : "éteint"}</p>
      <Switch {...label} onChange={toggleSwitch} checked={isOn} />
    </div>
  );
}

export default App;
