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
  TextField
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

const categories = [
  { key: 'general', label: 'General' },
  { key: 'forex', label: 'Forex' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'merger', label: 'Merger' },
];

// Mock news data (replace with backend fetch)
const newsList = [
  {
    category: 'crypto',
    datetime: 1596589501,
    headline: 'Square surges after reporting 64% jump in revenue, more customers using Cash App',
    id: 5085164,
    image: 'https://image.cnbcfm.com/api/v1/image/105569283-1542050972462rts25mct.jpg?v=1542051069',
    related: '',
    source: 'CNBC',
    summary: 'Shares of Square soared on Tuesday evening after posting better-than-expected quarterly results and strong growth in its consumer payments app.',
    url: 'https://www.cnbc.com/2020/08/04/square-sq-earnings-q2-2020.html'
  },
  {
    category: 'forex',
    datetime: 1718000000,
    headline: 'Federal Reserve Signals Potential Rate Cut in Q3 2025',
    id: 5085165,
    image: 'https://images.unsplash.com/photo-1517971071642-34a2d3eccb5e',
    related: '',
    source: 'Reuters',
    summary: 'Fed officials hint at monetary policy adjustments amid disruptive economic conditions.',
    url: 'https://www.reuters.com/markets/us/fed-signals-rate-cut-2025.html'
  },
  {
    category: 'merger',
    datetime: 1718001000,
    headline: 'Major Banks Announce Historic Merger',
    id: 5085166,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    related: '',
    source: 'Bloomberg',
    summary: "Two of the world's largest banks have agreed to merge, creating a new financial powerhouse.",
    url: 'https://www.bloomberg.com/merger-news'
  },
  {
    category: 'general',
    datetime: 1718002000,
    headline: 'Global Markets Rally on Economic Recovery Hopes',
    id: 5085167,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    related: '',
    source: 'Financial Times',
    summary: 'Stock markets around the world rallied today as investors grew optimistic about economic recovery.',
    url: 'https://www.ft.com/global-markets'
  }
];

function timeAgo(unix) {
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
  const [selected, setSelected] = useState(null);
  const [favorite, setFavorite] = useState({});
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');

  // Filter news by search and category
  const filteredNews = newsList.filter(news => {
    const matchesCategory = selectedCategory === 'general' ? true : news.category === selectedCategory;
    const matchesSearch =
      news.headline.toLowerCase().includes(search.toLowerCase()) ||
      news.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            {categories.map(cat => (
              <Button
                key={cat.key}
                variant={selectedCategory === cat.key ? 'contained' : 'outlined'}
                color={selectedCategory === cat.key ? 'primary' : 'inherit'}
                onClick={() => setSelectedCategory(cat.key)}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
              >
                {cat.label}
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
        <Grid container spacing={3}>
          {filteredNews.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 6 }}>
                No news found for your search or category.
              </Typography>
            </Grid>
          ) : (
            filteredNews.map(news => (
              <Grid item xs={12} sm={6} key={news.id}>
                <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, boxShadow: 4, cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 8 } }} onClick={() => setSelected(news)}>
                  <Box sx={{ height: 180, background: `url(${news.image}) center/cover`, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
                  <CardContent>
                    <Chip label={news.category.replace(/\b\w/g, l => l.toUpperCase())} size="small" sx={{ mb: 1, bgcolor: 'grey.900', color: 'grey.100', fontWeight: 600 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, minHeight: 48 }}>
                      {news.headline}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {news.summary.length > 80 ? news.summary.slice(0, 80) + '...' : news.summary}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {news.source} &bull; {timeAgo(news.datetime)}
                      </Typography>
                      <Button size="small" variant="text" sx={{ fontWeight: 600 }} onClick={e => { e.stopPropagation(); setSelected(news); }}>
                        Read More
                </Button>
            </Box>
          </CardContent>
        </Card>
                </Grid>
            ))
          )}
        </Grid>

        {/* News Detail Modal */}
        <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: 'background.paper', boxShadow: 8 } }}>
          {selected && (
            <>
              <Box sx={{ position: 'relative' }}>
                <img src={selected.image} alt={selected.headline} style={{ width: '100%', height: 260, objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
                <IconButton onClick={() => setSelected(null)} sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'background.default', color: 'grey.300', '&:hover': { bgcolor: 'grey.900', color: 'white' } }}>
                  <Close />
                </IconButton>
              </Box>
              <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Chip label={selected.category.replace(/\b\w/g, l => l.toUpperCase())} size="small" sx={{ bgcolor: 'grey.900', color: 'grey.100', fontWeight: 600 }} />
                  <Box>
                    <Tooltip title={favorite[selected.id] ? 'Remove from favorites' : 'Add to favorites'}>
                      <IconButton onClick={() => setFavorite(f => ({ ...f, [selected.id]: !f[selected.id] }))} sx={{ color: favorite[selected.id] ? 'yellow.500' : 'grey.400' }}>
                        {favorite[selected.id] ? <Star /> : <StarBorder />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Notify me">
                      <IconButton sx={{ color: 'grey.400' }}>
                        <NotificationsNone />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {selected.headline}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {selected.summary}
                  </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mb: 2 }}
                  onClick={() => {
                    if (window.marketNowChatbotSummarize) {
                      window.marketNowChatbotSummarize({ headline: selected.headline, summary: selected.summary });
                    }
                  }}
                >
                  Ask AI to Summarize
                </Button>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    {selected.source} &bull; {timeAgo(selected.datetime)}
                  </Typography>
                  <Tooltip title="Open original news">
                    <IconButton href={selected.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'grey.400' }}>
                      <OpenInNew />
                    </IconButton>
                  </Tooltip>
            </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default News;
