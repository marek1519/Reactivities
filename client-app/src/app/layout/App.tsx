import React, { useEffect, useState } from "react";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import { Container, Header } from "semantic-ui-react";
import { Activity } from "../models/activity";
import ActivitiyDashboard from "../../features/activities/dashboard/ActivitiyDashboard";
import NavBar from "./navbar";
import { v4 as uuid } from "uuid";

function App() {
  const [activities, SetActivities] = useState<Activity[]>([]);
  const [selectedActivity, SetSelectedActivity] = useState<
    Activity | undefined
  >();
  const [editMode, SetEditMode] = useState(false);

  useEffect(() => {
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        SetActivities(response.data);
      });
  }, []);

  function handleSelectedActivity(id: string) {
    SetEditMode(false);
    SetSelectedActivity(activities.find((x) => x.id === id));
  }

  function handleCancelSelectedActivity() {
    SetSelectedActivity(undefined);
  }

  const handleFormOpen = (id?: string) => {
    id ? handleSelectedActivity(id) : handleCancelSelectedActivity();
    SetEditMode(true);
  };

  const handleFormClose = () => {
    SetEditMode(false);
  };

  const handleCreateOrEditActivity = (activity: Activity) => {
    if (activity.id) {
      SetActivities([
        ...activities.filter((x) => x.id !== activity.id),
        activity,
      ]);
    } else {
      activity.id = uuid();
      alert(activity.id);
      SetActivities([...activities, activity]);
    }
    SetEditMode(false);
    SetSelectedActivity(activity);
  };

  const handleDeleteActivity = (id: string) => {
    SetActivities([...activities.filter((p) => p.id !== id)]);
  };

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <Header as="h2" icon="users" content="Reactivities" />
        <ActivitiyDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectedActivity}
          cancelSelectedActivity={handleCancelSelectedActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
