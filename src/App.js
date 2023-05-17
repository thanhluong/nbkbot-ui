// import "./App.css";
import * as React from "react";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

const ANSWERING_ENDPOINT = process.env.REACT_APP_API_URL + "answer/";

function App() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "Xin chào. Hãy đặt một câu hỏi với bot hỗ trợ tuyển sinh NBK!",
    },
  ]);

  //clear chat
  function clearChat() {
    setChatLog([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "Me", message: `${input}` }];
    const messages = input;
    setInput("");
    setChatLog(chatLogNew);
    // const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch(ANSWERING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: messages,
      }),
    });
    const data = await response.json();
    setChatLog([
      ...chatLogNew,
      { user: "gpt", message: `${data.ai_response}` },
    ]);
  }

  return (
    <div className="App bg-gray-800 text-white text-center absolute inset-0 flex">
      <aside className="hidden sidemenu w-48 p-4 bg-gray-900 lg:block">
        <Button
          variant="outlined"
          size="large"
          endIcon={<DeleteOutlineIcon />}
          style={{ color: "white" }}
          onClick={clearChat}
        >
          Xóa lịch sử
        </Button>
      </aside>
      <section className="chatbox flex-1 bg-gray-800 relative">
        <div className="chat-log p-6 text-left overflow-y-auto" style={{height: '80%'}}>
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>

        <div className="container-chat-input p-8 absolute bottom-0 right-0 left-0 flex items-center">
          <div className="text-2xl" onClick={clearChat}>
            <FontAwesomeIcon icon={faBroom} />
          </div>

          <div className="chat-input-holder flex-1">
            <form onSubmit={handleSubmit}>
              <input
                rows="1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="chat-input-textarea bg-gray-700 text-white p-6 rounded-lg border-none my-1 outline-none text-lg shadow-md"
                style={{width:'95%'}}
                placeholder="Nhập vướng mắc của bạn"
              >
              </input>

              <button
                type="submit"
                className="absolute right-0 top-0 h-full w-16 text-center text-gray-400 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt bg-white bg-opacity-10"}`}>
      <div className="chat-message-center mx-auto flex p-5 px-5">
        <div className={`avatar bg-opacity-50 rounded-full w-10 h-10 ${message.user === "gpt" && "chatgpt bg-green-600"}`}>
          {message.user === "gpt" ? (
            <img
              className="user_avatar"
              src="https://icons.iconarchive.com/icons/google/noto-emoji-travel-places/128/42496-school-icon.png"
            />
          ) : (
            <img
              className="user_avatar"
              src="https://icons.iconarchive.com/icons/graphicloads/100-flat/128/student-icon.png"
            />
          )}
        </div>
        <div className="message px-2">{message.message}</div>
      </div>
    </div>
  );
};
export default App;
