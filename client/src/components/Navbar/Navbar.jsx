import React from "react";
import { Link } from "react-router-dom";
import { Drawer, List, ListItem, Divider, Typography } from '@mui/material'
import { AccessAlarm, Home } from '@mui/icons-material';

function Navbar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: '20%',
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: '20%', boxSizing: 'border-box', backgroundColor: '#1E2C80' },
            }}
        >
            <h1 style={{ color: "white", alignSelf: 'center' }}>WS App</h1>
            <Divider />
            <List>
                <ListItem style={{ display: 'flex', justifyContent: 'none', alignItems: 'center' }}>
                    <Home style={{ marginRight: '16px' }} sx={{ color: "white" }} />
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Typography color="white">Home</Typography>
                    </Link>
                </ListItem>
                <ListItem style={{ display: 'flex', justifyContent: 'none', alignItems: 'center' }}>
                    <AccessAlarm style={{ marginRight: '16px' }} sx={{ color: "white" }} />
                    <Link to="/stockPrice" style={{ textDecoration: 'none' }}>
                        <Typography color="white">Ação monitorada</Typography>
                    </Link>
                </ListItem>
            </List>
        </Drawer >
    );
}

export default Navbar;