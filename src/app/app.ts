import express from "express";
import "dotenv/config";
import rateLimit from "express-rate-limit";
class App {
  limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // número máximo de requisições por IP durante o intervalo de tempo
    message:
      "Você atingiu o limite de requisições. Por favor, tente novamente mais tarde.",
  });

  public port = process.env.PORT;
  public app = express();

  App() {
    var queue = require("express-queue");

    this.app.use(this.limiter);
    this.app.use(queue({ activeLimit: 2, queuedLimit: 10 }));
  }
}

export default App;
