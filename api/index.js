import express from 'express';
import cors from 'cors';
import {Client} from "pg";
import dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import Transaction from './models/Transaction.js'; 
import Category from './models/Category.js';
import Method from './models/Method.js';

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

// For custom date range, use the following format in the URL:
// GET /api/balance?startDate=2025-04-01&endDate=2025-04-30
app.get('/api/balance', async (req, res) => {
    try{
        const {startDate, endDate} = req.query;

        const currentDate = new Date();
        const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const defaultEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0);

        const start = startDate ? new Date(startDate) : defaultStartDate;
        const end = endDate ? new Date(endDate) : defaultEndDate;
         
        const transactions = await Transaction.find({
            date: { $gte:start, $lte:end,},
        });

        const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        res.json({balance: balance.toFixed(2), startDate:start, endDate:end});

    } catch (error) {
        console.log('Error in fetching balance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/transaction', async (req, res) => {
    try{
    const { name, amount, description, date, category, method } = req.body; 
    const transaction = await Transaction.create({name, amount, description, date, category, method});
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

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.distinct('category'); // Fetch unique categories
        res.json(categories);
    } catch (error) {
        console.log('Error in fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/methods', async (req, res) => {
    try {
        const categories = await Method.distinct('method'); // Fetch unique categories
        res.json(categories);
    } catch (error) {
        console.log('Error in fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 4040;
const server = app.listen(PORT, () => {
    console.log('Server is running');
});
