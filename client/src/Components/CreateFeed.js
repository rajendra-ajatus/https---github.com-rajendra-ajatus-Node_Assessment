import React, {useState} from "react";
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const CreateFeed = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    description: "",
    url: "",
  });

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (data.name && data.description && data.url) {
        const userData = jwt_decode(localStorage.getItem("token"));
        console.log(userData);
      try {
        const response = await axios.post("http://localhost:8001/createFeed", {
            name: data.name,
            url: data.url,
            description: data.description,
           
        });
        
        console.log(response.data);
        navigate("/feedindex");
        
      } catch (error) {
        console.log(error);
      }
      
    }
  };

  console.log(data);

  return (
    <>
      <Link to="/">Go to Home</Link>

      <h1 className="mt-5">Create Feed</h1>

      <form className="form" onSubmit={submitHandler}>
        <label htmlFor="name" className="label">
          Name
          <input
            name="name"
            value={data.name}
            type="text"
            className="input-field"
            placeholder="Enter name"
            onChange={changeHandler}
          />
        </label>

        <label htmlFor="description" className="label">
          Description
          <input
            name="description"
            value={data.description}
            type="text"
            className="input-field"
            placeholder="Description"
            onChange={changeHandler}
          />
        </label>

        <label htmlFor="url" className="label">
          Url
          <input
            name="url"
            value={data.url}
            type="text"
            className="input-field"
            placeholder="Enter URL"
            onChange={changeHandler}
          />
        </label>

        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </>
  );
};

export default CreateFeed;
