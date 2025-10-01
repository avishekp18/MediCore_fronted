// src/pages/Appointment.jsx
import React from "react";
import Hero from "../components/Hero";
import AppointmentForm from "../components/AppointmentForm";

const Appointment = () => {
  const scrollToForm = () => {
    const form = document.getElementById("appointment-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Hero
        title="Schedule Your Appointment | MediCore Medical Institute"
        imageUrl="/signin.png"
        data="Schedule Now 📩"
        onButtonClick={scrollToForm} // scrolls to form
      />
      <AppointmentForm />
    </>
  );
};

export default Appointment;
