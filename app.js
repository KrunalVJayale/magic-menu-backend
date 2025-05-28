if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
// require("./utils/paymentCronJob"); // Load cron jobs



const express  = require('express');
const connectDB = require('./config/connect');
const hotelRouter = require('./routes/hotel');
const customerRouter = require('./routes/customer');
const commonRouter = require('./routes/common');
const riderRouter = require('./routes/rider');


const app = express();
app.use(express.json());


app.use('/hotel', hotelRouter);
app.use('/customer', customerRouter);
app.use('/common', commonRouter);
app.use('/rider', riderRouter);


app.get('/', (req, res) => {
  res.status(200).send('Please visit www.magicmenu.in');
});

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
  
      // Uncomment this and comment below one if you want to run on ip address so that you can
      // access api in physical device
  
      app.listen(process.env.PORT || 3000, "0.0.0.0", () =>{
        // app.listen(process.env.PORT || 3000, ()=>{
            console.log(`Server is on on PORT = ${process.env.PORT}`)
        });
    } catch (error) {
      console.log(error);
    }
  };

start()