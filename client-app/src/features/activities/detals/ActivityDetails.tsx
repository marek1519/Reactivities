import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity;
  cancelSelectedActivity: () => void;
  openForm: (id: string) => void;
}

const ActivityDetails = ({
  activity,
  cancelSelectedActivity,
  openForm,
}: Props) => {
  const viewActivity: Activity = activity;

  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${viewActivity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{viewActivity.title}</Card.Header>
        <Card.Meta>
          <span className="date">{viewActivity.date}</span>
        </Card.Meta>
        <Card.Description>{viewActivity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths="2">
          <Button
            basic
            color="blue"
            content="Edit"
            onClick={() => {
              openForm(activity.id);
            }}
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={() => cancelSelectedActivity()}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default ActivityDetails;
