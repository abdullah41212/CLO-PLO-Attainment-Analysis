import { useEffect, useRef, useState } from "react";
import { CChart } from "@coreui/react-chartjs";
import { useSelector } from "react-redux";
import axios from "axios";
import StudentHeader from "../components/studentHeader";
import { getFirstLetters } from "../../util";

export default function TotalAnalysis() {
  const chartRef = useRef(null);
  const [cloData, setCloData] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentData = useSelector((state) => state.studentinfo);
  console.log(studentData);
  // Safely retrieve and parse userdata from localStorage
  let userdata = null;
  try {
    const data = localStorage.getItem("student");
    userdata = data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
  }

  useEffect(() => {
    async function getData() {
      if (!userdata) {
        return;
      }

      try {
        setLoading(true); // Start loading

        const response = await axios.get(
          "http://localhost:5000/plopercentage",
          {
            params: {
              rollno: userdata.roll_No,
              batch: userdata.batch,
              department: userdata.department,
            },
          }
        );

        console.log(response.data);
        setCloData(response.data); // Update state with response data
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    }

    if (userdata) {
      getData();
    }
  }, []); // Run effect only when userdata changes

  const chartData = {
    labels: cloData.map((item) => `(PLO ${item.ploId})`),
    datasets: [
      {
        label: "PLO Percentage",
        backgroundColor: "rgba(55, 255, 255, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.7)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
        data: cloData.map((item) => item.plo_percentage ?? 0), // Replace null with 0 for chart
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#FFF",
          font: {
            size: 16,
            family: "Arial",
            weight: "bold",
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Grid line color for X-axis
          borderColor: "rgba(255, 255, 255, 0.5)", // Border color for X-axis
        },
      },
      y: {
        beginAtZero: true,
        max: 100, // Set the maximum value to 100
        ticks: {
          stepSize: 10, // Optional: Define the step size for better readability
          color: "rgba(255, 255, 255, 0.5)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Grid line color for Y-axis
          borderColor: "rgba(255, 255, 255, 0.5)", // Border color for Y-axis
        },
      },
    },
  };

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && cloData.length > 0 && (
        <>
          <StudentHeader />
          <div className="heading">
            <h1>
              {" "}
              {studentData &&
                "Welcome " +
                  studentData.batch +
                  "-" +
                  "B" +
                  getFirstLetters(studentData.department) +
                  "-" +
                  studentData.roll_No}
            </h1>
          </div>
          <CChart
            className="bar-chart"
            type="bar"
            data={chartData}
            options={chartOptions}
            ref={chartRef}
          />
          <div className="analysis-table student">
            <div className="display-student">
              <table>
                <thead>
                  <tr>
                    <th>PLO</th>
                    <th>PLO Description</th>
                    <th>Total Marks Obtained</th>
                    <th>Total Possible Marks</th>
                    <th>PLO Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {cloData.map((item) => (
                    <tr key={item.ploId}>
                      <td>PLO {item.ploId}</td>
                      <td>{item.plo_description}</td>
                      <td>{item.total_marks_obtained ?? "not Available"}</td>
                      <td>{item.total_possible_marks ?? "not Available"}</td>
                      <td>
                        {item.plo_percentage
                          ? item.plo_percentage + "%"
                          : "Not Available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
