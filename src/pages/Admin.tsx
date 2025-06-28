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
  FormControlLabel,
  CircularProgress
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
import { 
  useAllUsers, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser,
  useLiborSpreadNormal,
  useLiborSpreadSpecial,
  useSetLiborSpreadNormal,
  useSetLiborSpreadSpecial
} from '@/hooks/useApi';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Array<{ id: string; name: string; description: string }>;
}

interface LiborRate {
  specialCustomer: number;
  normalCustomer: number;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userDialog, setUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const { logout } = useAdminAuth();
  const { customerType, setCustomerType, isSpecialCustomer } = useCustomer();

  // API calls
  const { data: users, isLoading: usersLoading, error: usersError } = useAllUsers();
  const { data: normalLibor, isLoading: normalLiborLoading } = useLiborSpreadNormal();
  const { data: specialLibor, isLoading: specialLiborLoading } = useLiborSpreadSpecial();

  // Mutations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const setNormalLibor = useSetLiborSpreadNormal();
  const setSpecialLibor = useSetLiborSpreadSpecial();

  const [liborRates, setLiborRates] = useState<LiborRate>({
    specialCustomer: specialLibor || 5.25,
    normalCustomer: normalLibor || 4.75
  });

  // Update libor rates when API data loads
  React.useEffect(() => {
    if (normalLibor !== undefined && specialLibor !== undefined) {
      setLiborRates({
        specialCustomer: specialLibor,
        normalCustomer: normalLibor
      });
    }
  }, [normalLibor, specialLibor]);

  const userStats = [
    { name: "Total Users", value: users?.length?.toString() || "0", change: "+12%", icon: People },
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

  const handleLiborRateChange = async (type: keyof LiborRate, value: number) => {
    setLiborRates(prev => ({ ...prev, [type]: value }));
    
    try {
      if (type === 'specialCustomer') {
        await setSpecialLibor.mutateAsync(value);
      } else {
        await setNormalLibor.mutateAsync(value);
      }
      
    setSnackbar({
      open: true,
      message: 'LIBOR rates updated successfully!',
      severity: 'success'
    });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update LIBOR rates',
        severity: 'error'
      });
    }
  };

  const openUserDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: ''
      });
    } else {
      setEditingUser(null);
      setUserForm({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: ''
      });
    }
    setUserDialog(true);
  };

  const handleSaveUser = async () => {
    try {
    if (editingUser) {
      // Update existing user
        await updateUser.mutateAsync({
          id: editingUser.id,
          userData: {
            username: userForm.username,
            email: userForm.email,
            firstName: userForm.firstName,
            lastName: userForm.lastName
          }
        });
      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success'
      });
    } else {
      // Add new user
        await createUser.mutateAsync({
          username: userForm.username,
          email: userForm.email,
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          password: userForm.password
        });
      setSnackbar({
        open: true,
        message: 'User added successfully!',
        severity: 'success'
      });
    }
    setUserDialog(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save user',
        severity: 'error'
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser.mutateAsync(userId);
    setSnackbar({
      open: true,
      message: 'User deleted successfully!',
      severity: 'success'
    });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete user',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (usersError) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load admin data. Please try again later.
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users, settings, and system configuration
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CustomerTypeIndicator />
            <Button
              variant="outlined"
              startIcon={<Logout />}
              onClick={logout}
              color="error"
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {userStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.name}>
                <Card className="card-elevated">
              <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {stat.value}
                        </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {stat.name}
                    </Typography>
                        <Chip
                          label={stat.change}
                          color="success"
                          size="small"
                          icon={<TrendingUpIcon />}
                        />
                      </Box>
                      <Box sx={{ 
                        bgcolor: 'primary.main', 
                        borderRadius: '50%', 
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <stat.icon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="User Management" />
            <Tab label="LIBOR Rates" />
            <Tab label="System Logs" />
            <Tab label="Settings" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                User Management
              </Typography>
          <Button 
            variant="contained" 
            startIcon={<PersonAdd />}
            onClick={() => openUserDialog()}
          >
            Add User
          </Button>
        </Box>
        
            {usersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                      <TableCell>Roles</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                    {users?.map((user) => (
                <TableRow key={user.id}>
                        <TableCell sx={{ fontWeight: 'bold' }}>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>
                          {user.roles.map(role => (
                            <Chip key={role.id} label={role.name} size="small" sx={{ mr: 0.5 }} />
                          ))}
                  </TableCell>
                  <TableCell>
                      <IconButton 
                        size="small" 
                            onClick={() => openUserDialog(user)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                            onClick={() => handleDeleteUser(user.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              LIBOR Rate Management
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Diamond sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Special Customer Rate
            </Typography>
          </Box>
                    <TextField
                      fullWidth
                      label="LIBOR Rate (%)"
                      type="number"
                      value={liborRates.specialCustomer}
                      onChange={(e) => handleLiborRateChange('specialCustomer', Number(e.target.value))}
                      disabled={specialLiborLoading || setSpecialLibor.isPending}
                      InputProps={{
                        endAdornment: specialLiborLoading || setSpecialLibor.isPending ? <CircularProgress size={20} /> : null
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Normal Customer Rate
                      </Typography>
            </Box>
                    <TextField
                      fullWidth
                      label="LIBOR Rate (%)"
                      type="number"
                      value={liborRates.normalCustomer}
                      onChange={(e) => handleLiborRateChange('normalCustomer', Number(e.target.value))}
                      disabled={normalLiborLoading || setNormalLibor.isPending}
                      InputProps={{
                        endAdornment: normalLiborLoading || setNormalLibor.isPending ? <CircularProgress size={20} /> : null
                      }}
                    />
                  </CardContent>
                </Card>
                </Grid>
              </Grid>
            </Box>
          )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              System Logs
                </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {systemLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.event}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          color={log.status === 'Success' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              System Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Customer Type
                </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isSpecialCustomer}
                          onChange={(e) => setCustomerType(e.target.checked ? 'Special' : 'Normal')}
                        />
                      }
                      label="Special Customer"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Current type: {customerType}
                </Typography>
              </CardContent>
            </Card>
              </Grid>
            </Grid>
          </Box>
          )}

      {/* User Dialog */}
      <Dialog open={userDialog} onClose={() => setUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
                label="Username"
                value={userForm.username}
                onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                fullWidth
              />
              <TextField
                label="First Name"
                value={userForm.firstName}
                onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={userForm.lastName}
                onChange={(e) => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                fullWidth
              />
              {!editingUser && (
                <TextField
                  label="Password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                  fullWidth
                />
              )}
          </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setUserDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveUser} 
              variant="contained"
              disabled={createUser.isPending || updateUser.isPending}
            >
              {createUser.isPending || updateUser.isPending ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
          onClose={handleCloseSnackbar}
      >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Container>
    </Box>
  );
};

export default Admin;
