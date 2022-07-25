import React, { useState, useEffect } from "react";
import { Button, Box, Container, Input, List, ListItem, Typography, FormLabel, Divider, Paper } from "@mui/material";
const URL = 'ws://127.0.0.1:8080';

const Home = () => {
    const [user, setUser] = useState('');
    const [message, setMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    const submitMessage = (usr, msg) => {
        const message = { user: usr, message: msg };
        ws.send(JSON.stringify(message));
        setMessages([message, ...messages]);
    }

    const date = new Date();

    useEffect(() => {
        const wsClient = new WebSocket(URL);
        wsClient.onopen = () => {
            console.log('ws opened');
            setWs(wsClient);
        };
        wsClient.onclose = () => console.log('ws closed');

        return () => {
            wsClient.close();
        }
    }, []);

    useEffect(() => {
        if (!ws) return;

        ws.onmessage = e => {
            const message = JSON.parse(e.data);
            setMessages([message, ...messages]);
        };
    }, [messages, ws]);

    return (
        <Container maxWidth="300">
            <Box>
                <h1>Chat Example</h1>
                <FormLabel htmlFor="user">
                    <Input
                        disableUnderline="true"
                        type="text"
                        id="user"
                        placeholder="Insira seu nome"
                        value={user}
                        onChange={e => setUser(e.target.value)}
                    />
                </FormLabel>
            </Box>
            <Divider />
            <Box sx={{
                overflow: "auto",
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                    width: '0.4em',
                },
                '&::-webkit-scrollbar-track': {
                    background: "#f1f1f1",
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555'
                },
                maxHeight: 640,
                minHeight: 640

            }} style={{ display: 'flex', marginBottom: 16 }}>
                <List style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {messages.reverse().map((message, index) =>
                        <ListItem key={index} style={{ flexDirection: message.user === user ? "row" : "row-reverse" }}>
                            <Paper style={{ backgroundColor: message.user === user ? 'whiteSmoke' : '#e0ffff', padding: 8, display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                <Box style={{ display: 'flex', flexDirection: 'column', marginRight: 16 }}>
                                    <Typography style={{ fontSize: 12 }}>{message.user}</Typography>
                                    <Typography variant="h5">{message.message}</Typography>
                                </Box>
                                <Typography style={{ fontSize: 12 }}>{date.getHours()}:{date.getMinutes()}</Typography>
                            </Paper>

                        </ListItem>
                    )}
                </List>
            </Box>
            <Box style={{
                width: "100%",
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <form style={{ width: "100%", display: 'flex', justifyContent: 'space-between', backgroundColor: "#f1f1f1", padding: 16, borderRadius: 8 }}
                    action=""
                    onSubmit={e => {
                        e.preventDefault();
                        submitMessage(user, message);
                        setMessage([]);
                    }}
                >
                    <Input
                        type="text"
                        fullWidth="true"
                        disableUnderline="true"
                        placeholder={'escreva uma mensagem ...'}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                    <Button style={{}} type="submit" disableUnderline="true">Enviar</Button>
                </form>
            </Box>
        </Container>
    )
}

export default Home;