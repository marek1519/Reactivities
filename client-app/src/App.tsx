import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import { Header, List } from "semantic-ui-react";

function App() {
  const [activities, SetActivities] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/activities").then((response) => {
      SetActivities(response.data);
    });
  }, []);

  const activitiesUI = activities.map((act: any) => (
    <List.Item key={act.id}>{act.title}</List.Item>
  ));

  return (
    <div className="">
      <Header as='h2' icon='users' content='Reactivities' />
        <List>{activitiesUI}</List>
    </div>
  );
}

export default App;
