import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";

const NavBar = () => {

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to='/'>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "50px" }}
          />
        </Menu.Item>
        <Menu.Item as={NavLink} to='/activities' name="Activities" />

        <Menu.Item as={NavLink} to='/createActivity'>
          <Button
            positive
            content="Create Activity"
            as={NavLink}
            to='/createActivity'
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
