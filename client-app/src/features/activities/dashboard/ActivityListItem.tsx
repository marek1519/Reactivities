import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
  activity: Activity;
  loading: boolean;
}

const ActivityListItem = ({ activity }: Props) => {
  return (
    <>
      <Segment.Group>
        {activity.isCancelled &&
        <Label attached="top" color='red' content='Cancled' style={{textAlgin:'center'}} ></Label>}
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image style={{marginBottom:3}} size="tiny" circular src="/assets/user.png" />
              <Item.Content>
                <Item.Header as={Link} to={`/activities/${activity.id}`}>
                  {activity.title}
                </Item.Header>
                <Item.Description>Hosted by {activity.host?.displayName}</Item.Description>
                {activity.isHost && <Item.Description>
                  <Label basic color='orange'>
                    You are hosting this activity
                  </Label>
                  </Item.Description>}
                {activity.isGoing && !activity.isHost && <Item.Description>
                  <Label basic color='green'>
                    You are going to this activity
                  </Label>
                  </Item.Description>}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>

        <Segment>
          <span>
            <Icon name="clock" />{" "}
            {format(activity.date!, "dd MMMM yyyy h:mm aa")}
            <Icon name="marker" /> {activity.venue}
          </span>
        </Segment>

        <Segment secondary>
          <ActivityListItemAttendee attendees={activity.attendees!} />
        </Segment>

        <Segment clearing>
          <span></span>
          <Button
            as={Link}
            to={`/activities/${activity.id}`}
            color="teal"
            floated="right"
            content="View"
          />
        </Segment>
      </Segment.Group>
    </>
  );
};

export default ActivityListItem;
