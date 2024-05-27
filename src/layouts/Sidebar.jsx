import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Collapse, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const Sidebar = () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', mt: '64px', alignItems: 'center', backgroundColor:'whitesmoke' },
            }}
        >
            <List>
                <ListItem button onClick={handleClick}>
                    <ListItemText primary="Transaksi" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button component={Link} to="/">
                            <ListItemText primary="Transaksi Baru" />
                        </ListItem>
                        <ListItem button component={Link} to="/history-transaksi">
                            <ListItemText primary="History Transaksi" />
                        </ListItem>
                    </List>
                </Collapse>
                <ListItem button component={Link} to="/detail">
                    <ListItemText primary="Detail" />
                </ListItem>
                <ListItem button component={Link} to="/data">
                    <ListItemText primary="Data" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;