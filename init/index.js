const express = require("express");

const mongoose = require("mongoose");
const MONGO_URI ='mongodb+srv://krunaljayale:9284454408%40Kk@cluster0.gu3ftln.mongodb.net/Delivery-DataBase?retryWrites=true&w=majority&appName=Cluster0';
const Listing = require("../models/itemListing");
const Owner = require("../models/owner");

const listingData = require("./listingData");
const ownerData = require("./ownerData");
const Customer = require("../models/customer");
const Category = require('../models/category');
const LiveOrder = require("../models/liveOrder");
const PastOrder = require("../models/pastOrder");
const { sendNotification } = require("../utils/notificationHelper");

const connectDB = (url) => {
  console.log("Connected to DataBase");
  return mongoose.connect(url);
};

const categories= [
  // "Pizza",
  // "Sandwich",
  // "Pasta",
  // "Maggi",
  // "Fries",
  // "Manchurian",
  // "Appetizer",
  // "Momos",
  // "Ice-Cream",
  // "Burgers",
  // "Rolls",
  // "Pastry",
  // "Noodles",
  // "Cakes",
  // "Chinese",
  // "Paratha",
  // "Dosa"
];


const start = async () => {
  try {
    await connectDB(MONGO_URI);
    await initDB();
  } catch (error) {
    console.log(`Some error in DataBase connection ${error}`);
  }
};

const obj = {
  url:'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  filename:'image2'
}

const initDB = async () => {
  // try {
  //   // Define the new image URL
  //   const newImageUrl = "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/42/95/53/paasha.jpg?w=600&h=-1&s=1";

  //   // Update the `url` field in the `images` array for all owners
  //   const result = await Listing.updateMany(
  //     {}, // This condition matches all documents in the collection
  //     {
  //       $set: {
  //         'images.$[].url': newImageUrl // Update the URL for each image in the `images` array
  //       }
  //     }
  //   );

  //   console.log(`${result.nModified} documents updated.`);
  // } catch (err) {
  //   console.error('Error updating owner images:', err);
  // }
  // let data = await Owner.find({hotel:'The Pizza House'});
  // data[0].images.push(obj);
  // await data[0].save();
  // const data  = await LiveOrder.deleteMany();
  // console.log("Data was Initialised",data);

  // let fcmToken = "c0Ato52gTNSpJdfcGzIavj:APA91bHSPcI3T6bP_XnEwsE_8eBRkW5q-zamWh0ul5wIb2_XoK9cxhGMoEBxRXL4SWWonP6nbNXZwr_z8rzTN9gQ6gM1wq9B18Mo1Bq6UvucxOb2wbT0G4Y";
  // let title = "Hello";
  // let body = "This is sample notification";

  // const result = await sendNotification(fcmToken, title, body);
  // await Listing.deleteMany();

  try {
    for (let item of listingData.data) {
      console.log("Inserting item with owner:");

      // Ensure that item has all required fields
      const newItem = new Listing({ ...item, owner: '67a361ab152df28eca9d6955' });

      await newItem.save(); // Save the item to the database

      console.log("Inserted item ID:", newItem._id);
    }
  } catch (error) {
    console.error("Error inserting listings:", error);
  }

  

  // if (result.success) {
  //   res.status(200).json({ message: "Notification sent!", response: result.response });
  // } else {
  //   res.status(500).json({ error: "Failed to send notification", details: result.error });
  // }

};

start();
