

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

import ProtectedLayout from "./components/layout/ProtectedLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Layout */}

        <Route element={<ProtectedLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/workspace/:id"
            element={<Workspace />}
          />

          <Route
            path="/board/:id"
            element={<Board />}
          />

          <Route
            path="/invitations"
            element={<Invitations />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}