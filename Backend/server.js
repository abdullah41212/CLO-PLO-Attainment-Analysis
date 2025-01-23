const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql");
const app = express();
app.use(express.json());
app.use(cors());

const db = sql
  .connect({
    user: "project",
    password: "123",
    server: "DESKTOP-ICVPSMV",
    database: "DbmsProject",
    options: {
      trustServerCertificate: true,
    },
  })
  .then(() => console.log("connection sucessfull"))
  .catch(() => console.log("connection failed"));

// Get all users

// app.get("/coursesLab/:id", async (req, res) => {
//   const teacherid = req.params.id;
//   try {
//     const result = await sql.query(`execute labCourses ${teacherid}`);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching users");
//   }
// });
// app.get("/CoursesTheory", async (req, res) => {
//   try {
//     const result = await sql.query("select * from TheoryMarks");

//     res.json(result.recordset);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching users");
//   }
// });
// app.get("/CoursesLab", async (req, res) => {
//   try {
//     const result = await sql.query("select * from LabMarks");

//     res.json(result.recordset);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching users");
//   }
// });
app.get("/teachers", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM teacher");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});
app.get("/studentdetail", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM student_Details");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});
app.get("/teacherCoursestheory/:id", async (req, res) => {
  const teacherid = req.params.id;
  try {
    const result = await sql.query(
      `execute teachersCoursesTheory ${teacherid}`
    );

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});
app.get("/teacherCourseslab/:id", async (req, res) => {
  const teacherid = req.params.id;
  try {
    const result = await sql.query(`execute teachersCoursesLab ${teacherid}`);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});
app.get("/courses/:id", async (req, res) => {
  const teacherID = req.params.id;
  try {
    const result = await sql.query(
      `select * from course where teacherID = ${teacherID}`
    );

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});
app.get("/theorycoursedetails", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM theory_course");
    if (result) {
      res.json(result.recordset);
    } else {
      res.status(404).send(" not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching THeory Courses");
  }
});
app.get("/labcoursedetails", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM lab_course");
    if (result) {
      res.json(result.recordset);
    } else {
      res.status(404).send(" not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching teacher");
  }
});
app.get("/totalstudents/:id", async (req, res) => {
  const teacherID = req.params.id;
  try {
    const result = await sql.query(`getTotalStudents ${teacherID}`);
    if (result) {
      res.json(result.recordset);
    } else {
      res.status(404).send(" not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching teacher");
  }
});
app.get("/cloAnalysis", async (req, res) => {
  const { batch, department, rollno, courseid } = req.query; // Use query parameters

  try {
    const result = await sql.query`
      EXEC getStudentCloPercentage 
        @batch = ${batch}, 
        @department = ${department}, 
        @rollno = ${Number(rollno)}, 
        @courseID = ${courseid}
    `;

    if (
      batch === undefined ||
      department === undefined ||
      rollno === undefined ||
      courseid === undefined
    ) {
      return res.status(400).json({
        message:
          "All fields (batch, department, rollno, courseid) are required",
      });
    }

    if (result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res.status(404).send("Data not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching CLO Data");
  }
});
app.get("/studentcloanalysis", async (req, res) => {
  const { rollno, batch, department, teacherID } = req.query; // Use query parameters
  try {
    const result = await sql.query`
      execute getAllCoursesCloMarks 
      @rollno = ${Number(rollno)}, 
        @batch = ${batch}, 
        @department = ${department}, 
        @teacherID=${Number(teacherID)}
    `;

    if (
      batch === undefined ||
      department === undefined ||
      rollno === undefined ||
      teacherID === undefined
    ) {
      return res.status(400).json({
        message:
          "All fields (batch, department, rollno, courseid) are required",
      });
    }

    if (result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res.status(404).send("Data not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching CLO Data");
  }
});
app.get("/plopercentage", async (req, res) => {
  const { rollno, batch, department } = req.query;

  // Validate query parameters before executing SQL
  if (!rollno || !batch || !department) {
    return res.status(400).json({
      message: "All fields (batch, department, rollno) are required",
    });
  }

  try {
    console.log("Query Params:", { rollno, batch, department });

    const result = await sql.query`
      execute getPlosPercentages 
      @roll_no = ${Number(rollno)}, 
      @batch = ${batch},
      @department = ${department}`;

    if (result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res.status(404).send("Data not found");
    }
  } catch (err) {
    console.error("Error executing SQL query:", err);
    res.status(500).json({
      message: "An error occurred while fetching CLO Data",
      error: err.message,
    });
  }
});

app.get("/departments", async (req, res) => {
  try {
    const result = await sql.query(`select distinct department from student`);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting departments");
  }
});
app.post("/students", async (req, res) => {
  const { stuID, stuName, stuSemester } = req.body;

  if (!stuID || !stuName || !stuSemester) {
    return res.status(400).json({
      message: "All fields (stuID, stuName, stuSemester) are required",
    });
  }

  const result = await sql.query`
      INSERT INTO student (stuID, stuName, stuSemester)
      VALUES (${stuID}, ${stuName}, ${stuSemester});
    `;
  res.json({
    message: "User added successfully",
    rowsAffected: result.rowsAffected,
  });
});
app.put("/theorycourse/assignment", async (req, res) => {
  const { clo1, clo2, clo3, roll_No, batch, department, semester, courseID } =
    req.body;
  console.log(clo1, clo2, clo3, roll_No, semester, batch, department, courseID);
  if (
    clo1 === undefined ||
    clo2 === undefined ||
    clo3 === undefined ||
    roll_No === undefined ||
    batch === undefined ||
    department === undefined ||
    semester === undefined ||
    courseID === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const result = await sql.query`
    execute addAssignmentMarks 
    @clo1 = ${clo1}, 
    @clo2 = ${clo2}, 
    @clo3 = ${clo3}, 
    @roll_No = ${roll_No}, 
    @semester = ${semester}, 
    @batch = ${batch}, 
    @department = ${department}, 
    @courseID = ${courseID}
`;
  res.json({
    message: "User added successfully",
    rowsAffected: result.rowsAffected,
  });
});
app.put("/theorycourse/quiz", async (req, res) => {
  const { clo1, clo2, clo3, roll_No, batch, department, semester, courseID } =
    req.body;
  console.log(clo1, clo2, clo3, roll_No, batch, department, semester, courseID);
  if (
    clo1 === undefined ||
    clo2 === undefined ||
    clo3 === undefined ||
    roll_No === undefined ||
    batch === undefined ||
    department === undefined ||
    semester === undefined ||
    courseID === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const result = await sql.query`
    execute addQuizMarks 
    @clo1 = ${clo1}, 
    @clo2 = ${clo2}, 
    @clo3 = ${clo3}, 
    @roll_No = ${roll_No}, 
    @batch = ${batch}, 
    @semester = ${semester},
    @department = ${department}, 
    @courseID = ${courseID}
`;
  res.json({
    message: "User added successfully",
    rowsAffected: result.rowsAffected,
  });
});
app.put("/theorycourse/mid", async (req, res) => {
  const { clo1, clo2, clo3, roll_No, batch, department, semester, courseID } =
    req.body;

  console.log(clo1, clo2, clo3, roll_No, batch, department, semester, courseID);
  if (
    clo1 === undefined ||
    clo2 === undefined ||
    clo3 === undefined ||
    roll_No === undefined ||
    batch === undefined ||
    department === undefined ||
    semester === undefined ||
    courseID === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const result = await sql.query`
    execute addMidsMarks 
    @clo1 = ${clo1}, 
    @clo2 = ${clo2}, 
    @clo3 = ${clo3}, 
    @semester = ${semester}, 
    @roll_No = ${roll_No}, 
    @batch = ${batch}, 
    @department = ${department}, 
    @courseID = ${courseID}
`;
  res.json({
    message: "User added successfully",
    rowsAffected: result.rowsAffected,
  });
});
app.put("/theorycourse/final", async (req, res) => {
  const { clo1, clo2, clo3, roll_No, batch, department, semester, courseID } =
    req.body;
  console.log(clo1, clo2, clo3, roll_No, batch, department, semester, courseID);
  if (
    clo1 === undefined ||
    clo2 === undefined ||
    clo3 === undefined ||
    roll_No === undefined ||
    batch === undefined ||
    department === undefined ||
    semester === undefined ||
    courseID === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const result = await sql.query`
    execute addFinalMarks
    @clo1 = ${clo1}, 
    @clo2 = ${clo2}, 
    @clo3 = ${clo3}, 
    @semester = ${semester}, 
    @roll_No = ${roll_No}, 
    @batch = ${batch}, 
    @department = ${department}, 
    @courseID = ${courseID}
`;
  res.json({
    message: "User added successfully",
    rowsAffected: result.rowsAffected,
  });
});
app.put("/labcourse/manual", async (req, res) => {
  const { clo1, clo2, clo3, roll_No, batch, department, semester, courseID } =
    req.body;
  console.log(clo1, clo2, clo3, roll_No, batch, department, semester, courseID);
  if (
    clo1 === undefined ||
    clo2 === undefined ||
    clo3 === undefined ||
    roll_No === undefined ||
    batch === undefined ||
    department === undefined ||
    semester === undefined ||
    courseID === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const result = await sql.query`
    execute addManualMarks
   @clo1 = ${Number(clo1)}, 
    @clo2 = ${Number(clo2)}, 
    @clo3 = ${Number(clo3)}, 
    @roll_No = ${roll_No}, 
    @semester = ${semester}, 
    @batch = ${batch}, 
    @department = ${department}, 
    @courseID = ${courseID}
`;
  res.json({
    message: "User added successfully",
    rowsAffected: result.rowsAffected,
  });
});
app.put("/labcourse/project", async (req, res) => {
  const { clo1, clo2, clo3, roll_No, batch, department, semester, courseID } =
    req.body;
  console.log({
    clo1,
    clo2,
    clo3,
    roll_No,
    batch,
    department,
    semester,
    courseID,
  });
  if (
    clo1 === undefined ||
    clo2 === undefined ||
    clo3 === undefined ||
    roll_No === undefined ||
    batch === undefined ||
    department === undefined ||
    semester === undefined ||
    courseID === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const result = await sql.query`
    execute addProjectMarks
   @clo1 = ${Number(clo1)}, 
    @clo2 = ${Number(clo2)}, 
    @clo3 = ${Number(clo3)}, 
    @roll_No = ${roll_No}, 
    @semester = ${Number(semester)}, 
    @batch = ${batch}, 
    @department = ${department}, 
    @courseID = ${courseID}
`;
  res.json({
    message: "User added successfully",
    rowsAffected: result.rowsAffected,
  });
});
app.put("/labcourse/labexam", async (req, res) => {
  const { clo1, clo2, clo3, roll_No, semester, batch, department, courseID } =
    req.body;
  console.log(clo1, clo2, clo3, roll_No, batch, department, semester, courseID);
  if (
    clo1 === undefined ||
    clo2 === undefined ||
    clo3 === undefined ||
    roll_No === undefined ||
    batch === undefined ||
    department === undefined ||
    semester === undefined ||
    courseID === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const result = await sql.query`
    execute addLabExamMarks
   @clo1 = ${Number(clo1)}, 
    @clo2 = ${Number(clo2)}, 
    @clo3 = ${Number(clo3)}, 
    @roll_No = ${roll_No}, 
    @semester = ${Number(semester)}, 
    @batch = ${batch}, 
    @department = ${department}, 
    @courseID = ${courseID}
`;
  res.json({
    message: "User added successfully",
    rowsAffected: result.rowsAffected,
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
