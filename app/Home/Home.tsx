import { FC } from "react";

import styles from "./Home.module.scss";

import Hero from "./sections/Hero/Hero";
import Carousels from "./sections/Carousels/Carousels";
import ServiceTime from "./sections/ServiceTime/ServiceTime";
import Contact from "./sections/Contact/Contact";
import Navigation from "@/components/Nav/Navigation";

const Home: FC = () => {
  return (
    <div className={styles.container}>
      <Navigation />

      <div id="home">
        <Hero />
      </div>

      <div id="ministries">
        <Carousels />
      </div>

      <div id="service-times">
        <ServiceTime />
      </div>

      <div id="contact">
        <Contact />
      </div>
    </div>
  );
};

export default Home;
