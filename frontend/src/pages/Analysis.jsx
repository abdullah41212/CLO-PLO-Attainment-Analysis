import { useEffect, useRef, useState } from "react";
import { getStyle } from "@coreui/utils";
import { CChart } from "@coreui/react-chartjs";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Analysis() {
  const chartRef = useRef(null);
  const [student, setStudent] = useState(null);
  const [cloData, setCloData] = useState(null);
  const [goodAt, setGoodAt] = useState("");
  const [bloomTaxanomy, setBloomTaxanomy] = useState();
  const [loading, setLoading] = useState(true);
  const studentData = useSelector((state) => state.selectedStudent);
  console.log(student);
  useEffect(() => {
    setStudent(studentData);
    async function getData() {
      try {
        setLoading(true); // Start loading
        const response = await axios.get("http://localhost:5000/cloAnalysis", {
          params: { ...studentData },
        });
        console.log(response.data);
        setCloData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    }
    getData();
  }, [studentData]);

  useEffect(() => {
    if (cloData && cloData.length > 0) {
      const { Clo1_Percentage, Clo2_Percentage, Clo3_Percentage } = cloData[0];
      if (
        Clo1_Percentage > Clo2_Percentage &&
        Clo1_Percentage > Clo3_Percentage
      ) {
        setGoodAt(cloData[0].plo1_description);
        setBloomTaxanomy(cloData[0].clo1_action);
      } else if (
        Clo2_Percentage > Clo1_Percentage &&
        Clo2_Percentage > Clo3_Percentage
      ) {
        setGoodAt(cloData[0].plo2_description);
        setBloomTaxanomy(cloData[0].clo2_action);
      } else if (
        Clo3_Percentage > Clo1_Percentage &&
        Clo3_Percentage > Clo2_Percentage
      ) {
        setBloomTaxanomy(cloData[0].clo3_action);
        setGoodAt(cloData[0].plo3_description);
      }
    }
  }, [cloData]);

  const data = {
    labels: [
      !cloData
        ? "NO Info Available"
        : cloData[0]?.plo1_description === null
        ? "Clo Not Available"
        : cloData[0]?.plo1_description + "(CLO 1)",
      !cloData
        ? "NO Info Available"
        : cloData[0]?.plo2_description === null
        ? "Clo Not Info Available"
        : cloData[0]?.plo2_description + "(CLO 2)",
      !cloData
        ? "NO Info Available"
        : cloData[0]?.plo3_description === null
        ? "Clo Not Available"
        : cloData[0]?.plo3_description + "(CLO 3)",
    ].filter(Boolean),
    datasets: [
      {
        label: "Achieved Average",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        pointBackgroundColor: "  rgb(171, 171, 171)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        data: cloData
          ? [
              cloData[0]?.Clo1_Percentage || 0,
              cloData[0]?.Clo2_Percentage || 0,
              cloData[0]?.Clo3_Percentage || 0,
            ]
          : [],
        fill: true,
      },
      // {
      //   label: "Remaining Average",
      //   backgroundColor: "rgba(223, 194, 200, 0.2)",
      //   borderColor: "rgba(255, 99, 132, 1)",
      //   pointBackgroundColor: "rgba(255, 99, 132, 1)",
      //   pointBorderColor: "#fff",
      //   pointHoverBackgroundColor: "#fff",
      //   pointHoverBorderColor: "rgba(255, 99, 132, 1)",
      //   data: cloData
      //     ? [
      //         100 - (cloData[0]?.Clo1_Percentage || 100),
      //         100 - (cloData[0]?.Clo2_Percentage || 100),
      //         100 - (cloData[0]?.Clo3_Percentage || 100),
      //       ]
      //     : [0, 0, 0],
      //   fill: true,
      // },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: getStyle("--cui-body-color"),
          font: {
            size: 26,
            family: "Arial",
            weight: "bold",
          },
        },
      },
    },
    scales: {
      r: {
        grid: {
          color: "#ABABAB",
        },
        ticks: {
          color: "rgb(0, 0, 0)",
          stepSize: 10,
          max: 100,
          beginAtZero: true,
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.5)",
        },
        pointLabels: {
          color: "  rgb(171, 171, 171);",
          font: {
            size: 20,
            family: "Arial",
            weight: "bold",
          },
        },
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  function getFirstLetters(sentence) {
    return sentence
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word[0].toUpperCase())
      .join("");
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && student && cloData && (
        <>
          {/* <h1 className="analysis-rollno">
            {" "}
            {student.batch}-B
            {getFirstLetters(student.department)}-{student.rollno}
          </h1>
          <div className="analysis-msg">
            {!goodAt ? (
              <h1>No Clo Data Available</h1>
            ) : (
              <h1>CLO Verdict: The student is Good At {goodAt}</h1>
            )}
            {!bloomTaxanomy ? (
              <h1> This CLO Doesnt Have Bloom Taxanomy</h1>
            ) : (
              <h1>Bloom Taxanomy: The student is Good At {bloomTaxanomy}</h1>
            )}
          </div> */}
          <CChart
            type="radar"
            className="chart"
            data={data}
            options={options}
            ref={chartRef}
          />
          <div className="analysis-table">
            {cloData && (
              <div className="display-student">
                <table>
                  <thead>
                    <tr>
                      <th>CLO</th>
                      <th>CLO Percentage</th>
                      <th>PLO</th>
                      <th>BLOOM TAXONOMY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr></tr>
                    <tr>
                      <td>CLO 1</td>
                      <td>{cloData[0]?.Clo1_Percentage}%</td>
                      <td>{cloData[0]?.plo1_description}</td>
                      <td>
                        {cloData[0]?.clo1_action
                          ? cloData[0]?.clo1_action
                          : "Not Available"}
                      </td>
                    </tr>

                    <tr>
                      <td>CLO 2</td>
                      <td>{cloData[0]?.Clo2_Percentage}%</td>
                      <td>{cloData[0]?.plo2_description}</td>
                      <td>
                        {cloData[0]?.clo2_action
                          ? cloData[0]?.clo2_action
                          : "Not Available"}
                      </td>
                    </tr>

                    <tr>
                      <td>CLO 3</td>
                      <td>{cloData[0]?.Clo3_Percentage}%</td>
                      <td>{cloData[0]?.plo3_description}</td>
                      <td>
                        {cloData[0]?.clo3_action
                          ? cloData[0]?.clo3_action
                          : "Not Available"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
