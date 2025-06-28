import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  TextField, 
  Box, 
  Container, 
  Grid,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  People, 
  TrendingUp, 
  AttachMoney, 
  TrendingUp as TrendingUpIcon, 
  Settings, 
  Storage, 
  Security, 
  Notifications,
  BarChart,
  Visibility,
  PersonAdd,
  Edit,
  Delete,
  Logout,
  Save,
  Cancel,
  Diamond,
  Person
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useCustomer } from "@/contexts/CustomerContext";
import CustomerTypeIndicator from "@/components/CustomerTypeIndicator";

interface User {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
  customerType: 'Special' | 'Normal';
  liborRate: number;
}

interface LiborRate {
  specialCustomer: number;
  normalCustomer: number;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", joinDate: "2024-01-15", customerType: "Special", liborRate: 5.25 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active", joinDate: "2024-01-14", customerType: "Normal", liborRate: 4.75 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Inactive", joinDate: "2024-01-13", customerType: "Normal", liborRate: 4.75 },
    { id: 4, name: "Alice Brown", email: "alice@example.com", status: "Active", joinDate: "2024-01-12", customerType: "Special", liborRate: 5.25 },
  ]);
  
  const [liborRates, setLiborRates] = useState<LiborRate>({
    specialCustomer: 5.25,
    normalCustomer: 4.75
  });

  const [userDialog, setUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    status: 'Active' as const,
    customerType: 'Normal' as const
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const { logout } = useAdminAuth();
  const { customerType, setCustomerType, isSpecialCustomer } = useCustomer();

  const userStats = [
    { name: "Total Users", value: users.length.toString(), change: "+12%", icon: People },
    { name: "Active Sessions", value: "1,234", change: "+5%", icon: TrendingUp },
    { name: "Revenue", value: "$45,231", change: "+18%", icon: AttachMoney },
    { name: "Growth Rate", value: "23.5%", change: "+2.1%", icon: TrendingUpIcon },
  ];

  const systemLogs = [
    { id: 1, timestamp: "2024-01-15 14:30", event: "User login", user: "john@example.com", status: "Success" },
    { id: 2, timestamp: "2024-01-15 14:25", event: "Database backup", user: "System", status: "Success" },
    { id: 3, timestamp: "2024-01-15 14:20", event: "API call", user: "jane@example.com", status: "Failed" },
    { id: 4, timestamp: "2024-01-15 14:15", event: "User registration", user: "alice@example.com", status: "Success" },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLiborRateChange = (type: keyof LiborRate, value: number) => {
    setLiborRates(prev => ({ ...prev, [type]: value }));
    
    // Update all users with the corresponding customer type
    setUsers(prev => prev.map(user => 
      user.customerType.toLowerCase() === type.replace('Customer', '').toLowerCase()
        ? { ...user, liborRate: value }
        : user
    ));
  };

  const handleSaveLiborRates = () => {
    setSnackbar({
      open: true,
      message: 'LIBOR rates updated successfully!',
      severity: 'success'
    });
  };

  const openUserDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        status: user.status,
        customerType: user.customerType
      });
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        status: 'Active',
        customerType: 'Normal'
      });
    }
    setUserDialog(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              ...userForm, 
              liborRate: userForm.customerType === 'Special' ? liborRates.specialCustomer : liborRates.normalCustomer
            }
          : user
      ));
      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success'
      });
    } else {
      // Add new user
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...userForm,
        joinDate: new Date().toISOString().split('T')[0],
        liborRate: userForm.customerType === 'Special' ? liborRates.specialCustomer : liborRates.normalCustomer
      };
      setUsers(prev => [...prev, newUser]);
      setSnackbar({
        open: true,
        message: 'User added successfully!',
        severity: 'success'
      });
    }
    setUserDialog(false);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setSnackbar({
      open: true,
      message: 'User deleted successfully!',
      severity: 'success'
    });
  };

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {userStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={stat.name}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {stat.name}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Chip label={stat.change} color="success" size="small" />
                  </Box>
                  <Icon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  const renderLiborRateManagement = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AttachMoney sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            LIBOR Rate Management
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Special Customer LIBOR Rate (%)"
              type="number"
              value={liborRates.specialCustomer}
              onChange={(e) => handleLiborRateChange('specialCustomer', parseFloat(e.target.value) || 0)}
              InputProps={{
                endAdornment: <Typography variant="body2">%</Typography>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Normal Customer LIBOR Rate (%)"
              type="number"
              value={liborRates.normalCustomer}
              onChange={(e) => handleLiborRateChange('normalCustomer', parseFloat(e.target.value) || 0)}
              InputProps={{
                endAdornment: <Typography variant="body2">%</Typography>
              }}
            />
          </Grid>
        </Grid>
        
        <Button 
          variant="contained" 
          startIcon={<Save />}
          onClick={handleSaveLiborRates}
        >
          Save LIBOR Rates
        </Button>
      </CardContent>
    </Card>
  );

  const renderRecentActivity = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUp sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Recent Activity
          </Typography>
        </Box>
        <Box sx={{ space: 2 }}>
          {systemLogs.slice(0, 5).map((log) => (
            <Box 
              key={log.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 2, 
                mb: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {log.event}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {log.user}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Chip 
                  label={log.status} 
                  color={log.status === 'Success' ? 'success' : 'error'}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {log.timestamp}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const renderQuickActions = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BarChart sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Quick Actions
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ height: 80, flexDirection: 'column', gap: 1 }}
            >
              <Storage />
              <Typography variant="body2">Backup</Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ height: 80, flexDirection: 'column', gap: 1 }}
            >
              <Notifications />
              <Typography variant="body2">Alerts</Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ height: 80, flexDirection: 'column', gap: 1 }}
            >
              <Visibility />
              <Typography variant="body2">Monitor</Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ height: 80, flexDirection: 'column', gap: 1 }}
            >
              <Settings />
              <Typography variant="body2">Config</Typography>
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderUserManagement = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <People sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2">
                User Management
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Manage user accounts, customer types, and LIBOR rates
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<PersonAdd />}
            onClick={() => openUserDialog()}
          >
            Add User
          </Button>
        </Box>
        
        <TextField 
          placeholder="Search users..." 
          size="small" 
          sx={{ mb: 3, maxWidth: 300 }}
        />
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Customer Type</TableCell>
                <TableCell>LIBOR Rate</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'error' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.customerType} 
                      color={user.customerType === 'Special' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {user.liborRate}%
                    </Typography>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => openUserDialog(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your MarketNow application
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Normal</Typography>
              <Switch
                checked={isSpecialCustomer}
                onChange={(e) => setCustomerType(e.target.checked ? 'Special' : 'Normal')}
                color="primary"
              />
              <Diamond />
              <Typography variant="body2">Special</Typography>
            </Box>
            <CustomerTypeIndicator size="small" showLabel={false} />
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<Logout />}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Overview" />
            <Tab label="LIBOR Rates" />
            <Tab label="Users" />
            <Tab label="System" />
            <Tab label="Settings" />
          </Tabs>

          {/* Overview Tab */}
          {activeTab === 0 && (
            <Box>
              {renderStatsCards()}
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  {renderRecentActivity()}
                </Grid>
                <Grid item xs={12} lg={6}>
                  {renderQuickActions()}
                </Grid>
              </Grid>
            </Box>
          )}

          {/* LIBOR Rates Tab */}
          {activeTab === 1 && renderLiborRateManagement()}

          {/* Users Tab */}
          {activeTab === 2 && renderUserManagement()}

          {/* System Tab */}
          {activeTab === 3 && (
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  System Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  System monitoring and maintenance features will be implemented here.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === 4 && (
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  Application Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configuration and settings management will be implemented here.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>

      {/* User Dialog */}
      <Dialog open={userDialog} onClose={() => setUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={userForm.name}
              onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={userForm.status}
                label="Status"
                onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value as any }))}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Customer Type</InputLabel>
              <Select
                value={userForm.customerType}
                label="Customer Type"
                onChange={(e) => setUserForm(prev => ({ ...prev, customerType: e.target.value as any }))}
              >
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="Special">Special</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleSaveUser} variant="contained" startIcon={<Save />}>
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Admin;
