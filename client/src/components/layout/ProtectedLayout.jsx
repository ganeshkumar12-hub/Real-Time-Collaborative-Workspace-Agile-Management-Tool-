import Layout from "./Layout";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}