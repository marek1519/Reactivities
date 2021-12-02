import React from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  activities: Activity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

const ActivityList = ({
  activities,
  selectActivity,
  deleteActivity,
}: Props) => {
  return (
    <Segment>
      <Item.Group>
        {activities.map((item) => (
          <Item key={item.id} onClick={() => selectActivity(item.id)}>
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
                  floated="right"
                  content="Delete"
                  color="red"
                  onClick={() => deleteActivity(item.id)}
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

export default ActivityList;
