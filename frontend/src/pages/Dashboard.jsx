import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Box from "../components/box";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState([]);
  const teacherid = localStorage.getItem("user");

  //   const [totalStudents, setTotalStudents] = useS
  // tate({
  //     uniqueEnrollments: new Set(),
  //     courseCount: {},
  //   });

  useEffect(() => {
    async function getteacherCourses() {
      const response = await axios.get(
        `http://localhost:5000/Courses/${teacherid}`
      );
      setCourses(response.data);
      console.log(response.data);
    }
    async function getTotalStudents() {
      const response = await axios.get(
        `http://localhost:5000/totalstudents/${teacherid}`
      );
      setTotalStudents(response.data);
      console.log(response.data);
    }

    console.log(totalStudents);
    getteacherCourses();
    getTotalStudents();
  }, []);
  return (
    <>
      <div className="wrapper ">
        <Box title="Total Courses" type="courses" data={courses} />
        <Box title="Total Students" type="students" data={totalStudents} />
        <Link to={"/marking"} className="flex-center card al-card-header">
          <Box title="Marks Entry" type="marking" />
        </Link>
        <Link to={"/students"}>
          <Box title="Student Analysis" type="analysis" />
        </Link>
      </div>
    </>
  );
}

export default Dashboard;
