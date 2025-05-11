import { useState, useEffect } from 'react'
import '../css/Home.css'



function App() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [method, setMethod] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [methodList, setMethodList] = useState([]);

  useEffect(() => {
    getRecentTransactions().then(setTransactions);
    fetchCategories();
    fetchMethods();
  }, []);

  async function getRecentTransactions(){
    const url = import.meta.env.VITE_API_URL+'/transactions/recent';
    const response = await fetch(url);
    return await response.json();
  }

  async function fetchCategories() {
        const url = import.meta.env.VITE_API_URL + '/categories';
        const response = await fetch(url);
        const data = await response.json();
        setCategories(data); 
      }

  async function fetchMethods(){
    const url = import.meta.env.VITE_API_URL + '/methods';
    const response = await fetch(url);
    const data = await response.json();
    console.log('Fetched methods:', data);
    setMethodList(data); 
  }
  async function addNewTransaction(ev){
    ev.preventDefault();

    if (!name || !amount || !category){
      alert('Please fill in all the * marked details');
      return;
    }
    
    const currentDate = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const transactionDate = date?.trim() || currentDate;
    
    // console.log({name, amount, description, date:transactionDate, method, category});
    
    const response = await fetch(import.meta.env.VITE_API_URL+'/transaction', {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({ name, amount, description, date: transactionDate, method,category }),
    });
  
    const json = await response.json();
    setName('');
    setAmount('');
    setDescription('');
    setDate('');
    setCategory('');
    setMethod('');
    setTransactions(prev => [...prev, json]);
  }


  let balance = 0;
  for (const transaction of transactions){
    balance = balance + transaction.amount;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];
  
  return (
    <main>
      <h1>₹ {balance}<span>.{fraction}</span></h1>
      <h3>Add new transaction</h3>
      <form onSubmit={addNewTransaction}>
        <div className='amount'>
          <input type="number"
                  value={amount}
                  onChange={ev =>setAmount(ev.target.value)}
                  placeholder ='*Amount'/>
        </div>
        <div className='basic'>
        <input type="Text" 
               value={name}
               onChange={ev => setName(ev.target.value)}
              placeholder='*Title'/>
        <input type="date"
                value={date}
                onChange={ev => setDate(ev.target.value)}/>
        </div>
        <div className='basic'>
        <div className='dropdown'>
            <select value={category} onChange={ev => setCategory(ev.target.value)} required>
                <option value="">*Select Category</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ))}
            </select>
            </div>
        { <div className='dropdown'>
            <select value={method || ''} onChange={ev => setMethod(ev.target.value)}>
                <option value="">Select Method</option>
                {methodList.map((met, index) => (
                    <option key={index} value={met}>{met}</option>
                ))}
            </select>
        </div> }
        </div>
        <div className='description'>
        <input type='text' 
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                placeholder='Comments'/>
        </div>
        <button type='submit'
                /* disabled={!name || !amount}*/>
                  Add New Transaction
        </button>
      </form>
      <h3>Recent transactions</h3>
      <div className='transactions'>
        {transactions.length > 0 && transactions
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0,5)
          .map(transaction => (
          <div key={transaction._id} className='transaction'>
          <div className='left'>
            <div className='name'>{transaction.name}</div>
            <div className='description'>{transaction.description}</div>
          </div>
          <div className='right'>
            <div className={'price '+(transaction.amount<0?'red':'green')}>{transaction.amount}</div>
            <div className='date'>
                {new Date(transaction.date).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                })}
            </div>
          </div>
        </div>
        ))}
      </div>

    </main>
  )
}

export default App;
