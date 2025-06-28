import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Box, 
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Close, 
  Star 
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface StockChartProps {
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  // Mock chart data - in a real app, this would come from an API
  const mockPrice = 175.43;
  const mockChange = 2.34;
  const mockChangePercent = 1.35;
  
  const chartData = [
    { time: '9:30', price: mockPrice - 10 },
    { time: '10:00', price: mockPrice - 8 },
    { time: '10:30', price: mockPrice - 5 },
    { time: '11:00', price: mockPrice - 3 },
    { time: '11:30', price: mockPrice - 1 },
    { time: '12:00', price: mockPrice + 1 },
    { time: '12:30', price: mockPrice + 2 },
    { time: '1:00', price: mockPrice },
  ];

  const chartColor = mockChange >= 0 ? "#10B981" : "#EF4444";

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      {/* Price Info */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">
            Current Price
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            ${mockPrice}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">
            Change
          </Typography>
          <Chip
            icon={mockChange >= 0 ? <TrendingUp /> : <TrendingDown />}
            label={`${mockChangePercent > 0 ? '+' : ''}${mockChangePercent}%`}
            color={mockChange >= 0 ? "success" : "error"}
            size="small"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">
            Volume
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'semibold' }}>
            52.4M
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">
            Market Cap
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'semibold' }}>
            2.8T
          </Typography>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          Today's Performance
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                dot={{ fill: chartColor, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" startIcon={<Star />}>
          Add to Watchlist
        </Button>
        <Button variant="outlined">
          View Details
        </Button>
      </Box>
    </Box>
  );
};

export default StockChart;
