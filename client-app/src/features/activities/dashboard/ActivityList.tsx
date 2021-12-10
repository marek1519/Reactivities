import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/Store";

interface Props {
  activities: Activity[];
}

const ActivityList = ({ activities }: Props) => {
  const [target, SetTarget] = useState("");
  const { activityStore } = useStore();

  const handleActivityDelete = (
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    SetTarget(e.currentTarget.name);
    activityStore.deleteActivity(id);
  };

  return (
    <Segment>
      <Item.Group>
        {activities.map((item) => (
          <Item
            key={item.id}
            onClick={() => activityStore.setSelectActivity(item.id)}
          >
            <Item.Content>
              <Item.Header as="a">{item.title}</Item.Header>
              <Item.Meta>{item.date}</Item.Meta>
              <Item.Description>
                <div>{item.description}</div>
                <div>
                  {item.city} {item.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  loading={activityStore.loading && target === item.id}
                  name={item.id}
                  floated="right"
                  content="Delete"
                  color="red"
                  onClick={(e) => handleActivityDelete(e, item.id)}
                />
                <Label basic content={item.category} />
              </Item.Extra>
              <hr />
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);
