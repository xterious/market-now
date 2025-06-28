import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Box, 
  Fab,
  IconButton,
  Paper
} from '@mui/material';
import { 
  Message, 
  Close, 
  Send 
} from '@mui/icons-material';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! How can I help you with your financial needs today?' }
  ]);

  // Simulate AI summarization
  const aiSummarize = (text: string) => {
    // In real app, call backend AI API here
    return 'AI Summary: ' + (text.length > 120 ? text.slice(0, 120) + '...' : text);
  };

  // Allow external trigger for AI summarizer
  (window as any).marketNowChatbotSummarize = (news: { headline: string, summary: string }) => {
    setIsOpen(true);
    setMessages(prev => [
      ...prev,
      { type: 'user', text: `Summarize this news: ${news.headline}\n${news.summary}` },
      { type: 'bot', text: aiSummarize(news.summary) }
    ]);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { type: 'user', text: message }]);
      setMessage('');
      // Simulate bot response
      setTimeout(() => {
        // If user asks for summary
        if (/summari[sz]e/i.test(message)) {
          setMessages(prev => [
            ...prev,
            { type: 'bot', text: aiSummarize(message) }
          ]);
        } else {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: 'Thank you for your question! I\'m here to help with stock market, news, and currency exchange information.'
          }]);
        }
      }, 1000);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card 
          sx={{ 
            position: 'fixed', 
            bottom: 80, 
            right: 16, 
            width: 320, 
            height: 384, 
            zIndex: 1000,
            boxShadow: 3
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider' 
          }}>
            <Typography variant="h6" component="h3">
              MarketNow Assistant
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
            >
              <Close />
            </IconButton>
          </Box>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)', p: 2 }}>
            <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '80%',
                    alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    bgcolor: msg.type === 'user' ? 'primary.main' : 'grey.100',
                    color: msg.type === 'user' ? 'white' : 'text.primary',
                    fontSize: '0.875rem'
                  }}
                >
                  {msg.text}
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                size="small"
                fullWidth
                sx={{ fontSize: '0.875rem' }}
              />
              <IconButton 
                size="small" 
                onClick={handleSendMessage}
                color="primary"
              >
                <Send />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Chat Icon */}
      <Fab
        color="primary"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16, 
          zIndex: 999,
          boxShadow: 3
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Message />
      </Fab>
    </>
  );
};

export default Chatbot;
