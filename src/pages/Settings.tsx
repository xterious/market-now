import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Container, 
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  Button,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  DarkMode,
  LightMode,
  Notifications,
  Security,
  Language,
  Accessibility,
  DataUsage,
  Help,
  Info,
  Save,
  Refresh
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useCustomer } from "@/contexts/CustomerContext";
import CustomerTypeIndicator from "@/components/CustomerTypeIndicator";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { customerType, isSpecialCustomer } = useCustomer();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketAlerts: true,
    newsUpdates: true
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    personalizedAds: false
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleNotificationChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications(prev => ({
      ...prev,
      [key]: event.target.checked
    }));
  };

  const handlePrivacyChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: event.target.checked
    }));
  };

  const handleSaveSettings = () => {
    setSnackbar({
      open: true,
      message: 'Settings saved successfully!',
      severity: 'success'
    });
  };

  const handleResetSettings = () => {
    setNotifications({
      email: true,
      push: false,
      sms: false,
      marketAlerts: true,
      newsUpdates: true
    });
    setPrivacy({
      dataSharing: false,
      analytics: true,
      personalizedAds: false
    });
    setSnackbar({
      open: true,
      message: 'Settings reset to default!',
      severity: 'success'
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Customize your MarketNow experience
              </Typography>
            </Box>
            <CustomerTypeIndicator size="medium" showLabel={true} />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Appearance Settings */}
          <Grid item xs={12} md={6}>
            <Card className="card-elevated">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  {theme === 'dark' ? <DarkMode sx={{ mr: 1, color: 'primary.main' }} /> : <LightMode sx={{ mr: 1, color: 'primary.main' }} />}
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Appearance
                  </Typography>
                </Box>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      {theme === 'dark' ? <DarkMode /> : <LightMode />}
                    </ListItemIcon>
                    <ListItemText 
                      primary="Dark Mode" 
                      secondary="Switch between light and dark themes"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={theme === 'dark'}
                        onChange={toggleTheme}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Current theme: <Chip label={theme === 'dark' ? 'Dark' : 'Light'} size="small" color="primary" />
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Type Info */}
          <Grid item xs={12} md={6}>
            <Card className="card-elevated">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Security sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Account Type
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CustomerTypeIndicator size="large" showLabel={true} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {isSpecialCustomer 
                      ? 'You have access to premium features and special rates.'
                      : 'You have access to standard features and rates.'
                    }
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Contact support to upgrade your account type.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Card className="card-elevated">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Notifications sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Notifications
                  </Typography>
                </Box>
                
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Email Notifications" 
                      secondary="Receive updates via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.email}
                        onChange={handleNotificationChange('email')}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Push Notifications" 
                      secondary="Receive browser notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.push}
                        onChange={handleNotificationChange('push')}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="SMS Notifications" 
                      secondary="Receive text message alerts"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.sms}
                        onChange={handleNotificationChange('sms')}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Market Alerts" 
                      secondary="Get notified about significant market movements"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.marketAlerts}
                        onChange={handleNotificationChange('marketAlerts')}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="News Updates" 
                      secondary="Receive latest financial news"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.newsUpdates}
                        onChange={handleNotificationChange('newsUpdates')}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Privacy Settings */}
          <Grid item xs={12} md={6}>
            <Card className="card-elevated">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Security sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Privacy & Data
                  </Typography>
                </Box>
                
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Data Sharing" 
                      secondary="Allow data to be shared with partners"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={privacy.dataSharing}
                        onChange={handlePrivacyChange('dataSharing')}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Analytics" 
                      secondary="Help improve our service with usage analytics"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={privacy.analytics}
                        onChange={handlePrivacyChange('analytics')}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Personalized Ads" 
                      secondary="Show personalized advertisements"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={privacy.personalizedAds}
                        onChange={handlePrivacyChange('personalizedAds')}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Card className="card-elevated">
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Save />}
                    onClick={handleSaveSettings}
                    size="large"
                  >
                    Save Settings
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Refresh />}
                    onClick={handleResetSettings}
                    size="large"
                  >
                    Reset to Default
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 