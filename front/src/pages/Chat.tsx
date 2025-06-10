import chatPage from "../assets/img/chat-page.png";

function Chat() {
  return (
    <>
      <section
        className="relative bg-fixed bg-cover bg-center bg-no-repeat min-h-[90vh] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: `url(${chatPage})`,
          backgroundColor: "#090D13",
          backgroundPosition: "center 80px", // shifted 80px down
        }}
      ></section>

      <div className="text-center text-white py-8 bg-[#090D13]">
        This is how this page will look like
      </div>
    </>
  );
}

export default Chat;
