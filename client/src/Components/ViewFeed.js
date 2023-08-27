import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewFeed = () => {
  const { id } = useParams();

  const [data, setData] = useState("");
  const [user, setUser] = useState([]);
  const [accessData, setAccessData] = useState([]);
  const [selected, setSelected] = useState("");
  const [usersWithAccess, setUserWithAccess] = useState([]);
  const [usersWithoutAccess, setUsersWithAccess] = useState([]);

  // const feedDetails = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:8001/getFeedData", {
  //       id: id,
  //     });
  //     setData(response.data);
  //     setAccessData(JSON.parse(response.data.accessto).accessto);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const allUser = async () => {
    try {
      const response = await axios.get("http://localhost:8001/users");
      const onlyUser = response.data.filter((item) => item.role === "user");

      const resp = await axios.post("http://localhost:8001/getFeedData", {
        id: id,
      });

      const granteduser = JSON.parse(resp.data.accessto).accessto;
      const filteredData = onlyUser.filter(item => granteduser.includes(String(item.id)));
      setAccessData(filteredData);

      const filteredDataAgain = onlyUser.filter(item => !granteduser.includes(String(item.id)));
      setUser(filteredDataAgain);
    } catch (error) {
      console.log(error);
    }
  };

  const changeHandler = (e) => {
    setSelected(e.target.value);
  };

  const addUser = async () => {
    try {
      const response = await axios.post("http://localhost:8001/addaccess", {
        userId: selected,
        feedId: id,
      });

      console.log(response);
      window.location.reload();
    } catch (error) {}
  };

  useEffect(() => {
    // feedDetails();
    allUser();
  }, []);

  const deleteUser = async (Id) => {
    try {
      const response = await axios.post("http://localhost:8001/removeaccess", {
        userId: Id,
        feedId: id,
      });

      console.log(response);
      window.location.reload();
    } catch (error) { }
  };

  console.log(usersWithAccess);
  return (
    <>
      <h4 className="px-4 py-3">
        <form onSubmit={addUser}>
        <label htmlFor="role" className="label">
          Give Access
          <select
            name="user"
            className="input-field"
            value={data.role}
            onChange={changeHandler}
            required
          >
            <option value="">Select User</option>
            {user.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <button className="mx-2" type="submit">
          ADD
        </button>
        </form>
        
        <br />
        <br />
        <br />
        Access to
        {accessData.map((item) => (
          <span
            className="mx-2 px-2 py-2"
            style={{ backgroundColor: "black", color: "yellow" }}
            key={item.id}
            onClick={() => deleteUser(item.id)}
          >
            {item.name}
          </span>
        ))}
      </h4>

      <h1 className="mx-4 my-4">{data.name}</h1>
      <h2 className="mx-4 my-4">{data.description}</h2>
    </>
  );
};

export default ViewFeed;
