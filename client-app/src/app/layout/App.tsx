import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import ActivitiyDashboard from "../../features/activities/dashboard/ActivitiyDashboard";
import NavBar from "./navbar";
import { observer } from "mobx-react-lite";
import HomePage from "../../features/activities/home/HomePage";
import { LayoutRouteProps, Route, Routes, useLocation } from "react-router-dom";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

function App() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/activities"
        element={<App2 element={<ActivitiyDashboard />} />}
      />
      <Route
        path="/activities/:id"
        element={<App2 element={<ActivityDetails />} />}
      />
      <Route
        path="/createActivity"
        element={<App2 element={<ActivityForm />} />}
      />
      <Route
        key={location.key}
        path="/manage/:id"
        element={<App2 element={<ActivityForm />} />}
      />
    </Routes>
  );
}

const App2 = ({ element }: LayoutRouteProps) => {
  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>{element}</Container>
    </>
  );
};

export default observer(App);
