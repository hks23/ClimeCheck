import React, {useState} from "react";
import CurrentLocation from "./currentLocation";
import "./App.css";

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  const handleChange = (selectedOption) => {
    selectedOption(selectedOption)
  };

  return (
    <React.Fragment>
      <div className="container">
        <CurrentLocation />
      </div>
    </React.Fragment>
  );
}

export default App;
