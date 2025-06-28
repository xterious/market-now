# MarketNow API Implementation

This document outlines the complete implementation of the Axios-based API configuration with token expiration handling, global state management, and React Query integration.

## 🎯 Implementation Overview

### ✅ Completed Features

1. **Axios Configuration with Interceptors**
   - ✅ Automatic token injection in requests
   - ✅ 401 Unauthorized handling with automatic logout
   - ✅ Comprehensive error handling and logging
   - ✅ Environment-based configuration

2. **Global State Management**
   - ✅ Updated AuthContext with JWT token management
   - ✅ Automatic token validation on app startup
   - ✅ Global logout handling via custom events
   - ✅ User session persistence

3. **API Service Layer**
   - ✅ Complete API service functions for all endpoints
   - ✅ TypeScript types based on OpenAPI specification
   - ✅ Modular and reusable API functions

4. **React Query Integration**
   - ✅ Custom hooks for all API endpoints
   - ✅ Automatic caching and refetching
   - ✅ Optimistic updates for mutations
   - ✅ Error handling and loading states

5. **Example Components**
   - ✅ ExampleApiUsage: Direct API calls
   - ✅ ExampleWithHooks: React Query hooks usage
   - ✅ Complete error handling and loading states

## 📁 File Structure

```
src/
├── config/
│   ├── api.ts              # Axios instance with interceptors
│   ├── apiService.ts       # API service functions
│   ├── types.ts            # TypeScript types
│   └── environment.ts      # Environment configuration
├── contexts/
│   └── AuthContext.tsx     # Updated with JWT handling
├── hooks/
│   └── useApi.ts           # React Query custom hooks
├── components/
│   ├── AuthWrapper.tsx     # Router wrapper for AuthContext
│   ├── ExampleApiUsage.tsx # Direct API usage example
│   └── ExampleWithHooks.tsx # React Query hooks example
└── App.tsx                 # Updated with AuthWrapper
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=10000
VITE_API_LOGGING=true
```

### API Base Configuration

The API is configured in `src/config/api.ts` with:

- **Base URL**: Configurable via environment variables
- **Timeout**: 10 seconds default
- **Headers**: Automatic Content-Type and Authorization
- **Interceptors**: Request and response handling

## 🚀 Usage Examples

### 1. Direct API Calls

```typescript
import { stocksAPI, newsAPI } from '@/config/apiService';

// Fetch stock quote
const quote = await stocksAPI.getStockQuote('AAPL');

// Fetch news headlines
const headlines = await newsAPI.getTopHeadlines();
```

### 2. Using React Query Hooks

```typescript
import { useStockQuote, useTopHeadlines } from '@/hooks/useApi';

const MyComponent = () => {
  const stockQuote = useStockQuote('AAPL');
  const headlines = useTopHeadlines();

  if (stockQuote.isLoading) return <div>Loading...</div>;
  if (stockQuote.error) return <div>Error: {stockQuote.error.message}</div>;

  return (
    <div>
      <h2>{stockQuote.data.symbol}: ${stockQuote.data.currentPrice}</h2>
      {/* ... */}
    </div>
  );
};
```

### 3. Authentication

```typescript
import { useAuth } from '@/contexts/AuthContext';

const LoginComponent = () => {
  const { login, isAuthenticated, user } = useAuth();

  const handleLogin = async () => {
    const success = await login('username', 'password');
    if (success) {
      // User is automatically redirected to home page
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.firstName}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

## 🔐 Authentication Flow

### Token Management

1. **Login**: Token is stored in localStorage as `accessToken`
2. **Requests**: Token is automatically added to Authorization header
3. **Expiration**: 401 responses trigger automatic logout and redirect
4. **Persistence**: Token is validated on app startup

### Automatic Logout

When a 401 response is received:

1. Token is removed from localStorage
2. User data is cleared
3. Custom `auth:logout` event is dispatched
4. User is redirected to `/login`

## 📊 API Endpoints Covered

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/user/me` - Get current user
- `GET /api/user` - Get all users
- `GET /api/user/{id}` - Get user by ID
- `PUT /api/user/{id}` - Update user
- `DELETE /api/user/{id}` - Delete user

