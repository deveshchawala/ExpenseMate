import express from 'express';
import cors from 'cors';
import {Client} from "pg";
import dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import Transaction from './models/Transaction.js'; 

dotenv.config(); // Initialize dotenv

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'], // add frontend origin(s)
    credentials: true
  }));
app.use(express.json());

await mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('✅ MongoDB Connected'))
        .catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.get('/api/test', (req, res) => {
    res.json('test ok');
});

app.post('/api/transaction', async (req, res) => {
    try{
    const { name, amount, description, date } = req.body; 
    const transaction = await Transaction.create({name, amount, description, date});
    res.json(transaction);
    }
    catch (error){
        console.log('Error in creating a transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/transactions', async (req,res) => {
    const transactions = await Transaction.find();
    res.json(transactions);
});

app.get('/api/transactions/recent', async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ date: -1 }) // Sort by date in descending order
            .limit(10); // Limit the result to the last 10 transactions
        res.json(transactions);
    } catch (error) {
        console.log('Error in fetching recent transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 4040;
const server = app.listen(PORT, () => {
    console.log('Server is running');
});
