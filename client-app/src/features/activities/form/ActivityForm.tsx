import React, { ChangeEvent, FormEvent, useState } from "react";
import { Form, Segment, Button } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity | undefined;
  closeForm: () => void;
  createOrEdit: (activity : Activity | any) => void;
}

const ActivityForm = ({ activity: selectedActivity, closeForm, createOrEdit }: Props) => {
  const initialState = selectedActivity ?? {
    id: "",
    title: "",
    date: "",
    description: "",
    category: "",
    city: "",
    venue: "",
  };

  const [activity, SetActivity] = useState(initialState);

  const handleSubmit = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createOrEdit(activity);
  };

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    SetActivity({ ...activity, [name]: value });
  }

  function handleTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;
    SetActivity({ ...activity, [name]: value });
  }

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
          <Button floated="right" positive type="submit" content="Submit" />
          <Button
            floated="right"
            type="button"
            content="Cancel"
            onClick={closeForm}
          />
        </Button.Group>
      </Form>
    </Segment>
  );
};

export default ActivityForm;
