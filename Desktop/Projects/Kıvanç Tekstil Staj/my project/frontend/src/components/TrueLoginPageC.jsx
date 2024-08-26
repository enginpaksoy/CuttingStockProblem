import "./TrueLoginPageC.css";
import TextBoxComponentC from "./TextBoxComponentC.jsx";
import { useLocation } from "react-router-dom";

const TrueLoginPageC = () => {
  const location = useLocation();
  const { state } = location;

  return (
    <div className="TrueLoginPage">
      <TextBoxComponentC
        message={state ? state.customername : ""}
      ></TextBoxComponentC>
    </div>
  );
};

export default TrueLoginPageC;
