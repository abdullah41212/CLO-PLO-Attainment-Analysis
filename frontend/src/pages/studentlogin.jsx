import { useEffect, useState } from "react";
import "../App.css";
import Custominput from "../components/custominput";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { action } from "../store";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleEmail(text) {
    setEmail(text.target.value);
    setIsValid(true);
  }

  useEffect(() => {
    const storedStatus = localStorage.getItem("userstatus");
    if (storedStatus === "true") {
      navigate("/totalAnalysis");
    }

    async function getData() {
      const response = await axios.get("http://localhost:5000/studentdetail");
      setData(response.data);
    }
    getData();
  }, [navigate]);

  function isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validation = emailRegex.test(email);
    setIsValid(validation);

    if (validation) {
      const finder = data.find(
        (data) => data.email === email && data.password === password
      );
      const wrongPassword = data.find(
        (data) => data.email === email && data.password !== password
      );

      if (wrongPassword) {
        setMsg("Invalid password");
      } else if (finder) {
        setMsg("User found");
        console.log("user found ==> ", finder);
        dispatch(action.SetStudentInfo(finder));
        dispatch(action.LoginStatusTrue());
        localStorage.setItem("userstatus", "true");
        localStorage.setItem("student", JSON.stringify(finder)); // Store full object
        navigate("/totalAnalysis");
      } else {
        setMsg("User not found");
      }
    } else {
      setMsg("Invalid email format");
    }
  }

  return (
    <>
      <div className="login-wrapper">
        <div className="Auth">
          <div className="Auth-header">
            <h2>Students Login</h2>
          </div>
          <Custominput
            className={!isValid ? "invalid" : ""}
            label={"Enter your Email"}
            inputType={"email"}
            onChange={(text) => handleEmail(text)}
          />
          <p className="invalid">
            {!isValid && "Please Enter a valid Email address"}
          </p>
          <Custominput
            className={!isValid ? "invalid" : ""}
            label={"Enter your Password"}
            inputType={"password"}
            onChange={(text) => setPassword(text.target.value)}
          />
          <p className="invalid">{msg}</p>
          <button onClick={isValidEmail}>Login</button>
        </div>
        <div className="image">
          <img src="/login.gif" />
        </div>
      </div>
    </>
  );
}

export default StudentLogin;
