import strikeLogo from "../assets/img/logo.png";

export default function Mission() {
  return (
    <section className="py-16 bg-primary text-white px-4 min-h-[500px] ">
      {/* 1. Centered Title */}
      <h2 className="text-6xl md:text-4xl font-bold text-center mb-12 font-jersey">
        Our Mission
      </h2>

      {/* 2. Two-column container */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Left Column: Logo */}
        <div className="flex-shrink-0">
          <img
            src={strikeLogo}
            alt="Strike Mentor Logo"
            className="w-32 md:w-40 mx-auto"
          />
        </div>

        {/* Right Column: Text */}
        <div className="text-center md:text-left space-y-4">
          <p className="leading-relaxed font-poppins text-2xl">
            Strike Mentor is a web application designed for Counter-Strike
            players who want to level up their game. Whether you’re struggling
            to master Dust II or aiming to outsmart opponents with pro-level
            strategies, Strike Mentor has you covered. The app offers an
            immersive experience inspired by the gritty, tactical vibe of
            Counter-Strike, guiding players through detailed game info, mentor
            insights, and interactive chatbot features.
          </p>
        </div>
      </div>
    </section>
  );
}
