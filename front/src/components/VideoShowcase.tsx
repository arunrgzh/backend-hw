import FooterLogo from "../assets/img/logo.png";
export default function VideoShowcase() {
  return (
    <>
      <section className="py-10 bg-primary text-white ">
        <div className="items-center justify-center pl-20 max-w-3xl mx-auto pb-20">
          <iframe
            width="700"
            height="450"
            src="https://www.youtube.com/embed/sdBjDSczgKY?si=yZJhA6GB0TvGO_u8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </section>
      <footer className="bg-black text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
          <div className="flex items-center gap-2">
            <img
              src={FooterLogo}
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="font-bold text-lg"></span>
          </div>

          {/* Right: Copyright */}
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Strike Mentor. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
