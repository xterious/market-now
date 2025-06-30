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
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Message, 
  Close, 
  Send 
} from '@mui/icons-material';
import { useSummarizeNews, useAskQuestion } from '@/hooks/useApi';

interface Message {
  type: 'user' | 'bot';
  text: string;
  isLoading?: boolean;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Hello! I\'m your MarketNow AI assistant. I can help you with:\n\n• Summarizing financial news\n• Answering questions about stocks, currencies, and markets\n• Providing market insights\n\nHow can I help you today?' }
  ]);

  // AI API hooks
  const summarizeNews = useSummarizeNews();
  const askQuestion = useAskQuestion();

  // Suggested questions for quick access
  const suggestedQuestions = [
    "What are the current market trends?",
    "How do I analyze stock performance?",
    "What affects currency exchange rates?",
    "Explain market volatility"
  ];

  // Add a message to the chat
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  // Add a loading message
  const addLoadingMessage = () => {
    addMessage({ type: 'bot', text: '', isLoading: true });
  };

  // Remove the last loading message
  const removeLoadingMessage = () => {
    setMessages(prev => prev.filter(msg => !msg.isLoading));
  };

  // Handle AI summarization
  const handleSummarizeNews = async (text: string) => {
    try {
      addLoadingMessage();
      const summary = await summarizeNews.mutateAsync(text);
      removeLoadingMessage();
      addMessage({ type: 'bot', text: summary });
    } catch (error) {
      removeLoadingMessage();
      addMessage({ 
        type: 'bot', 
        text: 'Sorry, I encountered an error while summarizing the news. Please try again.' 
      });
      console.error('Summarization error:', error);
    }
  };

  // Handle general questions
  const handleAskQuestion = async (question: string) => {
    try {
      addLoadingMessage();
      const answer = await askQuestion.mutateAsync(question);
      removeLoadingMessage();
      addMessage({ type: 'bot', text: answer });
    } catch (error) {
      removeLoadingMessage();
      addMessage({ 
        type: 'bot', 
        text: 'Sorry, I encountered an error while processing your question. Please try again.' 
      });
      console.error('Question error:', error);
    }
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    addMessage({ type: 'user', text: question });
    handleAskQuestion(question);
  };

  // Allow external trigger for AI summarizer
  (window as any).marketNowChatbotSummarize = (news: { headline: string, summary: string }) => {
    setIsOpen(true);
    const newsText = `Headline: ${news.headline}\n\nSummary: ${news.summary}`;
    addMessage({ type: 'user', text: `Please summarize this news article:\n\n${newsText}` });
    handleSummarizeNews(newsText);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = message.trim();
      addMessage({ type: 'user', text: userMessage });
      setMessage('');

      // Determine if it's a summarization request or general question
      const isSummarizeRequest = /summari[sz]e|summarize|brief|summary/i.test(userMessage);
      
      if (isSummarizeRequest) {
        await handleSummarizeNews(userMessage);
      } else {
        await handleAskQuestion(userMessage);
      }
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
            width: 350, 
            height: 450, 
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
            borderColor: 'divider',
            bgcolor: 'primary.main',
            color: 'white'
          }}>
            <Typography variant="h6" component="h3">
              MarketNow AI Assistant
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'white' }}
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
                    maxWidth: '85%',
                    alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    bgcolor: msg.type === 'user' ? 'primary.main' : 'grey.100',
                    color: msg.type === 'user' ? 'white' : 'text.primary',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="caption">AI is thinking...</Typography>
                    </Box>
                  ) : (
                    msg.text
                  )}
                </Box>
              ))}
              
              {/* Show suggested questions if it's the first message */}
              {messages.length === 1 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Try asking:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        size="small"
                        variant="outlined"
                        onClick={() => handleSuggestedQuestion(question)}
                        sx={{ 
                          textTransform: 'none', 
                          fontSize: '0.75rem',
                          justifyContent: 'flex-start',
                          textAlign: 'left'
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Ask me about markets, stocks, or news..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                size="small"
                fullWidth
                disabled={summarizeNews.isPending || askQuestion.isPending}
                sx={{ fontSize: '0.875rem' }}
              />
              <IconButton 
                size="small" 
                onClick={handleSendMessage}
                color="primary"
                disabled={summarizeNews.isPending || askQuestion.isPending || !message.trim()}
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
