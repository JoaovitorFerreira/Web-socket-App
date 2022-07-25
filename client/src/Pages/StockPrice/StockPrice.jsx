import React, { useState, useEffect } from "react";
import { Button, Box, ListItem, List, Typography, Paper } from "@mui/material";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
const URL = 'ws://127.0.0.1:8080/stockPrice';

export default function StockPrice() {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [cmd, setCMD] = useState("")
    const [wallet, setWallet] = useState(1000000);
    const [qntStock, setQntStock] = useState(0);
    const date = new Date()

    useEffect(() => {
        const wsClient = new WebSocket(URL);
        wsClient.onopen = () => {
            console.log('stock ws connected');
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
            ws.send(JSON.stringify({ cmd, wallet }));
            const message = JSON.parse(e.data);
            if (message.UserData.boughtOrSold) {
                setWallet(message.UserData.wallet);
            }
            setCMD("");
            console.log(message)
            setMessages([message, ...messages]);
        };
    }, [messages, cmd, ws, wallet]);

    const handleBuy = () => {
        setCMD("buy")
        let qnt = qntStock + 1
        setQntStock(qnt)
    }
    const handleSell = () => {
        setCMD("sell")
        let qnt = qntStock - 1
        setQntStock(qnt)
    }
    return (

        <>
            <h1>Stock Price Example</h1>
            <Box>
                <Paper style={{ padding: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h5" gutterBottom><b>Carteira:</b> R$ {wallet.toFixed(2)}</Typography>
                        <Typography variant="h6" gutterBottom>Qntd ações: {qntStock}</Typography>
                    </Box>
                    <Box>
                        <Button style={{ marginRight: 8 }} variant="contained" onClick={() => handleBuy()} disabled={wallet === 0}>Comprar</Button>
                        <Button variant="outlined" onClick={() => handleSell()} disabled={qntStock === 0}>Vender</Button>
                    </Box>
                </Paper>
                <Paper style={{ marginTop: 40 }}>
                    <Typography variant="h5" style={{ padding: 16 }} gutterBottom>Monitor da ação X</Typography>
                    <List>
                        {messages.map((message, index) =>
                            <ListItem key={index}>
                                <Typography style={{ color: message.StockPrice.stockStatus === "+" ? "green" : "red" }}>
                                    <b>{date.toUTCString()}</b>: <em> R$ {message.StockPrice.newPrice.toFixed(2)}</em> {message.StockPrice.stockStatus === "+" ? <TrendingUp /> : <TrendingDown />}
                                </Typography>
                            </ListItem>
                        )}
                    </List>
                </Paper>
            </Box>
        </>
    )
}
