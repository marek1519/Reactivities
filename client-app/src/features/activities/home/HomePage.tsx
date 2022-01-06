import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Header,
  Segment,
  Image,
  Button
} from "semantic-ui-react";
import { useStore } from "../../../app/stores/Store";
import LoginForm from "../../users/loginForm";
import RegisterForm from "../../users/RegisterForm";

export default observer(function HomePage() {
  const { userStore, modalStore } = useStore();
  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        {userStore.isLoggedIn ? (
          <>
            <Header as="h2" inverted content="Welcome to Reactivities" />
            <Button as={Link} to="/activities" size="huge" inverted>
              Go to Activities!
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                modalStore.openModal(<LoginForm />);
              }}
            >
              Login!
            </Button>
            <Button
              onClick={() => {
                modalStore.openModal(<RegisterForm />);
              }}
            >
              Register!
            </Button>
          </>
        )}
      </Container>
    </Segment>
  );
});
