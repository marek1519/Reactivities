import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  activities: Activity[];
  submitting: boolean;
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

const ActivityList = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
}: Props) => {
  const [target, SetTarget] = useState("");

  const handleActivityDelete = (
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    SetTarget(e.currentTarget.name);
    deleteActivity(id);

  };

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
                  loading={submitting && target === item.id}
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

export default ActivityList;
