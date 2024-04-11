import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import "./Privilege.css";
const Privilege = ({ flow }) => {
  const [privilege, setPrivilege] = useState({
    name: '',
    description: '',
    action: '',
    resource: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const isEditFlow = flow === "edit" ? true : false;
  const isViewFlow = flow === "view" ? true : false;
  const navigate = useNavigate();
  let privilegeApi = "";
  if (isEditFlow || isViewFlow) {
    privilegeApi += `http://localhost:3000/privileges/${id}`;
  } else {
    privilegeApi = `http://localhost:3000/privileges`;
  }


  useEffect(() => {
    if (isEditFlow || isViewFlow) {
      getPrivilege();
    }
  }, []);

  const getPrivilege = () => {
    axios
      .get(privilegeApi)
      .then((item) => {
        setPrivilege(item.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, value);
    setPrivilege({ ...privilege, [name]: value });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if (isViewFlow) {
      navigate("/show-privilege");
      return;
    }
    fetch(privilegeApi, {
      method: isEditFlow ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(privilege),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(true);
        navigate("/show-privilege");
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      })
  };

  return (
    <div className="privilege-form">
      <div className="heading">
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <p>{isEditFlow ? "Edit Privilege" : isViewFlow ? "Show Privilege" : "Create Privilege"}</p>
      </div>
      <form onSubmit={handelSubmit}>
        <div className="mb-3">
          <label for="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            disabled={isViewFlow}
            value={privilege.name}
            onChange={handelInput}
          />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="text" className="form-label">
            Description
          </label>
          <input
            type="description"
            className="form-control"
            id="description"
            name="description"
            disabled={isViewFlow}
            value={privilege.description}
            onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="action" className="form-label">
            Action
          </label>
          <input
            type="text"
            className="form-control"
            id="action"
            name="action"
            disabled={isViewFlow}
            value={privilege.action}
            onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="resource" className="form-label">
            Resource
          </label>
          <input
            type="text"
            className="form-control"
            id="resource"
            name="resource"
            disabled={isViewFlow}
            value={privilege.resource}
            onChange={handelInput}
          />
        </div>
        <button type="submit" className="btn btn-primary submit-btn">
          {isEditFlow ? "Edit" : isViewFlow ? "Back" : "Submit"}
        </button>
      </form>
    </div>
  );
};
export default Privilege;
