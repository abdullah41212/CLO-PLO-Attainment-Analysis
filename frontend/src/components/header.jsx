import { useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { action } from "../store";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const dispatch = useDispatch();
  function handleLogout() {
    localStorage.setItem("status", "false");
    setOpenConfirmation(false);
    dispatch(action.LoginStatusfalse());
    navigate("/Login");
  }
  const location = useLocation();

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
        <NavLink to={"/"}>
          {" "}
          <img src="/logo.png" />
        </NavLink>
        <ul>
          {location.pathname === "/" ? (
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
          ) : (
            <>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {" "}
                  <a>Dashboard</a>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/marking"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {" "}
                  <a>Marks Entry</a>
                </NavLink>
              </li>
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
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
