import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Form, Segment, Button } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/Store";
import { v4 as uuid } from "uuid";
import { useNavigate  } from "react-router-dom";

const ActivityForm = () => {
  const navigate = useNavigate();
  const [activity, SetActivity] = useState({
    id: "",
    title: "",
    date: "",
    description: "",
    category: "",
    city: "",
    venue: "",
  });

  const { activityStore } = useStore();
  const { createActivity, updateActivity, loadActivity, loading } =
    activityStore;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadActivity(id).then((activity) => {
        SetActivity(activity!);
      });
    }
  }, [id, loadActivity]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (activity.id.length === 0) {
      let newActivity = { ...activity, id: uuid() };
      createActivity(newActivity).then(() => {
        navigate(`/activities/${newActivity.id}`);
      });
    } else {
      updateActivity(activity);
      navigate(`/activities/${activity.id}`);
    }
  };

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    SetActivity({ ...activity, [name]: value });
  }

  function handleTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;
    SetActivity({ ...activity, [name]: value });
  }
  if (loading) <LoadingComponent></LoadingComponent>;

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          placeholder="Title"
          label="Title"
          type="text"
          value={activity?.title}
          name="title"
          onChange={handleInputChange}
        />
        <Form.TextArea
          placeholder="Description"
          label="Description"
          value={activity.description}
          name="description"
          onChange={handleTextChange}
        />
        <Form.Input
          placeholder="Category"
          label="Category"
          value={activity.category}
          name="category"
          onChange={handleInputChange}
        />
        <Form.Input
          type="date"
          placeholder="Date"
          label="Date"
          value={activity.date}
          name="date"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="City"
          label="City"
          value={activity.city}
          name="city"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Venue"
          label="Venue"
          value={activity.venue}
          name="venue"
          onChange={handleInputChange}
        />

        <Button.Group widths="2">
          <Button
            loading={activityStore.loading}
            floated="right"
            positive
            type="submit"
            content="Submit"
          />
          <Button
            floated="right"
            type="button"
            content="Cancel"
            as={NavLink}
            to="/activities"
          />
        </Button.Group>
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
