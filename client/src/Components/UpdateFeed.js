import React, {useState, useEffect} from "react";
import axios from 'axios';
import {Link, useParams, useNavigate} from 'react-router-dom';

const UpdateFeed = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    url: "",
    description: "",
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
    console.log("clicked.....")

      try {
        const response = await axios.put("http://localhost:8001/updatefeed", data);
        console.log(response.data);
        navigate("/feedindex");

      } catch (error) {
        console.log(error);
      }
  };

  const getUserdata = async () => {
    try {
      const response = await axios.post("http://localhost:8001/getFeedData", {id: id});

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
      <Link to="/">Go to Home</Link>

      <h1 className="mt-5">Update Feed</h1>

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
            required
          />
        </label>

        <label htmlFor="role" className="label">
          Url
          <input
            name="url"
            value={data.url}
            type="text"
            className="input-field"
            placeholder=""
            onChange={changeHandler}
            required
          />
        </label>

        <label htmlFor="email" className="label">
          Description
          <input
            name="description"
            value={data.description}
            type="text"
            className="input-field"
            placeholder="Enter description"
            onChange={changeHandler}
            required
          />
        </label>

        

        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </>
  );
};

export default UpdateFeed;
