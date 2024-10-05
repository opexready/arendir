import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import { Home, AccountCircle, ExitToApp } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = () => {
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <List>
                <ListItem button component={Link} to="/">
                    <Home />
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/profile">
                    <AccountCircle />
                    <ListItemText primary="Profile" />
                </ListItem>
                <Divider />
                <ListItem button component={Link} to="/login">
                    <ExitToApp />
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
