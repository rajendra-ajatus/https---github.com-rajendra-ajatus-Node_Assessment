import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserIndex from "./Components/UserIndex";
import CreateUser from "./Components/CreateUser";
import UpdateUser from "./Components/UpdateUser";
import Login from "./Components/Login";
import CreateFeed from "./Components/CreateFeed";
import UpdateFeed from "./Components/UpdateFeed";
import FeedIndex from "./Components/FeedIndex";
import FeedsAccess from "./Components/FeedsAccess";
import ViewFeed from './Components/ViewFeed';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" exact element={<Login />} />
          <Route path="/" exact element={<UserIndex />} />
          <Route path="/feedindex" exact element={<FeedIndex />} />
          <Route path="/createuser" exact element={<CreateUser/>} />
          <Route path="/updateuser/:id" exact element={<UpdateUser/>} />
          <Route path="/updatefeed/:id" exact element={<UpdateFeed/>} />
          <Route path="/createfeed" exact element={<CreateFeed/>} />
          <Route path="/feedaccess" exact element={<FeedsAccess />} />
          <Route path="/viewfeed/:id" exact element={<ViewFeed />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
