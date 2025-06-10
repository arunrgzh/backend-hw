import heroImage from "../assets/img/background_1.png";
import TextGenerateEffect from "./TextGenerate";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <section
      className="relative bg-fixed bg-cover bg-center bg-no-repeat min-h-[100vh] flex items-center justify-center text-center px-4"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundColor: "#090D13",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-5 z-0"></div>

      {/* Content */}
      <div className="z-10 max-w-4xl px-4">
        <TextGenerateEffect
          wordClassName="font-jersey text-2xl md:text-4xl lg:text-6xl font-bold mx-auto text-center mb-14"
          words="WELCOME TO YOUR COUNTER-STRIKE TRAINING GROUND! "
          wordsCallbackClass={({ word }) => {
            if (word === "COUNTER-STRIKE") {
              return "bg-gradient-to-r from-[#FF9B01] to-[#D36611] bg-clip-text text-transparent";
            }
            return "";
          }}
        />
        <p className="text-base md:text-lg lg:text-2xl text-gray-400 mb-6 font-jersey">
          Explore detailed map breakdowns, expert strategies, and guidance from
          virtual mentors like the Founder, CT, and Terrorist. Sharpen your
          skills and dominate the battlefield. Ready to level up? Hit the button
          and begin your journey to victory!
        </p>
        <button
          className="bg-primary-orange font-poppins text-white px-6 py-3 rounded hover:bg-opacity-90 transition"
          onClick={() => navigate("/sign-in")}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

export default Hero;
