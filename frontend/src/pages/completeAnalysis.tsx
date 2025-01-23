import { useEffect, useRef, useState } from "react";
import { getStyle } from "@coreui/utils";
import { CChart } from "@coreui/react-chartjs";
import { useSelector } from "react-redux";
import axios from "axios";
import React from "react";

type apidata = {
  Clo1_Percentage: number;
  Clo2_Percentage: number;
  Clo3_Percentage: number;
  "Roll No": string;
  clo1_action: string;
  clo2_action: string;
  clo3_action: string;
  courseID: string;
  plo1_description: string;
  plo2_description: string;
  plo3_description: string;
}[];
export default function CompleteAnalysis() {
  const chartRef = useRef(null);
  const [maxClo1, setMaxClo1] = useState(0);
  const [maxClo2, setMaxClo2] = useState(0);
  const [maxClo3, setMaxClo3] = useState(0);
  const [plo1, setPlo1] = useState("");
  const [plo2, setPlo2] = useState("");
  const [plo3, setPlo3] = useState("");
  const [bt1, setbt1] = useState("");
  const [bt2, setbt2] = useState("");
  const [bt3, setbt3] = useState("");
  const [student, setStudent] = useState(null);
  const [cloData, setCloData] = useState<apidata | null>(null);
  const [goodAt, setGoodAt] = useState("");
  const [bloomTaxonomy, setBloomTaxonomy] = useState("");
  const [loading, setLoading] = useState(true);
  const studentData = useSelector((state: any) => state.selectedStudent);
  useEffect(() => {
    setStudent(studentData);

    async function getData() {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:5000/studentcloanalysis",
          {
            params: {
              rollno: studentData.rollno,
              batch: studentData.batch,
              department: studentData.department,
              teacherID: studentData.teacherID,
            },
          }
        );

        const data = response.data;
        setCloData(data);

        // Calculate max values directly here
        let maxClo1 = 0,
          maxClo2 = 0,
          maxClo3 = 0;
        let maxClo1Desc = "",
          maxClo2Desc = "",
          maxClo3Desc = "";

        data.forEach((item: any) => {
          if (item.Clo1_Percentage > maxClo1) {
            maxClo1 = item.Clo1_Percentage;
            maxClo1Desc = item.plo1_description;
          }
          if (item.Clo2_Percentage > maxClo2) {
            maxClo2 = item.Clo2_Percentage;
            maxClo2Desc = item.plo2_description;
          }
          if (item.Clo3_Percentage > maxClo3) {
            maxClo3 = item.Clo3_Percentage;
            maxClo3Desc = item.plo3_description;
          }
        });

        setMaxClo1(maxClo1);
        setMaxClo2(maxClo2);
        setMaxClo3(maxClo3);
        setPlo1(maxClo1Desc);
        setPlo2(maxClo2Desc);
        setPlo3(maxClo3Desc);
        setbt1(data[0]?.clo1_action);
        setbt2(data[0]?.clo2_action);
        setbt3(data[0]?.clo3_action);

        // Determine goodAt and Bloom Taxonomy
        if (maxClo1 >= maxClo2 && maxClo1 >= maxClo3) {
          setGoodAt(maxClo1Desc);
          setBloomTaxonomy(data[0]?.clo1_action || "N/A");
        } else if (maxClo2 >= maxClo1 && maxClo2 >= maxClo3) {
          setGoodAt(maxClo2Desc);
          setBloomTaxonomy(data[0]?.clo2_action || "N/A");
        } else if (maxClo3 >= maxClo1 && maxClo3 >= maxClo2) {
          setGoodAt(maxClo3Desc);
          setBloomTaxonomy(data[0]?.clo3_action || "N/A");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [studentData]);

  const data = {
    labels: [
      !cloData
        ? "NO Info Available"
        : plo1 === null
        ? "Clo Not Available"
        : plo1 + "(CLO 1)",
      !cloData
        ? "NO Info Available"
        : plo2 === null
        ? "Clo Not Info Available"
        : plo2 + "(CLO 2)",
      !cloData
        ? "NO Info Available"
        : plo3 === null
        ? "Clo Not Available"
        : plo3 + "(CLO 3)",
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
        data: cloData ? [maxClo1 || 0, maxClo2 || 0, maxClo3 || 0] : [],
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
      //         100 - (maxClo1 || 100),
      //         100 - (maxClo2 || 100),
      //         100 - (maxClo3 || 100),
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
          color: "rgb(255, 255, 255)",
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

  function getFirstLetters(sentence: any) {
    return sentence
      .split(" ")
      .filter((word: any) => word.length > 0)
      .map((word: any) => word[0].toUpperCase())
      .join("");
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && student && cloData && (
        <div>
          {/* <div className="achieved">
            <h2 className="analysis-rollno">
              {" "}
              {student.batch}-B
              {getFirstLetters(student.department)}-{student.rollno}
            </h2>
            <div className="analysis-msg">
              {!goodAt ? (
                <h1>No Clo Data Available</h1>
              ) : (
                <h1>CLO Verdict: The student is Good At {goodAt}</h1>
              )}
              {!bloomTaxonomy ? (
                <h1> This CLO Doesnt Have Bloom Taxanomy</h1>
              ) : (
                <h1>Bloom Taxanomy: The student is Good At {bloomTaxonomy}</h1>
              )}
            </div>
          </div> */}
          <CChart
            type="radar"
            className="chart"
            data={data}
            options={options}
            ref={chartRef}
          />
        </div>
      )}
      <div className="analysis-table">
        {maxClo1 && (
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
                  <td>{maxClo1}%</td>
                  <td>{plo1}</td>
                  <td>{bt1}</td>
                </tr>

                <tr>
                  <td>CLO 2</td>
                  <td>{maxClo2}%</td>
                  <td>{plo2}</td>
                  <td>{bt2}</td>
                </tr>

                <tr>
                  <td>CLO 3</td>
                  <td>{maxClo3}%</td>
                  <td>{plo3}</td>
                  <td>{bt3}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
