import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Common/Loader";

const ShowPrivilege = () => {
  const showPrivilegeApi = "http://localhost:8080/api/v1/privileges";
  const navigate = useNavigate();
  const [privilege, setPrivilege] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    navigate("/create-privilege");
  }

  const handelDelete = async (id) => {
    console.log("id : -", id);
    setIsLoading(true);
    try {
      const response = await fetch(showPrivilegeApi.concat("/") + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setPrivilege(privilege.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPrivileges();
  }, []);

  const getPrivileges = () => {
    axios
      .get(showPrivilegeApi)
      .then((res) => {
        setPrivilege(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (privilege.length < 0) {
    return <h1>no privilege found</h1>;
  } else {
    return (
      <div className="mt-5">
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <button type="submit" className="btn btn-primary create-btn" onClick={handleCreate}>Create</button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {privilege?.map((item, i) => {
              return (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.action}</td>
                  <td>{item.resource}</td>
                  <td>
                    <Link to={`/edit-privilege/${item.id}`}>
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </Link>
                    <Link to={`/privilege/${item.id}`}>
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </Link>

                    <i
                      className="fa fa-trash-o"
                      aria-hidden="true"
                      onClick={() => handelDelete(item.id)}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default ShowPrivilege;
