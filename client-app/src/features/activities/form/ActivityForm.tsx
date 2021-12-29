import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Segment, Button, Header } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/Store";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { CategoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Activity } from "../../../app/models/activity";

const ActivityForm = () => {
  const navigate = useNavigate();
  const [activity, SetActivity] = useState<Activity>({
    id: "",
    title: "",
    date: null,
    description: "",
    category: "",
    city: "",
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required("The activity category is required"),
    date: Yup.string().required("The activity date is required").nullable(),
    city: Yup.string().required("The activity city is required"),
    venue: Yup.string().required("The activity venue is required"),
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

  const handleFormSubmit = (activity: Activity) => {
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

  if (loading) <LoadingComponent></LoadingComponent>;

  return (
    <Segment clearing>
      <Header sub content="Activity details" color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ values: activity, isValid, isSubmitting, dirty, handleSubmit }) => (
          <Form className="ui form" onSubmit={handleSubmit}>
            <MyTextInput name="title" placeholder="title" />

            <MyTextArea rows={3} placeholder="Description" name="description" />
            <MySelectInput
              options={CategoryOptions}
              placeholder="Category"
              name="category"
            />
            <MyDateInput
              autoComplete="off"
              placeholderText="Date"
              showTimeSelect
              timeCaption="time"
              dateFormat="yyyy-MM-dd, hh:mm"
              name="date"
            />

            <Header sub content="Location details" color="teal" />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />

            <Button.Group widths="2">
              <Button
               disabled={isSubmitting || !dirty || !isValid}
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
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ActivityForm);
