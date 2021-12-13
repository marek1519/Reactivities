import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/Store";

const ActivityDetails = () => {
  const { activityStore } = useStore();
  const { id } = useParams<{ id: string }>();
  const { selectedActivity: viewActivity, loadActivity, lodingInitial } = activityStore;
  
  useEffect(() => {
    if (id) loadActivity(id);
  }, [id, lodingInitial, loadActivity]);

  if (lodingInitial || !viewActivity) return <LoadingComponent />;

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
          <Button basic color="blue" content="Edit" as={Link} to={`/manage/${viewActivity.id}`} />
          <Button basic color="grey" content="Cancel" as={Link} to='/activities' />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
