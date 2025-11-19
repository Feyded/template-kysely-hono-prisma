import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { routes } from "./controllers/routes.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.js";
import { envConfig } from "./env.js";

const app = new Hono();

app.onError(errorHandlerMiddleware);
app.use("/uploads/*", serveStatic({ root: "./public" }));

/* Routes */
routes.forEach((route) => {
  app.route("/", route);
});

serve(
  {
    fetch: app.fetch,
    port: envConfig.APP_PORT,
  },
  (info) => {
    console.log(`✅ Server is running at http://localhost:${info.port}`);
  }
);
