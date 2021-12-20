import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Header } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/Store";
import ActivityListItem from "./ActivityListItem";

interface Props {
  activities: Activity[];
}

const ActivityList = ({ activities }: Props) => {
  const { activityStore } = useStore();
  const { grouppedActivities } = activityStore;

  return (
    <>
      {grouppedActivities.map(([group, activities]) => (
        <Fragment key={group}>
          <Header sub color="teal">
            {group}
          </Header>
          {activities.map((activity) => (
            <ActivityListItem
              loading={activityStore.lodingInitial}
              key={activity.id}
              activity={activity}
            ></ActivityListItem>
          ))}
        </Fragment>
      ))}
    </>
  );
};

export default observer(ActivityList);
