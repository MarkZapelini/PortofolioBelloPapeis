import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { swaggerSpec } from "./docs/swagger.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { router } from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(
  "/uploads",
  express.static("uploads", {
    dotfiles: "deny",
    fallthrough: false,
    index: false,
    redirect: false,
    maxAge: "1d",
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Disposition", "inline");
    },
  }),
);

if (env.ENABLE_API_DOCS) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use("/api", router);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`API iniciada em ${env.APP_URL}`);
});
