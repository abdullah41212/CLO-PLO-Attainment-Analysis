import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "./components/header";
function App() {
  const [data, setData] = useState();
  const status = localStorage.getItem("status");
  const user = localStorage.getItem("user");
  useEffect(() => {
    async function getData() {
      const response = await axios.get(
        `http://localhost:5000/teachers/${user}`
      );
      setData(response.data);
    }
    getData();
    if (status !== null) {
      localStorage.setItem("status", status);
    }
  }, []);
  async function Submit() {
    const data = {
      stuID: 2,
      stuName: "Murtaza",
      stuSemester: 4,
    };

    try {
      const response = await axios.post(`http://localhost:5000/students`, data);
      console.log("Response:", response.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }
  return (
    <>
      <Header />
      <button onClick={Submit}>Submit</button>
    </>
  );
}

export default App;
