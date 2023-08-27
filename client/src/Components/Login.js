import React, {useState} from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [data, setData] =useState({email: "", password: ""});

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  
  const submitHandler = async(e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8001/login", data);

      localStorage.setItem("token", response.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div classname="col-lg-4 col-sm-12">
          <h1>LOGIN</h1>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input type="email" className="form-control" name="email" onChange={onChangeHandler} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" classnme="form-label">
                Password
              </label>
              <input type="password" className="form-control" name="password" onChange={onChangeHandler} required />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
