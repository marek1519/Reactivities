import { observer } from "mobx-react-lite";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/Store";


const ActivityDetails = () => {
  const { activityStore } = useStore();
  const viewActivity: any = activityStore.selectedActivity;
if(!viewActivity) return <LoadingComponent  />
  

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
           activityStore.openForm(viewActivity.id);
            }}
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={() => activityStore.cancelSelectedActivity()}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
