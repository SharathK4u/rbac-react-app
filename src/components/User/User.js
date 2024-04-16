import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import "./User.css";
const User = ({ flow }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    age: '',
    role:{},
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const isEditFlow = flow === "edit" ? true : false;
  const isViewFlow = flow === "view" ? true : false;
  const navigate = useNavigate();
  let userApi = "";
  if (isEditFlow || isViewFlow) {
    userApi += `http://localhost:8080/api/v1/users/${id}`;
  } else {
    userApi = `http://localhost:8080/api/v1/users`;
  }
  const roleApi = "http://localhost:8080/api/v1/roles";

  useEffect(() => {
    if (isEditFlow || isViewFlow) {
      getUser();
    }
    getRole();
  }, []);

  const getUser = () => {
    axios
      .get(userApi)
      .then((item) => {
        setUser(item.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRole = () => {
    axios
      .get(roleApi)
      .then((item) => {
        setRoles(item.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, value);
    setUser({ ...user, [name]: value });
  };

  const handleSelectChange = (e) => {
    setUser({ ...user, role: {...user.role,id:e.target.value}});
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if (isViewFlow) {
      navigate("/show-user");
      return;
    }
    fetch(userApi, {
      method: isEditFlow ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(true);
        navigate("/show-user");
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      })
  };

  return (
    <div className="user-form">
      <div className="heading">
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <p>{isEditFlow ? "Edit User" : isViewFlow ? "Show User" : "Create User"}</p>
      </div>
      <form onSubmit={handelSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            disabled={isViewFlow}
            value={user.firstName}
            onChange={handelInput}
          />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            disabled={isViewFlow}
            value={user.lastName}
            onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">
            Age
          </label>
          <input
            type="text"
            className="form-control"
            id="age"
            name="age"
            disabled={isViewFlow}
            value={user.age}
            onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <select className="form-control"  value={user.role.id} onChange={handleSelectChange}  disabled={isViewFlow}>
            <option value="">Select a role</option>
            {roles && roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary submit-btn">
          {isEditFlow ? "Edit" : isViewFlow ? "Back" : "Submit"}
        </button>
      </form>
    </div>
  );
};
export default User;
