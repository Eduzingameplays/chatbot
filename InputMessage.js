// frontend/src/components/InputMessage.js
import React, { useState } from 'react';

function InputMessage({ sendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default InputMessage;