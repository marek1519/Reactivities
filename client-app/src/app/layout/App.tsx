import { useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { Container, Header } from "semantic-ui-react";
import ActivitiyDashboard from "../../features/activities/dashboard/ActivitiyDashboard";
import NavBar from "./navbar";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/Store";
import { observer } from "mobx-react-lite";

function App() {
  const {activityStore} = useStore();


  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

if(activityStore.lodingInitial) return <LoadingComponent></LoadingComponent>;
  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <Header as="h2" icon="users" content="Reactivities" />
        <ActivitiyDashboard activities={activityStore.activitiesByDate} />
      </Container>
    </>
  );
}

export default observer(App);
