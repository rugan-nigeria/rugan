import app, { initializeApp } from "./app.js";

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

async function startServer() {
  if (isProduction) {
    await initializeApp();
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  if (!isProduction) {
    initializeApp().catch((error) => {
      console.error("Server initialization error:", error.message);
    });
  }
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
