const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { connectToDB } = require("./mongoDB.js");
const routes = require("./Routes/userRoutes.js");
const stripe = require("stripe")(process.env.stripe_key);

const app = express();
const port = process.env.PORT || 5000;

//Middlewares
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api", routes);
app.get("/hello",async (req, res) => {
  res.send("Hello World!");
})

// Connect to MongoDB database
connectToDB();

app.post("/api/create-checkout", async (req, res) => {
  const { name, price, totalBill } = req.body;
  const lineItem = {
    price_data: {
      currency: "usd",
      product_data: {
        name: name,
      },
      unit_amount: price * 100,
    },
    quantity: 1,
  };

  try {
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [lineItem], // Convert lineItem to an array
      mode: "payment",
      success_url: `${process.env.BASE_URL}/success`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
