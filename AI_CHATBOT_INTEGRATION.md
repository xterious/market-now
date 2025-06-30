# AI Chatbot Integration

## Overview

The MarketNow AI chatbot has been successfully integrated with the backend AI endpoints to provide intelligent assistance for financial queries and news summarization.

## Features

### 🤖 **AI-Powered Responses**
- **News Summarization**: Automatically summarizes financial news articles
- **Market Questions**: Answers questions about stocks, currencies, and market trends
- **Real-time Processing**: Uses backend AI endpoints for intelligent responses

### 🎯 **User Experience**
- **Floating Chat Interface**: Always accessible via the chat icon in the bottom-right corner
- **Suggested Questions**: Quick access to common financial queries
- **Loading States**: Visual feedback during AI processing
- **Error Handling**: Graceful error messages if AI services are unavailable

### 📰 **News Integration**
- **Summarize Button**: Added to news cards and modal with AI robot icon
- **One-Click Summarization**: Instantly opens chatbot with news summary request
- **Context-Aware**: Sends both headline and summary to AI for better results

## Technical Implementation

### Backend API Endpoints
```typescript
// AI API endpoints in apiService.ts
export const aiAPI = {
  summarizeNews: async (text: string): Promise<string> => {
    const response = await api.post<string>('/api/ai/summarize', text);
    return response.data;
  },

  askQuestion: async (question: string): Promise<string> => {
    const response = await api.post<string>('/api/ai/ask', question);
    return response.data;
  },
};
```

### React Query Hooks
```typescript
// AI hooks in useApi.ts
export const useSummarizeNews = () => {
  return useMutation({
    mutationFn: (text: string) => aiAPI.summarizeNews(text),
  });
};

export const useAskQuestion = () => {
  return useMutation({
    mutationFn: (question: string) => aiAPI.askQuestion(question),
  });
};
```

### Chatbot Component Features
- **Message Management**: Handles user and bot messages with loading states
- **Smart Routing**: Automatically detects summarization vs. general questions
- **External Integration**: Global function for news summarization from other components
- **Responsive Design**: Works on all screen sizes

## Usage

### For Users
1. **Open Chatbot**: Click the chat icon in the bottom-right corner
2. **Ask Questions**: Type financial questions or use suggested prompts
3. **Summarize News**: Click the AI robot icon on any news article
4. **Get AI Responses**: Receive intelligent, contextual answers

### For Developers
1. **News Summarization**: Use the global function:
   ```javascript
   window.marketNowChatbotSummarize({
     headline: "News Headline",
     summary: "News Summary"
   });
   ```

2. **Custom Integration**: The chatbot is available globally via the Chatbot component

## API Integration

### Request Format
- **Summarization**: Sends text content to `/api/ai/summarize`
- **Questions**: Sends question text to `/api/ai/ask`

### Response Handling
- **Success**: Displays AI response in chat
- **Error**: Shows user-friendly error message
- **Loading**: Shows spinner during processing

## Error Handling

The chatbot includes comprehensive error handling:
- **Network Errors**: Graceful fallback messages
- **API Errors**: User-friendly error notifications
- **Loading States**: Prevents multiple simultaneous requests
- **Input Validation**: Ensures valid requests before sending

## Future Enhancements

Potential improvements for the AI chatbot:
- **Conversation History**: Persist chat history across sessions
- **Voice Input**: Speech-to-text capabilities
- **Market Alerts**: AI-powered market notifications
- **Personalization**: User-specific financial insights
- **Multi-language Support**: International language support

## Testing

To test the AI integration:
1. Start the development server: `npm run dev`
2. Navigate to the News page
3. Click the AI robot icon on any news article
4. Verify the chatbot opens with summarization request
5. Test general questions in the chatbot interface

The AI chatbot is now fully integrated and ready to provide intelligent financial assistance to users! 