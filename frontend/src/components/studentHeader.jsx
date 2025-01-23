import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { action } from "../store";
import { useState } from "react";

export default function StudentHeader() {
  const navigate = useNavigate();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const dispatch = useDispatch();
  function handleLogout() {
    localStorage.setItem("userstatus", "false");
    setOpenConfirmation(false);
    dispatch(action.LoginStatusfalse());
    navigate("/studentlogin");
  }

  return (
    <>
      <div className="Modal-content">
        {openConfirmation && (
          <dialog
            className={`Modal ${openConfirmation ? "open" : ""}`}
            open={openConfirmation}
            onClose={() => setOpenConfirmation(false)}
          >
            <div className="Modal-header">
              <h2>Are you sure you want to Logout</h2>
              <div className="Modal-body">
                <button onClick={() => handleLogout()}>Yes</button>
                <button onClick={() => setOpenConfirmation(false)}>No </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
      <nav className="header">
        <NavLink to={""}>
          <div className="student-logo">
            {" "}
            <img src="/logo.png" />
            <h1>Student</h1>
          </div>
        </NavLink>
        <ul>
          <li>
            {" "}
            <NavLink
              to={"#"}
              onClick={() => setOpenConfirmation(true)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Log out
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
