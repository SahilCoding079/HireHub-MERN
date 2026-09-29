import "dotenv/config";
import app from './app.js'
import connectDb from './config/db.js';


const PORT = process.env.PORT || 3000;


// Start the server
const startServer = async() => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();