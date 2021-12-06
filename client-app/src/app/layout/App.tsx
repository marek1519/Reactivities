import React, { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Container, Header } from "semantic-ui-react";
import { Activity } from "../models/activity";
import ActivitiyDashboard from "../../features/activities/dashboard/ActivitiyDashboard";
import NavBar from "./navbar";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, SetActivities] = useState<Activity[]>([]);
  const [selectedActivity, SetSelectedActivity] = useState<
    Activity | undefined
  >();
  const [editMode, SetEditMode] = useState(false);
  const [loading, SetLoading] = useState(true);
  const [submitting, SetSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then((p) => {
      let activities: Activity[] = [];
      p.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        activities.push(activity);
      });
      SetActivities(activities);
      SetLoading(false);
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
    SetSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        SetActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity
        ]);
        SetSelectedActivity(activity);
        SetEditMode(false);
        SetSubmitting(false);
      });
    } else {
      activity.id = uuid();
      agent.Activities.update(activity).then((p) => {
        SetActivities([...activities, activity]);
      });
      SetSelectedActivity(activity);
      SetEditMode(false);
      SetSubmitting(false);
    }
    
    
  };

  const handleDeleteActivity = (id: string) => {
    SetSubmitting(true);
    agent.Activities.delete(id).then((p) => {
      SetActivities([...activities.filter((p) => p.id !== id)]);
      SetSubmitting(false);
      SetEditMode(false);
      SetSelectedActivity(undefined);
    });
  };

  //if(loading) return <LoadingComponent></LoadingComponent>

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <Header as="h2" icon="users" content="Reactivities" />
        {loading && <LoadingComponent></LoadingComponent>}
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
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