### Stocks
- `GET /api/stocks/symbols` - Get stock symbols
- `GET /api/stocks/quote` - Get stock quote

### News
- `GET /api/news/headlines` - Get top headlines
- `GET /api/news/category` - Get news by category
- `GET /api/news/categories` - Get all categories

### Currency
- `GET /api/currency/exchange` - Get exchange rate
- `GET /api/currency/convert` - Convert currency

### Wishlist
- `GET /api/wishlist/stock/{username}` - Get stock wishlist
- `POST /api/wishlist/stock/{username}/{symbol}` - Add to stock wishlist
- `DELETE /api/wishlist/stock/{username}/{symbol}` - Remove from stock wishlist
- Similar endpoints for news and currency wishlists

### AI
- `POST /api/ai/summarize` - Summarize news
- `POST /api/ai/ask` - Ask question

### Admin
- All admin endpoints for user management
- LIBOR spread management

## 🎨 React Query Features

### Automatic Caching
- Stock quotes: 30 seconds with auto-refresh
- News: 10 minutes
- Currency rates: 5 minutes
- User data: 5 minutes

### Optimistic Updates
- Wishlist operations update immediately
- Cache invalidation on mutations
- Background refetching

### Error Handling
- Automatic retry on network errors
- Graceful error states
- Loading indicators

## 🔧 Development Features

### Logging
- Request/response logging in development
- Error logging with context
- Environment-based logging control

### Error Handling
- HTTP status code handling
- Network error handling
- User-friendly error messages

### Type Safety
- Full TypeScript support
- API response type definitions
- Request parameter validation

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install axios @tanstack/react-query
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API configuration
   ```

3. **Import and Use**
   ```typescript
   // For direct API calls
   import { stocksAPI } from '@/config/apiService';
   
   // For React Query hooks
   import { useStockQuote } from '@/hooks/useApi';
   ```

## 🔄 Migration Guide

### From Mock Data
1. Replace mock API calls with real API service calls
2. Update components to use React Query hooks
3. Implement proper error handling
4. Add loading states

### From Different API Client
1. Update import statements to use new API service
2. Replace API client calls with service functions
3. Update error handling to match new structure
4. Test authentication flow

## 🧪 Testing

### Unit Tests
- API service functions
- Custom hooks
- Context providers

### Integration Tests
- Authentication flow
- API error handling
- Token expiration scenarios

### Manual Testing
- Login/logout flow
- API calls with valid/invalid tokens
- Network error scenarios
- Token refresh scenarios

## 📝 Best Practices

1. **Always use React Query hooks** for data fetching
2. **Handle loading and error states** in components
3. **Use TypeScript** for type safety
4. **Implement proper error boundaries**
5. **Test authentication flows** thoroughly
6. **Monitor API performance** and caching

## 🔮 Future Enhancements

### Planned Features
- [ ] Token refresh mechanism
- [ ] Offline support with React Query
- [ ] API rate limiting
- [ ] Request/response compression
- [ ] Advanced caching strategies

### Potential Improvements
- [ ] WebSocket support for real-time data
- [ ] Service worker for offline functionality
- [ ] Advanced error reporting
- [ ] Performance monitoring

## 🐛 Troubleshooting

### Common Issues

1. **401 Errors Not Handling**
   - Check if AuthContext is properly wrapped
   - Verify token is being sent in requests
   - Check browser console for errors

2. **API Calls Not Working**
   - Verify API base URL in environment
   - Check network connectivity
   - Verify CORS configuration on backend

3. **React Query Not Caching**
   - Check query keys are consistent
   - Verify staleTime configuration
   - Check if queries are enabled

### Debug Mode

Enable debug logging by setting:
```env
VITE_API_LOGGING=true
```

This will log all API requests and responses to the console.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the example components
3. Check browser console for errors
4. Verify API endpoint availability

---

**Implementation Status**: ✅ Complete
**Last Updated**: December 2024
**Version**: 1.0.0 