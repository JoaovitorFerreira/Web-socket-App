import { Box, Container } from "@mui/system";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

const Pages = () => {
    return (<>
        <Container style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box style={{ marginRight: 50 }}><Navbar /></Box>
            <Box style={{ width: '80%' }}><Outlet /></Box>
        </Container>
        <Footer />
    </>
    );
};

export default Pages;