import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import "./Role.css";
const Role = ({ flow }) => {
  const [role, setRole] = useState({
    name: '',
    description: '',
    privileges: [],
  });
  const [privileges, setPrivileges] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const isEditFlow = flow === "edit" ? true : false;
  const isViewFlow = flow === "view" ? true : false;
  const navigate = useNavigate();
  let roleApi = "";
  if (isEditFlow || isViewFlow) {
    roleApi += `http://localhost:3000/roles/${id}`;
  } else {
    roleApi = `http://localhost:3000/roles`;
  }
  const privilegeApi = "http://localhost:3000/privileges";

  useEffect(() => {
    if (isEditFlow || isViewFlow) {
      getRole();
    }
    getPrivilege();
  }, []);

  const getRole = () => {
    axios
      .get(roleApi)
      .then((item) => {
        setRole(item.data);
        const privilegeIds = item.data.privileges.map((privilege) => privilege.id);
        setCheckedState(privilegeIds)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPrivilege = () => {
    axios
      .get(privilegeApi)
      .then((item) => {
        setPrivileges(item.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCheckedState([...checkedState, value]);
    } else {
      setCheckedState(checkedState.filter((item) => item !== value));
    }
  }

  const handelInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, value);
    setRole({ ...role, [name]: value });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if (isViewFlow) {
      navigate("/show-role");
      return;
    }
    const selectedPrivileges = checkedState.map((id) => ({ id }));
    const updatedRole = { ...role, privileges: selectedPrivileges};
    fetch(roleApi, {
      method: isEditFlow ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRole),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(true);
        navigate("/show-role");
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      })
  };

  return (
    <div className="role-form">
      <div className="heading">
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <p>{isEditFlow ? "Edit Role" : isViewFlow ? "Show Role" : "Create Role"}</p>
      </div>
      <form onSubmit={handelSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            disabled={isViewFlow}
            value={role.name}
            onChange={handelInput}
          />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            disabled={isViewFlow}
            value={role.description}
            onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">
            Privileges
          </label>
          <ul className="form-control">
            {privileges && privileges.map(({ id, name }, index) => {
              return (
                <li key={index} className="form-control">
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={id}
                    className="check-box-control"
                    checked={checkedState.includes(id)}
                    onChange={handleOnChange}
                  />{name}
                </li>
              );
            })}
          </ul>
        </div>
        <button type="submit" className="btn btn-primary submit-btn">
          {isEditFlow ? "Edit" : isViewFlow ? "Back" : "Submit"}
        </button>
      </form>
    </div>
  );
};
export default Role;
