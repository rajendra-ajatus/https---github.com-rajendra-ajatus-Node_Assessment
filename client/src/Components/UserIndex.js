import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const UserIndex = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [myData, setMyData] = useState({});

  const getAllData = async () => {
    try {
      const myData = jwt_decode(localStorage.getItem("token"));
      setMyData(myData);

      const response = await axios.get("http://localhost:8001/users", data);

      if (myData.role === "Super Admin") {
        const filteredData = response.data.filter(
          (item) => item.role === "admin" || item.role === "user"
        );
        setData(filteredData);
      }
      if (myData.role === "admin") {
        const onlyUserData = response.data.filter(
          (item) => item.role === "user"
        );
        setData(onlyUserData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = (id) => {
    navigate(`/updateuser/${id}`);
  };

  const deleteUser = (id) => {
    try {
      const respone = axios.post("http://localhost:8001/deleteuser", {
        id: id,
      });
      getAllData();
    } catch (error) {}
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <>
      <h1 className="my-5">Welcome {myData.name} !</h1>
      {myData.role !== "user" && (
        <Link to="/createuser">
          <span className="mx-4">
            <button>Create User</button>
          </span>
        </Link>
      )}

      {myData.role !== "Super Admin" && (
        <Link to="/feedindex">
          <span className="mx-4">
            <button>View Feeds</button>
          </span>
        </Link>
      )}

      {myData.role !== "Super Admin" && (
        <Link to="/createfeed">
          <span className="mx-4">
            <button>Create Feed</button>
          </span>
        </Link>
      )}

      <div>
        {data.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <button type="button" onClick={() => updateUser(item.id)}>
                    Update
                  </button>
                  <button type="button" onClick={() => deleteUser(item.id)}>
                    Delete
                  </button>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default UserIndex;
