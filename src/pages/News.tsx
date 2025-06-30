import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Container, 
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Tooltip,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  InputAdornment,
  Skeleton,
  Avatar,
  Badge,
  Fade,
  Slide
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Star,
  StarBorder,
  NotificationsNone,
  OpenInNew,
  Close,
  Search,
  TrendingUp,
  Business,
  CurrencyExchange,
  Public,
  FilterList,
  Refresh,
  Bookmark,
  Share,
  AccessTime,
  Source,
  SmartToy
} from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import { useTopHeadlines, useNewsByCategory, useNewsCategories, useAddToNewsWishlist, useRemoveFromNewsWishlist, useNewsWishlist } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import type { News } from '@/config/types';

function timeAgo(unix: number) {
  const now = Date.now() / 1000;
  const diff = Math.floor((now - unix) / 60);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff} minutes ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

const NewsPage = () => {
  const [selected, setSelected] = useState<News | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const { user } = useAuth();

  // Predefined categories
  const predefinedCategories = [
    { key: 'general', label: 'General', icon: <Public />, color: '#1976d2' },
    { key: 'merger', label: 'Merger & Acquisition', icon: <Business />, color: '#2e7d32' },
    { key: 'currency', label: 'Currency', icon: <CurrencyExchange />, color: '#ed6c02' },
    { key: 'forex', label: 'Forex', icon: <TrendingUp />, color: '#9c27b0' }
  ];

  // API calls
  const { data: headlines, isLoading: headlinesLoading, error: headlinesError } = useTopHeadlines();
  const { data: categoryNews, isLoading: categoryLoading, error: categoryError } = useNewsByCategory(selectedCategory);
  const { data: categories, isLoading: categoriesLoading } = useNewsCategories();

  // Wishlist data and mutations
  const { data: newsWishlist } = useNewsWishlist(user?.username || '');
  const addToWishlist = useAddToNewsWishlist();
  const removeFromWishlist = useRemoveFromNewsWishlist();

  // Use category news if category is selected, otherwise use headlines
  const newsData = selectedCategory === 'general' ? headlines : categoryNews;
  const isLoading = selectedCategory === 'general' ? headlinesLoading : categoryLoading;
  const error = selectedCategory === 'general' ? headlinesError : categoryError;

  // Filter news by search
  const filteredNews = newsData?.filter(news => {
    if (!search.trim()) return true;
    const searchLower = search.toLowerCase();
    return (
      news.headline?.toLowerCase().includes(searchLower) ||
      news.summary?.toLowerCase().includes(searchLower) ||
      news.source?.toLowerCase().includes(searchLower) ||
      news.category?.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Check if a news item is in wishlist
  const isInWishlist = (newsId: string) => {
    return newsWishlist?.favoriteNews?.includes(newsId) || false;
  };

  const handleAddToWishlist = async (newsItem: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.username) return;

    try {
      if (isInWishlist(newsItem)) {
        await removeFromWishlist.mutateAsync({ newsItem });
      } else {
        await addToWishlist.mutateAsync({ newsItem });
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setActiveTab(predefinedCategories.findIndex(cat => cat.key === category));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSelectedCategory(predefinedCategories[newValue].key);
  };

  const getCategoryColor = (category: string) => {
    const cat = predefinedCategories.find(c => c.key === category);
    return cat?.color || '#1976d2';
  };

  const getCategoryIcon = (category: string) => {
    const cat = predefinedCategories.find(c => c.key === category);
    return cat?.icon || <Public />;
  };

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load news. Please try again later.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
            Financial News & Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with the latest market news, mergers, currency updates, and forex insights
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <TextField
                fullWidth
                placeholder="Search news by headline, summary, or source..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'grey.500' }} />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch('')}>
                        <Close />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 3, 
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' },
                    '&.Mui-focused': { bgcolor: 'background.paper' }
                  }
                }}
                size="medium"
              />
            </Box>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowSearch(!showSearch)}
              sx={{ borderRadius: 2 }}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Category Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 56,
                borderRadius: 2,
                mx: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }
              }
            }}
          >
            {predefinedCategories.map((category, index) => (
              <Tab
                key={category.key}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {category.icon}
                    {category.label}
                  </Box>
                }
                sx={{
                  '&.Mui-selected': {
                    bgcolor: category.color,
                    '&:hover': {
                      bgcolor: category.color,
                      opacity: 0.9
                    }
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Results Summary */}
        {!isLoading && (
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'} found
            </Typography>
            {search && (
              <Chip 
                label={`Search: "${search}"`} 
                size="small" 
                onDelete={() => setSearch('')}
                color="primary"
                variant="outlined"
              />
            )}
            <Chip 
              label={predefinedCategories.find(cat => cat.key === selectedCategory)?.label || 'All News'} 
              size="small" 
              color="primary"
              icon={getCategoryIcon(selectedCategory)}
            />
          </Box>
        )}

        {/* Loading State */}
        {isLoading && (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="90%" height={16} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="70%" height={16} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* News Grid */}
        {!isLoading && (
          <Fade in={!isLoading} timeout={500}>
            <Grid container spacing={3}>
              {filteredNews.length === 0 ? (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Search sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {search ? 'No news found for your search.' : 'No news available for this category.'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {search ? 'Try adjusting your search terms or browse different categories.' : 'Check back later for updates.'}
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                filteredNews.map((news, index) => (
                  <Grid item xs={12} sm={6} md={4} key={news.newsId}>
                    <Slide direction="up" in={!isLoading} timeout={300 + index * 100}>
                      <Card sx={{ 
                        height: '100%',
                        minHeight: 420,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.paper', 
                        borderRadius: 3, 
                        boxShadow: 2, 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        '&:hover': { 
                          boxShadow: 8,
                          transform: 'translateY(-4px)'
                        } 
                      }} 
                      onClick={() => setSelected(news)}
                    >
                      {/* Image */}
                      <Box sx={{ 
                        height: 200, 
                        background: news.image ? `url(${news.image}) center/cover` : 
                          `linear-gradient(135deg, ${getCategoryColor(selectedCategory)}20, ${getCategoryColor(selectedCategory)}40)`,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {!news.image && (
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            color: getCategoryColor(selectedCategory) 
                          }}>
                            {getCategoryIcon(selectedCategory)}
                            <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
                              No Image Available
                            </Typography>
                          </Box>
                        )}
                        <Chip 
                          label={news.category?.replace(/\b\w/g, l => l.toUpperCase()) || 'General'} 
                          size="small" 
                          sx={{ 
                            position: 'absolute', 
                            top: 12, 
                            left: 12, 
                            bgcolor: getCategoryColor(selectedCategory), 
                            color: 'white', 
                            fontWeight: 600 
                          }} 
                        />
                      </Box>

                      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          mb: 2, 
                          minHeight: 48,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {news.headline}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          mb: 3, 
                          minHeight: 40,
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {news.summary && news.summary.length > 100 ? news.summary.slice(0, 100) + '...' : news.summary || 'No summary available'}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: getCategoryColor(selectedCategory) }}>
                              {news.source?.charAt(0) || 'N'}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary">
                              {news.source}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime sx={{ fontSize: 14 }} />
                            {timeAgo(news.datetime)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Add to favorites">
                              <IconButton
                                size="small"
                                onClick={(e) => handleAddToWishlist(news.newsId, e)}
                                disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                                sx={{ color: isInWishlist(news.newsId) ? 'error.main' : 'grey.400', '&:hover': { color: 'error.main' } }}
                              >
                                {isInWishlist(news.newsId) ? <Star /> : <StarBorder />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Share">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.share?.({ title: news.headline, url: news.url });
                                }}
                                sx={{ color: 'grey.400' }}
                              >
                                <Share />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Summarize with AI">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  (window as any).marketNowChatbotSummarize?.({
                                    headline: news.headline,
                                    summary: news.summary || ''
                                  });
                                }}
                                sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}
                              >
                                <SmartToy />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            sx={{ 
                              fontWeight: 600,
                              borderRadius: 2,
                              textTransform: 'none'
                            }} 
                            onClick={e => { 
                              e.stopPropagation(); 
                              setSelected(news); 
                            }}
                          >
                            Read More
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>
                ))
              )}
            </Grid>
          </Fade>
        )}
      </Container>

      {/* News Detail Modal */}
      <Dialog 
        open={!!selected} 
        onClose={() => setSelected(null)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            borderRadius: 4, 
            bgcolor: 'background.paper', 
            boxShadow: 24,
            overflow: 'hidden'
          } 
        }}
      >
        {selected && (
          <>
            <Box sx={{ position: 'relative' }}>
              <img 
                src={selected.image || '/placeholder.svg'} 
                alt={selected.headline} 
                style={{ 
                  width: '100%', 
                  height: 300, 
                  objectFit: 'cover'
                }} 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.7) 100%)'
              }} />
              <IconButton 
                onClick={() => setSelected(null)} 
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  right: 16, 
                  bgcolor: 'rgba(0,0,0,0.5)', 
                  color: 'white', 
                  backdropFilter: 'blur(10px)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } 
                }}
              >
                <Close />
              </IconButton>
              <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                <Chip 
                  label={selected.category?.replace(/\b\w/g, l => l.toUpperCase()) || 'General'} 
                  size="small" 
                  sx={{ 
                    bgcolor: getCategoryColor(selectedCategory), 
                    color: 'white', 
                    fontWeight: 600,
                    mb: 1
                  }} 
                />
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  lineHeight: 1.2
                }}>
                  {selected.headline}
                </Typography>
              </Box>
            </Box>
            
            <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: getCategoryColor(selectedCategory) }}>
                    {selected.source?.charAt(0) || 'N'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {selected.source}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: 12 }} />
                      {timeAgo(selected.datetime)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Add to favorites">
                    <IconButton 
                      onClick={(e) => handleAddToWishlist(selected.newsId, e)}
                      disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                      sx={{ color: isInWishlist(selected.newsId) ? 'error.main' : 'grey.400', '&:hover': { color: 'error.main' } }}
                    >
                      {isInWishlist(selected.newsId) ? <Star /> : <StarBorder />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton
                      onClick={(e) => {
                        navigator.share?.({ title: selected.headline, url: selected.url });
                      }}
                      sx={{ color: 'grey.400' }}
                    >
                      <Share />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Summarize with AI">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        (window as any).marketNowChatbotSummarize?.({
                          headline: selected.headline,
                          summary: selected.summary || ''
                        });
                      }}
                      sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}
                    >
                      <SmartToy />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}>
                {selected.summary || 'No summary available'}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Source sx={{ fontSize: 16 }} />
                    Source: {selected.source}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTime sx={{ fontSize: 16 }} />
                    {timeAgo(selected.datetime)}
                  </Typography>
                </Box>
                {selected.url && (
                  <Button
                    variant="contained"
                    startIcon={<OpenInNew />}
                    onClick={() => window.open(selected.url, '_blank')}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Read Full Article
                  </Button>
                )}
              </Box>

              {selected.related && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Related Topics:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selected.related}
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default NewsPage;
