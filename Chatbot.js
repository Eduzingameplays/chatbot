// frontend/src/components/Chatbot.js
import React from 'react';

function Chatbot({ messages }) {
  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index}>
          <p>{msg.from}: {msg.message}</p>
        </div>
      ))}
    </div>
  );
}

export default Chatbot;
