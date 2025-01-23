import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { action } from "../store";
import { useDispatch } from "react-redux";
import { getFirstLetters } from "../../util";
import { useNavigate } from "react-router-dom";
export default function Students() {
  const [theoryCourses, setTheoryCourses] = useState([]);
  const [LabCourses, setLabCourses] = useState([]);
  const [department, setdepartments] = useState([]);
  const [courseFilter, setCourseFilter] = useState("default");
  const [batchFilter, setBatchFilter] = useState("default");
  const [departmentFilter, setDepartmentFilter] = useState("default");
  const [semesterFilter, setSemesterFilter] = useState("default");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("default");

  const Navigation = useNavigate();
  const teacherID = localStorage.getItem("user");
  let filteredData;
  const dispatch = useDispatch();
  useEffect(() => {
    async function getDepartments() {
      const response = await axios
        .get("http://localhost:5000/departments")
        .then((res) => setdepartments(res.data));
    }
    async function getTheoryCourses() {
      const response = await axios
        .get(`http://localhost:5000/teacherCoursesTheory/${teacherID}`)
        .then((response) => {
          console.log(response.data);
          setTheoryCourses(response.data);
        });
    }
    async function getLabCourses() {
      const response = await axios
        .get(`http://localhost:5000/teacherCoursesLab/${teacherID}`)
        .then((response) => {
          setLabCourses(response.data);
        });
    }

    getTheoryCourses();
    getLabCourses();
    getDepartments();
  }, [filteredData, teacherID]);

  //   function groupByCourseTitle(courses) {
  //     return courses.reduce((grouped, student) => {
  //       const { course_Title } = student;
  //       if (!grouped[course_Title]) {
  //         grouped[course_Title] = [];
  //       }
  //       grouped[course_Title].push(student);
  //       return grouped;
  //     }, {});
  //   }

  function handleResetFilter() {
    setCourseFilter("default");
    setCourseCategoryFilter("default");
    setBatchFilter("default");
    setDepartmentFilter("default");
  }

  function handleStudentSelection(batch, department, rollno) {
    dispatch(action.Addstudent({ batch, department, rollno, teacherID }));
    console.log(batch, department, rollno);
    Navigation("/completeAnalysis");
  }

  if (courseCategoryFilter === "theory") {
    filteredData = theoryCourses.filter((student) => {
      const isCourseMatch =
        courseFilter === "default" ||
        student.course_Title.trim().toLowerCase() ===
          courseFilter.trim().toLowerCase();

      const isBatchMatch =
        batchFilter === "default" || student.batch === batchFilter;

      const isDepartmentMatch =
        departmentFilter === "default" ||
        student.department === departmentFilter;

      const isSemesterMatch =
        semesterFilter === "default" ||
        parseInt(student.semester) === parseInt(semesterFilter);

      return (
        isCourseMatch && isBatchMatch && isSemesterMatch && isDepartmentMatch
      );
    });
  } else {
    filteredData = LabCourses.filter((student) => {
      const isCourseMatch =
        courseFilter === "default" || student.course_Title === courseFilter;

      const isBatchMatch =
        batchFilter === "default" || student.batch === batchFilter;

      const isDepartmentMatch =
        departmentFilter === "default" ||
        student.department === departmentFilter;

      const isSemesterMatch =
        semesterFilter === "default" || student.semester === semesterFilter;

      return (
        isCourseMatch && isBatchMatch && isSemesterMatch && isDepartmentMatch
      );
    });
  }

  return (
    <>
      <div className="filtering-options">
        <form>
          <div className="major-choices flex-row flex-center">
            <div className="selection">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                name="course"
                id="course"
              >
                {courseCategoryFilter === "default" ? (
                  <>
                    {theoryCourses
                      .filter(
                        (course, index, self) =>
                          index ===
                          self.findIndex(
                            (c) => c.course_Title === course.course_Title
                          )
                      )
                      .map((course, index) => (
                        <option key={index} value={course.course_Title}>
                          {console.log(course.course_Title)}
                          {course.course_Title}
                        </option>
                      ))}
                    {LabCourses &&
                      LabCourses.filter(
                        (course, index, self) =>
                          index ===
                          self.findIndex(
                            (c) => c.course_Title === course.course_Title
                          )
                      ).map((course, index) => (
                        <option key={index} value={course.course_Title}>
                          {course.course_Title}
                        </option>
                      ))}
                  </>
                ) : courseCategoryFilter === "theory" ? (
                  theoryCourses &&
                  theoryCourses
                    .filter(
                      (course, index, self) =>
                        index ===
                        self.findIndex(
                          (c) => c.course_Title === course.course_Title
                        )
                    )
                    .map((course, index) => (
                      <option key={index} value={course.course_Title}>
                        {console.log(course.course_Title)}
                        {course.course_Title}
                      </option>
                    ))
                ) : (
                  LabCourses &&
                  LabCourses.filter(
                    (course, index, self) =>
                      index ===
                      self.findIndex(
                        (c) => c.course_Title === course.course_Title
                      )
                  ).map((course, index) => (
                    <option key={index} value={course.course_Title}>
                      {course.course_Title}
                    </option>
                  ))
                )}

                <option value="default">Default</option>
              </select>
            </div>
            <div className="selection">
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                name="batch"
                id="batch"
              >
                <option value="default">Batch</option>
                <option value="2022F">2022F</option>
                <option value="2022S">2022S</option>
                <option value="2021F">2021F</option>
              </select>
            </div>
            <div className="selection">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                name="department"
                id="department"
              >
                <option value="default">Department</option>
                {department &&
                  department.map((dep, index) => (
                    <option key={index} value={dep.department}>
                      {dep.department}
                    </option>
                  ))}
              </select>
            </div>
            {/* <div className="selection">
              <select
                value={semesterFilter}
                onChange={(e) =>
                  setSemesterFilter(
                    e.target.value === "default"
                      ? "default"
                      : parseInt(e.target.value)
                  )
                }
                name="semester"
                id="semester"
              >
                <option value="default">Semester</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div> */}
            <div className="selection">
              <select
                value={courseCategoryFilter}
                onChange={(e) => setCourseCategoryFilter(e.target.value)}
                name="course-category"
                id="course-category"
              >
                <option value="default">Default</option>
                <option value="lab">Laboratory</option>
                <option value="theory">Theory</option>
              </select>
            </div>
            <div className="selection"></div>
            <button onClick={handleResetFilter} className="list-students-btn">
              Reset Filter
            </button>
          </div>
        </form>
      </div>
      <div className="container">
        <h1>{courseFilter === "default" ? "" : courseFilter}</h1>
        <div className="display-student">
          <table>
            <thead>
              <tr>
                <th>Roll#</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {console.log(filteredData)}
              {filteredData
                .filter(
                  (course, index, self) =>
                    index ===
                    self.findIndex((c) => c.roll_No === course.roll_No)
                )
                .map((student, index) => (
                  <tr key={index}>
                    <td>
                      <h3>
                        {student.batch}-B
                        {getFirstLetters(student.department)}-{student.roll_No}
                      </h3>{" "}
                    </td>
                    <td>
                      {" "}
                      <h3>{student.name}</h3>
                    </td>{" "}
                    <td>
                      <button
                        onClick={() =>
                          handleStudentSelection(
                            student.batch,
                            student.department,
                            student.roll_No
                          )
                        }
                      >
                        <h3> Analyse</h3>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
      />
    </>
  );
}
