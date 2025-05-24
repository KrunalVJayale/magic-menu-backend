const ownerData = {
  name: "Rohit Sharma",
  number: "9876543210",
  hotel: "Sunrise Bistro",
  description: "A vibrant place known for its exquisite breakfast and brunch options.",
  location: {
    latitude: 28.7041,
    longitude: 77.1025,
    address: "5678, Sunrise Avenue, Delhi, India",
  },
  images: [
    {
      url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/5e/0e/f6/spectacular.jpg?w=600&h=-1&s=1",
      filename: "bistro1.jpg",
    },
    {
      url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/9f/6e/3a/multi-cuisine-restaurant.jpg?w=600&h=-1&s=1",
      filename: "bistro2.jpg",
    },
  ],
  isServing: true,
  chef: {
    name: "Amrita Singh",
    number: 9876543211,
  },
};


module.exports = {data:ownerData}