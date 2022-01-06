import { observer } from "mobx-react-lite";
import { LayoutRouteProps } from "react-router-dom";
import { Container } from "semantic-ui-react";
import NavBar from "./navbar";

const AppContainer = ({ element }: LayoutRouteProps) => {
    return (
      <>
        <NavBar />
        <Container style={{ marginTop: "7em" }}>{element}</Container>
      </>
    );
  };
  
  export default observer(AppContainer);