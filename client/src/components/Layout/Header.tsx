import { FC } from "react";
import { NavLink, Link } from "react-router-dom";
import Logo from "../../assets/diamond-data-logo.svg";
import Auth from "../../utils/auth";

const Header: FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={Logo} alt="App Logo" className="logo-img" />
        </Link>

        {/* Navigation */}
        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

           <NavLink
            to="/AddPlayer"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Add Player
          </NavLink>

          <NavLink
            to="/Stats"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Stats
          </NavLink>

          <NavLink
            to="/BaseballAI"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            BaseballAI
          </NavLink>

          <NavLink
            to="/BaseballCard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Baseball Card
          </NavLink>

          {Auth.loggedIn() ? (
            <button
              type="button"
              className="nav-link"
              onClick={() => Auth.logout()}
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;