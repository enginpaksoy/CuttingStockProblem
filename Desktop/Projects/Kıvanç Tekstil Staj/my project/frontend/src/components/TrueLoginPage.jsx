import "./TrueLoginPage.css";
import TextBoxComponent from "./TextBoxComponent.jsx";
import { useLocation } from "react-router-dom";

const TrueLoginPage = () => {
  const location = useLocation();
  const { state } = location;

  return (
    <div className="TrueLoginPage">
      <TextBoxComponent
        message={state ? state.username : ""}
      ></TextBoxComponent>
    </div>
  );
};

export default TrueLoginPage;
