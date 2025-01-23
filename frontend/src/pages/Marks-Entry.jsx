import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { action } from "../store";
import { getFirstLetters } from "../../util";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function Marks() {
  const [update, setUpdate] = useState(-1);
  const [cloValue, setCloValue] = useState();
  const [cloreset, setcloreset] = useState();
  const [isValid, setIsValid] = useState(true);
  const [theoryCoursesDetails, setTheoryCoursesdetails] = useState([]);
  const [LabCoursesDetails, setLabCoursesDetails] = useState([]);
  const [theoryCourses, setTheoryCourses] = useState([]);
  const [LabCourses, setLabCourses] = useState([]);
  const [courseFilter, setCourseFilter] = useState("default");
  const [departments, setdepartments] = useState([]);
  const [batchFilter, setBatchFilter] = useState("default");
  const [departmentFilter, setDepartmentFilter] = useState("default");
  const [semesterFilter, setSemesterFilter] = useState("default");
  const [errormsgClo1, setErrorMsgClo1] = useState("");
  const [errormsgClo2, setErrorMsgCLo2] = useState("");
  const [errormsgClo3, setErrorMsgClo3] = useState("");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("lab");
  const [assessmentToolFilter, setAssessmentToolFilter] = useState("default");
  const [clo1, setClo1] = useState(0);
  const [clo2, setClo2] = useState(0);
  const [clo3, setClo3] = useState(0);
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
          // console.log(response.data);
          setClo1(response.data.clo1);
          setClo2(response.data.clo2);
          setClo3(response.data.clo3);
          setTheoryCourses(response.data);
        });
    }
    async function getLabCourses() {
      const response = await axios
        .get(`http://localhost:5000/teacherCoursesLab/${teacherID}`)
        .then((response) => {
          setClo1(response.data.clo1);
          setClo2(response.data.clo2);
          setClo3(response.data.clo3);
          setLabCourses(response.data);
        });
    }
    async function getTheoryCourseDetails() {
      const response = await axios
        .get(`http://localhost:5000/theorycoursedetails`)
        .then((response) => {
          // console.log(response.data, "theorycoursess");
          setTheoryCoursesdetails(response.data);
        });
    }
    async function getLabCourseDetauls() {
      const response = await axios
        .get(`http://localhost:5000/labcoursedetails`)
        .then((response) => {
          // console.log(response.data);
          setLabCoursesDetails(response.data);
        });
    }
    if (!isValid) {
      // setTheoryCourses([]);
      // setLabCourses([]);
    }

    try {
      getLabCourseDetauls();
      getTheoryCourseDetails();
      getTheoryCourses();
      getLabCourses();
      getDepartments();
      clo1ref.current.value = 0;
      clo2ref.current.value = 0;
      clo3ref.current.value = 0;
    } catch (err) {
      console.log("An error has occured", err);
    }
  }, [
    update,
    assessmentToolFilter,
    filteredData,
    teacherID,
    isValid,
    cloValue,
  ]);

  let debounceTimer;
  function validateCLo(inputValue, clo, courseID, cloType) {
    console.log("Validating:", inputValue, clo, courseID, cloType);

    let filter;
    if (courseCategoryFilter === "theory") {
      filter = theoryCoursesDetails.filter(
        (course) => course.courseID === courseID
      );
    } else {
      filter = LabCoursesDetails.filter(
        (course) => course.courseID === courseID
      );
    }

    if (filter.length > 0) {
      const maxAllowedValue = filter[0][cloType];

      if (clo === 1 && inputValue > maxAllowedValue) {
        handleError(maxAllowedValue, 1, "clo1");
      } else if (clo === 2 && inputValue > maxAllowedValue) {
        handleError(maxAllowedValue, 2, "clo2");
      } else if (clo === 3 && inputValue > maxAllowedValue) {
        handleError(maxAllowedValue, 3, "clo3");
      } else {
        resetErrors();
      }
    }
  }

  function handleError(maxValue, clo, cloName) {
    const errorMsg =
      maxValue === 0
        ? `This ${cloName.toUpperCase()} Doesn't Exist`
        : `Error: Value greater than ${maxValue} in ${cloName.toUpperCase()}`;

    console.log("Error for CLO:", clo, errorMsg);

    if (clo === 1) setErrorMsgClo1(errorMsg);
    if (clo === 2) setErrorMsgCLo2(errorMsg);
    if (clo === 3) setErrorMsgClo3(errorMsg);
    // setIsValid(false);
  }

  function handleCLoValidation(event, clo, courseID, cloType) {
    const inputValue = isNaN(parseInt(event.target.value, 10))
      ? 0
      : parseInt(event.target.value, 10);

    if (clo === 1) setClo1(inputValue);
    if (clo === 2) setClo2(inputValue);
    if (clo === 3) setClo3(inputValue);

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      validateCLo(inputValue, clo, courseID, cloType);
    }, 300);
  }

  async function handleUpdate(
    index,
    roll_No,
    batch,
    department,
    semester,
    courseID,
    clo1,
    clo2,
    clo3
  ) {
    setUpdate(index);
    if (update === index) {
      console.log("update Function called");

      console.log(
        clo1,
        clo2,
        clo3,
        roll_No,
        batch,
        department,
        semester,
        courseID
      );
      if (isValid) {
        try {
          if (assessmentToolFilter === "assignment") {
            const response = await axios
              .put("http://localhost:5000/theorycourse/assignment", {
                clo1,
                clo2,
                clo3,
                roll_No,
                batch,
                department,
                semester,
                courseID,
              })
              .then((response) => {
                toast.success("Assignment marks updated successfully!");
              });
          } else if (assessmentToolFilter === "quiz") {
            const response = await axios
              .put("http://localhost:5000/theorycourse/quiz", {
                clo1,
                clo2,
                clo3,
                roll_No,
                semester,
                batch,
                department,
                courseID,
              })
              .then((response) => {
                toast.success("Quiz marks updated successfully!");
              });
          } else if (assessmentToolFilter === "midterm") {
            const response = await axios
              .put("http://localhost:5000/theorycourse/mid", {
                clo1,
                clo2,
                clo3,
                roll_No,
                batch,
                semester,
                department,
                courseID,
              })
              .then((response) => {
                toast.success("Mid marks updated successfully!");
              });
          } else if (assessmentToolFilter === "final") {
            const response = await axios
              .put("http://localhost:5000/theorycourse/final", {
                clo1,
                clo2,
                clo3,
                roll_No,
                batch,
                semester,
                department,
                courseID,
              })
              .then((response) => {
                toast.success("Final marks updated successfully!");
              });
          } else if (assessmentToolFilter === "labManual") {
            console.log("Lab Manual Api Called");
            const response = await axios
              .put("http://localhost:5000/labcourse/manual", {
                clo1,
                clo2,
                clo3,
                roll_No,
                batch,
                semester,
                department,
                courseID,
              })
              .then((response) => {
                toast.success("Final marks updated successfully!");
              });
          } else if (assessmentToolFilter === "project") {
            const response = await axios
              .put("http://localhost:5000/labcourse/project", {
                clo1,
                clo2,
                clo3,
                roll_No,
                batch,
                semester,
                department,
                courseID,
              })
              .then((response) => {
                toast.success("Final marks updated successfully!");
              });
          } else if (assessmentToolFilter === "labExam") {
            const response = await axios
              .put("http://localhost:5000/labcourse/labexam", {
                clo1,
                clo2,
                clo3,
                roll_No,
                semester,
                batch,
                department,
                courseID,
              })
              .then((response) => {
                toast.success("Final marks updated successfully!");
              });
          }
        } catch (err) {
          toast.error("Error updating records.");
        }
      }

      return setUpdate(-1);
    } else {
      if (assessmentToolFilter === "Default") {
        toast.error("Please select any option");
        return setUpdate(-1);
      }

      setTheoryCourses([]);
      setLabCourses([]);
    }
  }
  function handleResetFilter() {
    setCourseFilter("default");
    setAssessmentToolFilter("default");
    setCourseCategoryFilter("default");
    setBatchFilter("default");
    setDepartmentFilter("default");
  }

  function resetErrors() {
    setErrorMsgClo1("");
    setErrorMsgCLo2("");
    setErrorMsgClo3("");
    setIsValid(true);
  }
  function handleStudentSelection(batch, department, rollno, courseid) {
    dispatch(action.Addstudent({ batch, department, rollno, courseid }));
    console.log(batch, department, rollno, courseid);
    Navigation("/analysis");
  }

  // Filter students based on selected filters
  if (courseCategoryFilter === "theory") {
    filteredData = theoryCourses.filter((student) => {
      const isCourseMatch =
        student.course_Title.trim().toLowerCase() ===
        courseFilter.trim().toLowerCase();
      const isBatchMatch =
        batchFilter === "default" || student.batch === batchFilter;
      const isDepartmentMatch =
        departmentFilter === "default" ||
        student.department === departmentFilter;
      const isSemester =
        semesterFilter === "default" ||
        student.semester.parseInt === semesterFilter;

      return isCourseMatch && isBatchMatch && isSemester && isDepartmentMatch;
    });
  } else {
    filteredData = LabCourses.filter((student) => {
      const isCourseMatch = student.course_Title === courseFilter;
      const isBatchMatch =
        batchFilter === "default" || student.batch === batchFilter;
      const isDepartmentMatch =
        departmentFilter === "default" ||
        student.department === departmentFilter;
      const isSemester =
        semesterFilter === "default" || student.semester === semesterFilter;
      return isCourseMatch && isBatchMatch && isSemester && isDepartmentMatch;
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
                  <></>
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
                        {/* {console.log(course.course_Title)} */}
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
                {departments &&
                  departments.map((dep, index) => (
                    <option key={index} value={dep.department}>
                      {dep.department}
                    </option>
                  ))}
              </select>
            </div>
            <div className="selection">
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
            </div>
            <div className="selection">
              <select
                value={courseCategoryFilter}
                onChange={(e) => setCourseCategoryFilter(e.target.value)}
                name="course-category"
                id="course-category"
              >
                <option value="lab">Laboratory</option>
                <option value="theory">Theory</option>
              </select>
            </div>
            <div className="selection">
              <select
                value={assessmentToolFilter}
                onChange={(e) => setAssessmentToolFilter(e.target.value)}
                name="assesment-tool"
                id="assesment-tool"
              >
                {courseCategoryFilter === "theory" ? (
                  <>
                    <option value="default">Assessment Tool</option>
                    <option value="quiz">Quizzes</option>
                    <option value="assignment">Assignments</option>
                    <option value="midterm">Midterm Exam</option>
                    <option value="final">Final Exams</option>
                  </>
                ) : (
                  <>
                    <option value="default">Assessment Tool</option>

                    <option value="labManual">Lab Manual</option>
                    <option value="project">Project</option>
                    <option value="labExam">Lab Exam</option>
                  </>
                )}
              </select>
            </div>
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
                <th>CLO-1</th>
                <th>CLO-2</th>
                <th>CLO-3</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* {console.log(filteredData)} */}
              {filteredData.map((student, index) => (
                <tr key={index}>
                  <td>
                    {student.batch}-B
                    {getFirstLetters(student.department)}-{student.roll_No}-
                  </td>
                  <>
                    <td>
                      <input
                        type="number"
                        name="clo1"
                        id="clo1"
                        style={{
                          color: update !== index ? "white" : "black",
                        }}
                        defaultValue={clo1}
                        value={
                          update !== index
                            ? (assessmentToolFilter === "labManual" &&
                                student.LabManual_Clo1) ||
                              (assessmentToolFilter === "project" &&
                                student.LabProject_CLo1) ||
                              (assessmentToolFilter === "labExam" &&
                                student.labExam_clo1) ||
                              (assessmentToolFilter === "assignment" &&
                                student.Assignment_clo1) ||
                              (assessmentToolFilter === "quiz" &&
                                student.Quiz_clo1) ||
                              (assessmentToolFilter === "midterm" &&
                                student.Midterm_clo1) ||
                              (assessmentToolFilter === "final" &&
                                student.Final_clo1)
                            : clo1 && clo1
                        }
                        onChange={(event) =>
                          handleCLoValidation(
                            event,
                            1, // CLO 1
                            student.courseID,
                            `${
                              assessmentToolFilter.charAt(0).toUpperCase() +
                              assessmentToolFilter.slice(1)
                            }_clo1`
                          )
                        }
                        disabled={update !== index}
                      />
                      <p className="error-msg">
                        {update === index && errormsgClo1}
                      </p>
                    </td>
                    <td>
                      <input
                        type="number"
                        name="clo2"
                        id="clo2"
                        style={{
                          color: update !== index ? "white" : "black",
                        }}
                        defaultValue={clo2}
                        value={
                          update !== index
                            ? (assessmentToolFilter === "labManual" &&
                                student.LabManual_Clo2) ||
                              (assessmentToolFilter === "project" &&
                                student.LabProject_CLo2) ||
                              (assessmentToolFilter === "labExam" &&
                                student.labExam_clo2) ||
                              (assessmentToolFilter === "assignment" &&
                                student.Assignment_clo2) ||
                              (assessmentToolFilter === "quiz" &&
                                student.Quiz_clo2) ||
                              (assessmentToolFilter === "midterm" &&
                                student.Midterm_clo2) ||
                              (assessmentToolFilter === "final" &&
                                student.Final_clo2)
                            : clo2 && clo2
                        }
                        onChange={(event) =>
                          handleCLoValidation(
                            event,
                            2,
                            student.courseID,
                            `${
                              assessmentToolFilter.charAt(0).toUpperCase() +
                              assessmentToolFilter.slice(1)
                            }_clo2`
                          )
                        }
                        disabled={update !== index}
                      />
                      <p className="error-msg">
                        {update === index && errormsgClo2}
                      </p>
                    </td>
                    <td>
                      <input
                        type="number"
                        name="clo3"
                        id="clo3"
                        style={{
                          color: update !== index ? "white" : "black",
                        }}
                        defaultValue={clo3}
                        value={
                          update !== index
                            ? (assessmentToolFilter === "labManual" &&
                                student.LabManual_Clo3) ||
                              (assessmentToolFilter === "project" &&
                                student.LabProject_CLo3) ||
                              (assessmentToolFilter === "labExam" &&
                                student.labExam_clo3) ||
                              (assessmentToolFilter === "assignment" &&
                                student.Assignment_clo3) ||
                              (assessmentToolFilter === "quiz" &&
                                student.Quiz_clo3) ||
                              (assessmentToolFilter === "midterm" &&
                                student.Midterm_clo3) ||
                              (assessmentToolFilter === "final" &&
                                student.Final_clo3)
                            : clo3 && clo3
                        }
                        onChange={(event) =>
                          handleCLoValidation(
                            event,
                            3, // CLO 1
                            student.courseID,
                            `${
                              assessmentToolFilter.charAt(0).toUpperCase() +
                              assessmentToolFilter.slice(1)
                            }_clo3`
                          )
                        }
                        disabled={update !== index}
                      />
                      <p className="error-msg">
                        {update === index && errormsgClo3}
                      </p>
                    </td>

                    <td className="flex">
                      <button
                        onClick={() =>
                          assessmentToolFilter === "default"
                            ? toast.error("Please Select the assessment Tool")
                            : handleUpdate(
                                index,
                                student.roll_No,
                                student.batch,
                                student.department,
                                student.semester,
                                student.courseID,
                                clo1,
                                clo2,
                                clo3
                              )
                        }
                      >
                        {update !== index ? "Edit" : "Update"}
                      </button>
                      <button
                        onClick={() =>
                          handleStudentSelection(
                            student.batch,
                            student.department,
                            student.roll_No,
                            student.courseID
                          )
                        }
                      >
                        Details
                      </button>
                    </td>
                  </>
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
