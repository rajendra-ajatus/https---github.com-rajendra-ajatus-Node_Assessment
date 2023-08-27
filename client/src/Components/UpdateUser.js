import React, {useState, useEffect} from "react";
import axios from 'axios';
import {Link, useParams, useNavigate} from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    role: "",
    candelete: "",
    email: "",
    password: "",
  });

  const { id } = useParams();
  
  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (data.email && data.password) {
      try {
        const response = await axios.put("http://localhost:8001/updateuser", data);
        console.log(response.data);
        navigate("/");

      } catch (error) {
        console.log(error);
      }
      
    }
  };

  const getUserdata = async () => {
    try {
      const response = await axios.post("http://localhost:8001/getUserData", {id: id});

      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserdata();
  }, []);

  return (
    <>
      <Link to="/"><button className="mx-4 my-4">Go to Home</button></Link>

      <h1 className="mt-5">Update User</h1>

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

        <label htmlFor="role" className="label">
          Role
          <select
            name="role"
            className="input-field"
            value={data.role}
            onChange={changeHandler}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </label>

        {data.role === "admin" && (
          <label htmlFor="role" className="label">
            Delete Feeds
            <select
              name="candelete"
              className="input-field"
              value={data.candelete}
              onChange={changeHandler}
              required
            >
              <option value="">Select</option>
              <option value="1">True</option>
              <option value="0">False</option>
            </select>
          </label>
        )}

        <label htmlFor="email" className="label">
          Email
          <input
            name="email"
            value={data.email}
            type="email"
            className="input-field"
            placeholder="Enter Email"
            onChange={changeHandler}
          />
        </label>

        <label htmlFor="password" className="label">
          Password
          <input
            name="password"
            value={data.password}
            type="password"
            className="input-field"
            placeholder="Enter Password"
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

export default CreateUser;
