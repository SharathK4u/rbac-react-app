import "./App.css";
import ShowUser from "./components/User/ShowUser";
import { Route, Routes } from "react-router-dom";
import User from "./components/User/User";
import Header from "./components/Common/Header";
import Home from "./components/Layout/Home";
import Privilege from "./components/Privilege/Privilege";
import ShowPrivilege from "./components/Privilege/ShowPrivilege";
import Role from "./components/Role/Role"
import ShowRole from "./components/Role/ShowRole";
function App() {
  return (
    <div className="App">
      <header className="container">
        <div className="">
          <Header />
          <Routes>
          
            <Route path="/" element={<Home />} />
            <Route path="/edit-user/:id" element={<User  flow="edit"/>} />
            <Route path="/user/:id" element={<User flow="view"/>} />
            <Route path="/create-user" element={<User flow="create"/>} />
            <Route path="/show-user" element={<ShowUser />} />
            <Route path="/edit-role/:id" element={<Role flow="edit"/>} />
            <Route path="/role/:id" element={<Role flow="view"/>} />
            <Route path="/create-role" element={<Role flow="create"/>} />
            <Route path="/show-role" element={<ShowRole />} />
            <Route path="/edit-privilege/:id" element={<Privilege flow="edit"/>} />
            <Route path="/privilege/:id" element={<Privilege flow="view"/>} />
            <Route path="/create-privilege" element={<Privilege flow="create"/>} />
            <Route path="/show-privilege" element={<ShowPrivilege />} />
          </Routes>
          
        </div>
      </header>
    </div>
  );
}

export default App;
