import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const FeedIndex = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [myData, setMyData] = useState({});

  const getAllData = async () => {
    try {
      const myData = jwt_decode(localStorage.getItem("token"));
      setMyData(myData);

      const response = await axios.get("http://localhost:8001/feeds");

      setData(response.data);
    } catch (error) {
      console.log(error);
    };
  };

  const updateFeed = (id) => {
    navigate(`/updatefeed/${id}`);
  };

  const viewFeed = (id) => {
    navigate(`/viewfeed/${id}`);
  };

  const deleteFeed = (id) => { try {
    const respone = axios.post("http://localhost:8001/deletefeed", {
      id: id,
    });
    getAllData();
  } catch (error) {}
};

  useEffect(() => {
    getAllData();
  }, []);

  console.log(data);

  return (
    <>
      <h1 className="my-5">Welcome {myData.name} !</h1>
      {myData.role === "admin" && (
        <Link to="/createfeed"><span className="mx-4"><button>Create Feed</button></span></Link>
      )}

      <div>
        {data.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Url</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.url}</td>
                  <td>{item.description}</td>
                  <button type="button" onClick={() => viewFeed(item.id)}>
                    View
                  </button>
                  <button type="button" onClick={() => updateFeed(item.id)}>
                    Update
                  </button>
                  <button type="button" onClick={() => deleteFeed(item.id)}>
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

export default FeedIndex;
