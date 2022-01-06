import "semantic-ui-css/semantic.min.css";
import ActivitiyDashboard from "../../features/activities/dashboard/ActivitiyDashboard";
import { observer } from "mobx-react-lite";
import HomePage from "../../features/activities/home/HomePage";
import { Route, Routes, useLocation } from "react-router-dom";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestErrors";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/loginForm";
import { useStore } from "../stores/Store";
import { useEffect } from "react";
import LoadingComponent from "./LoadingComponent";
import AppContainer from "./AppContainer";
import ModalContainer from "../common/modals/ModalContainer";

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => {
        commonStore.setAppLoaded();
      });
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app . . . " />;

  return (
    <>
      <ToastContainer position="bottom-right" />
      <ModalContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/activities"
          element={<AppContainer element={<ActivitiyDashboard />} />}
        />
        <Route
          path="/activities/:id"
          element={<AppContainer element={<ActivityDetails />} />}
        />
        <Route
          path="/createActivity"
          element={<AppContainer element={<ActivityForm />} />}
        />
        <Route
          key={location.key}
          path="/manage/:id"
          element={<AppContainer element={<ActivityForm />} />}
        />

        <Route
          key={location.key}
          path="/errors"
          element={<AppContainer element={<TestErrors />} />}
        />
        <Route
          key={location.key}
          path="/server-error"
          element={<AppContainer element={<ServerError />} />}
        />
        <Route
          key={location.key}
          path="/login"
          element={<AppContainer element={<LoginForm />} />}
        />

        <Route path="*" element={<AppContainer element={<NotFound />} />} />
      </Routes>
    </>
  );
}



export default observer(App);
