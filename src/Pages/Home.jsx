import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import Hero from "../components/Hero";
import MessageForm from "../components/MessageForm";
import Departments from "../components/Departments";

const Home = () => {
  const navigate = useNavigate(); // ✅ initialize navigate

  const goToAppointment = () => {
    navigate("/appointment"); // navigates to /appointment page
  };

  return (
    <>
      <Hero
        title="Welcome to MediCore Medical Institute | Your Trusted Healthcare Provider"
        imageUrl="/contact.png"
        data="Book Appointment"
        onButtonClick={goToAppointment} // pass navigate function
      />
      <Departments />
      <MessageForm />
    </>
  );
};

export default Home;
