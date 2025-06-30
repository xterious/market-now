import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Person,
  Security,
  Settings,
  TrendingUp,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAllUsers,
  useNormalUsers,
  useSpecialUsers,
  useUsersByRole,
  useAllRoles,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useCreateRole,
  useDeleteRole,
  useAssignRoleToUser,
  useSetUserRole,
  useAssignRolesBulk,
  useUpdateLiborRates,
  useDeleteLiborRate,
  useLiborSpreadNormal,
  useLiborSpreadSpecial,
  useSetLiborSpreadNormal,
  useSetLiborSpreadSpecial,
} from "@/hooks/useApi";
import { User, Role, LiborRate } from "@/config/types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Admin = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedRole, setSelectedRole] = useState("ROLE_NORMAL");
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openLiborDialog, setOpenLiborDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingLibor, setEditingLibor] = useState<LiborRate | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
  });

  const [liborForm, setLiborForm] = useState({
    rate: 0,
    type: "",
    description: "",
  });

  // API hooks
  const { data: allUsers, isLoading: usersLoading } = useAllUsers();
  const { data: normalUsers } = useNormalUsers();
  const { data: specialUsers } = useSpecialUsers();
  const { data: usersByRole } = useUsersByRole(selectedRole);
  const { data: allRoles, isLoading: rolesLoading } = useAllRoles();
  const { data: liborRates, isLoading: liborLoading } = useLiborRates();
  const { data: normalSpread } = useLiborSpreadNormal();
  const { data: specialSpread } = useLiborSpreadSpecial();

  // Mutations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const createRole = useCreateRole();
  const deleteRole = useDeleteRole();
  const assignRoleToUser = useAssignRoleToUser();
  const setUserRole = useSetUserRole();
  const assignRolesBulk = useAssignRolesBulk();
  const updateLiborRates = useUpdateLiborRates();
  const deleteLiborRate = useDeleteLiborRate();
  const setLiborSpreadNormal = useSetLiborSpreadNormal();
  const setLiborSpreadSpecial = useSetLiborSpreadSpecial();

  // Check if user has admin role
  const isAdmin = user?.roles?.some((role) => role.name === "ROLE_ADMIN");

  if (!isAdmin) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">
            Access denied. You need ROLE_ADMIN to access this page.
          </Alert>
        </Container>
      </Box>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateUser = async () => {
    try {
      await createUser.mutateAsync(userForm);
      setOpenUserDialog(false);
      setUserForm({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      });
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await updateUser.mutateAsync({
        id: editingUser.id,
        userData: userForm,
      });
      setOpenUserDialog(false);
      setEditingUser(null);
      setUserForm({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      });
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser.mutateAsync(userId);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleCreateRole = async () => {
    try {
      await createRole.mutateAsync(roleForm);
      setOpenRoleDialog(false);
      setRoleForm({ name: "", description: "" });
    } catch (error) {
      console.error("Failed to create role:", error);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRole.mutateAsync(roleId);
      } catch (error) {
        console.error("Failed to delete role:", error);
      }
    }
  };

  const handleAssignRole = async (userId: string, roleName: string) => {
    try {
      await assignRoleToUser.mutateAsync({ userId, roleName });
    } catch (error) {
      console.error("Failed to assign role:", error);
    }
  };

  const handleSetUserRole = async (userId: string, role: string) => {
    try {
      await setUserRole.mutateAsync({ userId, role });
    } catch (error) {
      console.error("Failed to set user role:", error);
    }
  };

  const handleUpdateLiborRates = async () => {
    try {
      await updateLiborRates.mutateAsync(liborForm);
      setOpenLiborDialog(false);
      setLiborForm({ rate: 0, type: "", description: "" });
    } catch (error) {
      console.error("Failed to update LIBOR rates:", error);
    }
  };

  const handleDeleteLiborRate = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this LIBOR rate?")) {
      try {
        await deleteLiborRate.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete LIBOR rate:", error);
      }
    }
  };

  const handleSetLiborSpread = async (
    type: "normal" | "special",
    value: number
  ) => {
    try {
      if (type === "normal") {
        await setLiborSpreadNormal.mutateAsync(value);
      } else {
        await setLiborSpreadSpecial.mutateAsync(value);
      }
    } catch (error) {
      console.error("Failed to set LIBOR spread:", error);
    }
  };

  const openEditUserDialog = (user: User) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      password: "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    });
    setOpenUserDialog(true);
  };

  const openEditRoleDialog = (role: Role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
    });
    setOpenRoleDialog(true);
  };

  const openEditLiborDialog = (libor: LiborRate) => {
    setEditingLibor(libor);
    setLiborForm({
      rate: libor.rate,
      type: libor.type,
      description: libor.description || "",
    });
    setOpenLiborDialog(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navigation />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Admin Dashboard
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="User Management" icon={<Person />} />
            <Tab label="Role Management" icon={<Security />} />
            <Tab label="LIBOR Management" icon={<TrendingUp />} />
            <Tab label="System Settings" icon={<Settings />} />
          </Tabs>
        </Box>

        {/* User Management Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5">User Management</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenUserDialog(true)}
                >
                  Add User
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    All Users ({allUsers?.length || 0})
                  </Typography>
                  {usersLoading ? (
                    <CircularProgress />
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Roles</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {allUsers?.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                {user.roles?.map((role) => (
                                  <Chip
                                    key={role.name}
                                    label={role.name}
                                    size="small"
                                    sx={{ mr: 0.5 }}
                                  />
                                ))}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => openEditUserDialog(user)}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteUser(user.id)}
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
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Users by Role
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Role</InputLabel>
                    <Select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <MenuItem value="ROLE_NORMAL">Normal Users</MenuItem>
                      <MenuItem value="ROLE_SPECIAL">Special Users</MenuItem>
                      <MenuItem value="ROLE_ADMIN">Admin Users</MenuItem>
                    </Select>
                  </FormControl>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Username</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {usersByRole?.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                onClick={() =>
                                  handleSetUserRole(
                                    user.id,
                                    selectedRole === "ROLE_NORMAL"
                                      ? "ROLE_SPECIAL"
                                      : "ROLE_NORMAL"
                                  )
                                }
                              >
                                Toggle Role
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Role Management Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5">Role Management</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenRoleDialog(true)}
                >
                  Add Role
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  {rolesLoading ? (
                    <CircularProgress />
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Role Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {allRoles?.map((role) => (
                            <TableRow key={role.name}>
                              <TableCell>{role.name}</TableCell>
                              <TableCell>{role.description}</TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => openEditRoleDialog(role)}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteRole(role.name)}
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* LIBOR Management Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5">LIBOR Rate Management</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenLiborDialog(true)}
                >
                  Add LIBOR Rate
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    LIBOR Rates
                  </Typography>
                  {liborLoading ? (
                    <CircularProgress />
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Rate</TableCell>
                            <TableCell>Effective Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {liborRates?.map((libor) => (
                            <TableRow key={libor.id}>
                              <TableCell>{libor.type}</TableCell>
                              <TableCell>{libor.rate}%</TableCell>
                              <TableCell>{libor.effectiveDate}</TableCell>
                              <TableCell>{libor.description}</TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => openEditLiborDialog(libor)}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleDeleteLiborRate(libor.id)
                                  }
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
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    LIBOR Spreads
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Normal User Spread
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <TextField
                        type="number"
                        value={normalSpread || 0}
                        onChange={(e) =>
                          handleSetLiborSpread(
                            "normal",
                            parseFloat(e.target.value)
                          )
                        }
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <Typography variant="caption">%</Typography>
                          ),
                        }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Special User Spread
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <TextField
                        type="number"
                        value={specialSpread || 0}
                        onChange={(e) =>
                          handleSetLiborSpread(
                            "special",
                            parseFloat(e.target.value)
                          )
                        }
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <Typography variant="caption">%</Typography>
                          ),
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* System Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                System Settings
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Statistics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Total Users"
                        secondary={allUsers?.length || 0}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Normal Users"
                        secondary={normalUsers?.length || 0}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Special Users"
                        secondary={specialUsers?.length || 0}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Total Roles"
                        secondary={allRoles?.length || 0}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    LIBOR Statistics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Total LIBOR Rates"
                        secondary={liborRates?.length || 0}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Normal Spread"
                        secondary={`${normalSpread || 0}%`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Special Spread"
                        secondary={`${specialSpread || 0}%`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>

      {/* User Dialog */}
      <Dialog
        open={openUserDialog}
        onClose={() => setOpenUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={userForm.username}
                onChange={(e) =>
                  setUserForm({ ...userForm, username: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                value={userForm.firstName}
                onChange={(e) =>
                  setUserForm({ ...userForm, firstName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={userForm.lastName}
                onChange={(e) =>
                  setUserForm({ ...userForm, lastName: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button
            onClick={editingUser ? handleUpdateUser : handleCreateUser}
            variant="contained"
            disabled={createUser.isPending || updateUser.isPending}
          >
            {editingUser ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Dialog */}
      <Dialog
        open={openRoleDialog}
        onClose={() => setOpenRoleDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingRole ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role Name"
                value={roleForm.name}
                onChange={(e) =>
                  setRoleForm({ ...roleForm, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={roleForm.description}
                onChange={(e) =>
                  setRoleForm({ ...roleForm, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateRole}
            variant="contained"
            disabled={createRole.isPending}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* LIBOR Dialog */}
      <Dialog
        open={openLiborDialog}
        onClose={() => setOpenLiborDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingLibor ? "Edit LIBOR Rate" : "Add LIBOR Rate"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Type"
                value={liborForm.type}
                onChange={(e) =>
                  setLiborForm({ ...liborForm, type: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rate (%)"
                type="number"
                value={liborForm.rate}
                onChange={(e) =>
                  setLiborForm({
                    ...liborForm,
                    rate: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={liborForm.description}
                onChange={(e) =>
                  setLiborForm({ ...liborForm, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLiborDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateLiborRates}
            variant="contained"
            disabled={updateLiborRates.isPending}
          >
            {editingLibor ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
