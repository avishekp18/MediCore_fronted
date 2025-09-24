import React, { useContext } from "react";
import Hero from "../components/Hero";
import MessageForm from "../components/MessageForm";
import Departments from "../components/Departments";

const Home = () => {
  return (
    <>
      <Hero
        title={
          "Welcome to MediCore Medical Institute | Your Trusted Healthcare Provider"
        }
        imageUrl={"/contact.png"}
        data="Book Appointment"
      />
      <Departments />
      <MessageForm />
    </>
  );
};

export default Home;
