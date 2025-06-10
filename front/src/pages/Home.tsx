import Mission from "../components/Mission";
import Hero from "../components/Hero";
import Navbar from "@/components/Navbar";
import VideoShowcase from "../components/VideoShowcase";
import React, { FC } from "react";

const Home: FC = () => {
  return (
    <div>
      <Hero />
      <Mission />
      <VideoShowcase />
    </div>
  );
};

export default Home;
