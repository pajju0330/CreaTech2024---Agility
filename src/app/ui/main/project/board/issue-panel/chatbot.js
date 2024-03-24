
import { useFetcher } from '@remix-run/react';
import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineSend } from 'react-icons/ai';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);
  const fetcher = useFetcher();
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };
  const postdata=async()=>{
    const formData = new FormData();
    const action = "createIssueusingAI";
    formData.set("query",message);
    formData.set("_action", action);
    console.log('hello');
    const response =  fetcher.submit(formData, {
      method: "post",
  });
 
  }
  const handleSend = () => {

    if (message.trim() !== '') {
      const newChat = [...chatHistory, { text: message, sender: 'user' }];
     postdata();
      setChatHistory(newChat);
      setMessage('');
      setTimeout(() => {
        const botResponse = { text: getBotResponse(message), sender: 'bot' };
        setChatHistory([...newChat, botResponse]);
        scrollToBottom();
      }, 1000); // Simulate bot response delay
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const getBotResponse = (userMessage) => {
    switch (userMessage.toLowerCase()) {
      case 'hello':
        return 'Hello! How can I assist you today?';
      case 'how are you?':
        return "I'm just a bot, but thank you for asking!";
      case 'bye':
        return 'Goodbye! Have a great day!';
      default:
        return "Here's a shorter summary of the user story flow for creating a gym website: Plan: Define target users, gather content, and outline the website structure.Design & Develop: Create a visually appealing and user-friendly website with features like class schedules and signup forms.Content & Integrate: Write informative content, add high-quality media, and integrate CTAs for memberships.Test & Deploy: Test functionality, fix issues, and launch the website. Maintain & Update: Regularly update content, monitor performance, and ensure security.";
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
      }}
    >
      <div style={{ backgroundColor: '#f0f0f0', marginBottom: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
  <h1 style={{ color: '#579dff', textAlign: 'center', marginBottom: '10px', fontSize: '32px', fontFamily: 'Arial, sans-serif' }}>
    Agility Chatbot
  </h1>
</div>
      <div
        style={{
          flex: '1',
          maxHeight: 'calc(100vh - 200px)', // Adjust as needed
          overflowY: 'auto',
          marginBottom: '20px',
        }}
      >
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              padding: '8px 12px',
              borderRadius: '20px',
              maxWidth: '70%',
              wordWrap: 'break-word',
              alignSelf: chat.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: chat.sender === 'user' ? '#4caf50' : '#e0e0e0',
              color: chat.sender === 'user' ? '#fff' : '#333',
            }}
          >
            {chat.text}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: '#f8f8f8',
          borderRadius: '12px',
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={handleInputChange}
          style={{
            flex: '1',
            padding: '8px',
            border: 'none',
            borderRadius: '20px',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        />
        <button
          onClick={handleSend}
          style={{
            marginLeft: '10px',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '20px',
            backgroundColor: '#2196f3',
            color: '#fff',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s ease',
          }}
        >
          <AiOutlineSend />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
