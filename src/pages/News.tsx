import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Container, 
  Grid, 
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
  CircularProgress
} from '@mui/material';
import { 
  Star,
  StarBorder,
  NotificationsNone,
  OpenInNew,
  Close,
  Search
} from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import { useTopHeadlines, useNewsByCategory, useNewsCategories, useAddToNewsWishlist, useRemoveFromNewsWishlist } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';

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

const News = () => {
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const { user } = useAuth();

  // API calls
  const { data: headlines, isLoading: headlinesLoading, error: headlinesError } = useTopHeadlines();
  const { data: categoryNews, isLoading: categoryLoading, error: categoryError } = useNewsByCategory(selectedCategory);
  const { data: categories, isLoading: categoriesLoading } = useNewsCategories();

  // Wishlist mutations
  const addToWishlist = useAddToNewsWishlist();
  const removeFromWishlist = useRemoveFromNewsWishlist();

  // Use category news if category is selected, otherwise use headlines
  const newsData = selectedCategory === 'general' ? headlines : categoryNews;
  const isLoading = selectedCategory === 'general' ? headlinesLoading : categoryLoading;
  const error = selectedCategory === 'general' ? headlinesError : categoryError;

  // Filter news by search
  const filteredNews = newsData?.filter(news => {
    const matchesSearch =
      news.headline.toLowerCase().includes(search.toLowerCase()) ||
      news.summary.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  }) || [];

  const handleAddToWishlist = async (newsItem: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.username) return;

    try {
      await addToWishlist.mutateAsync({ newsItem });
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const handleRemoveFromWishlist = async (newsItem: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.username) return;

    try {
      await removeFromWishlist.mutateAsync({ newsItem });
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Container maxWidth="md" sx={{ py: 4 }}>
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
          News & Insights
          </Typography>

        {/* Category Buttons & Search */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={selectedCategory === 'general' ? 'contained' : 'outlined'}
              color={selectedCategory === 'general' ? 'primary' : 'inherit'}
              onClick={() => setSelectedCategory('general')}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              All News
            </Button>
            {categories?.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'contained' : 'outlined'}
                color={selectedCategory === cat ? 'primary' : 'inherit'}
                onClick={() => setSelectedCategory(cat)}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
        </Box>
          <Box sx={{ flex: 1, minWidth: 200, display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ position: 'relative', width: { xs: '100%', sm: 260 } }}>
              <TextField
                size="small"
                placeholder="Search news..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'grey.500', mr: 1 }} />,
                  sx: { borderRadius: 2, bgcolor: 'background.paper' }
                }}
                fullWidth
              />
            </Box>
          </Box>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* News Grid */}
        {!isLoading && (
        <Grid container spacing={3}>
          {filteredNews.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 6 }}>
                  {search ? 'No news found for your search.' : 'No news available for this category.'}
              </Typography>
            </Grid>
          ) : (
            filteredNews.map(news => (
                <Grid item xs={12} sm={6} key={news.newsId}>
                  <Card sx={{ 
                    bgcolor: 'background.paper', 
                    borderRadius: 3, 
                    boxShadow: 4, 
                    cursor: 'pointer', 
                    transition: '0.2s', 
                    '&:hover': { boxShadow: 8 } 
                  }} 
                  onClick={() => setSelected(news)}
                  >
                    <Box sx={{ 
                      height: 180, 
                      background: news.image ? `url(${news.image}) center/cover` : 'linear-gradient(45deg, #667eea, #764ba2)',
                      borderTopLeftRadius: 12, 
                      borderTopRightRadius: 12 
                    }} />
                  <CardContent>
                      <Chip 
                        label={news.category?.replace(/\b\w/g, l => l.toUpperCase()) || 'General'} 
                        size="small" 
                        sx={{ mb: 1, bgcolor: 'grey.900', color: 'grey.100', fontWeight: 600 }} 
                      />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, minHeight: 48 }}>
                      {news.headline}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                        {news.summary && news.summary.length > 80 ? news.summary.slice(0, 80) + '...' : news.summary || 'No summary available'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {news.source} &bull; {timeAgo(news.datetime)}
                      </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => handleAddToWishlist(news.newsId, e)}
                            disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                            sx={{ color: 'grey.400' }}
                          >
                            <StarBorder />
                          </IconButton>
                      <Button size="small" variant="text" sx={{ fontWeight: 600 }} onClick={e => { e.stopPropagation(); setSelected(news); }}>
                        Read More
                </Button>
                        </Box>
            </Box>
          </CardContent>
        </Card>
                </Grid>
            ))
          )}
        </Grid>
        )}

        {/* News Detail Modal */}
        <Dialog 
          open={!!selected} 
          onClose={() => setSelected(null)} 
          maxWidth="md" 
          fullWidth 
          PaperProps={{ sx: { borderRadius: 4, bgcolor: 'background.paper', boxShadow: 8 } }}
        >
          {selected && (
            <>
              <Box sx={{ position: 'relative' }}>
                <img 
                  src={selected.image || '/placeholder.svg'} 
                  alt={selected.headline} 
                  style={{ 
                    width: '100%', 
                    height: 260, 
                    objectFit: 'cover', 
                    borderTopLeftRadius: 16, 
                    borderTopRightRadius: 16 
                  }} 
                />
                <IconButton 
                  onClick={() => setSelected(null)} 
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    bgcolor: 'background.default', 
                    color: 'grey.300', 
                    '&:hover': { bgcolor: 'grey.900', color: 'white' } 
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
              <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Chip 
                    label={selected.category?.replace(/\b\w/g, l => l.toUpperCase()) || 'General'} 
                    size="small" 
                    sx={{ bgcolor: 'grey.900', color: 'grey.100', fontWeight: 600 }} 
                  />
                  <Box>
                    <Tooltip title="Add to favorites">
                      <IconButton 
                        onClick={(e) => handleAddToWishlist(selected.newsId, e)}
                        disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                        sx={{ color: 'grey.400' }}
                      >
                        <StarBorder />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {selected.headline}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {selected.summary || 'No summary available'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Source: {selected.source} &bull; {timeAgo(selected.datetime)}
                  </Typography>
                  {selected.url && (
                <Button
                  variant="outlined"
                      startIcon={<OpenInNew />}
                      onClick={() => window.open(selected.url, '_blank')}
                      size="small"
                    >
                      Read Full Article
                </Button>
                  )}
                </Box>
                {selected.related && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Related: {selected.related}
                  </Typography>
            </Box>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default News;
