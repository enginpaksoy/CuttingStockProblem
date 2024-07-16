const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const port = 3001;

// MongoDB bağlantı URI'si
const uri = 'mongodb://localhost:27017/mydatabase'; // 'mydatabase' kısmını kendi veritabanı isminizle değiştirin

mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB bağlantı hatası:'));
db.once('open', () => {
  console.log('MongoDB bağlantısı başarılı');
});

// Kullanıcı şeması ve modeli
const userSchema = new mongoose.Schema({
  id: Number,
  password: String
});

const User = mongoose.model('User', userSchema);

const stockList = []
const orderList = []

app.use(express.json()); // This helps our server automatically understand and use JSON data sent by the client9
app.use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to the Node.js server!');
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from Node.js' });
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    res.json({ received: data });
});

app.post('/auth/user', async (req, res) => {
    try {
        const { username, password } = req.body;  // 'id' yerine 'username' alındığına emin olun
        const user = await User.findOne({ username });  // Yalnızca kullanıcı adına göre arama yapın
        if (user && user.password === password) {  // Şifreyi doğrudan karşılaştırın
            return res.json({ message: "Başarılı" });
        } else {
            return res.json({ message: "Incorrect password or ID." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/auth/customer', (req, res) => {
    const { id } = req.body;
  
    // Veriyi işleme ve veritabanına kaydetme işlemleri burada yapılabilir
    console.log('Received ID:', id);
  
    // Basit bir yanıt döndürme
    if (id) {
      res.json({ message: 'wtfwfwf', idValue:  id  });
    } else {
      res.status(400).json({ message: 'ID eksik123' });
    }
    res.send(res.json)
  });
  
app.post('/add-stock', (req, res) => {
    let tmpData = {customer:req.body.customer,unit:req.body.unit,size:req.body.size}
    stockList.push(tmpData)
    tmpData = ({})
    res.json({"message" : "I am alive"})
})

app.get('/list-stock', (req, res) => {
   res.json(stockList)  
})

app.post('/add-order', (req, res) => {
    let tmpData = {customer:req.body.id,unit:req.body.unit,size:req.body.size}
    orderList.push(tmpData)
    tmpData = ({})
    res.json({"message" : "I am alive"})
})

app.get('/list-order', (req, res) => {
   res.json(orderList)  
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});