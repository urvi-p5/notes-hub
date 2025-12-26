import { createServer } from "./index";

const PORT = process.env.PORT || 8080;

createServer().then((app) => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start server:", err);
});
