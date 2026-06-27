import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Board from "./pages/Board";
import Invitations from "./pages/Invitations";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/workspace/:id"
          element={<Workspace />}
        />
<Route
  path="/invitations"
  element={<Invitations />}
/>
        <Route
          path="/board/:id"
          element={<Board />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;