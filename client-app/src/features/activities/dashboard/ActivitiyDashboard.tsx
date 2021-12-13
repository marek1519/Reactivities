import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/Store";
import ActivityList from "./ActivityList";

const ActivitiyDashboard = () => {
  const { activityStore } = useStore();
  const { loadActivities, activityRegistry } = activityStore;
  useEffect(() => {
    if (activityRegistry.size <= 1) loadActivities();
  }, [activityRegistry.size, loadActivities]);

  if (activityStore.lodingInitial) return <LoadingComponent></LoadingComponent>;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList activities={activityStore.activitiesByDate} />
      </Grid.Column>

      <Grid.Column width="6">
        <h2>Filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivitiyDashboard);
