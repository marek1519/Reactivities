import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/Store";
import ActivityDetails from "../detals/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
  activities: Activity[];
}

const ActivitiyDashboard = ({
  activities
}: Props) => {

  const { activityStore } = useStore();
  
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList activities={activities} />
      </Grid.Column>

      <Grid.Column width="6">
        {!activityStore.editMode && activityStore.selectedActivity && (
          <ActivityDetails />
        )}
        {activityStore.editMode && (
          <ActivityForm />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivitiyDashboard);
