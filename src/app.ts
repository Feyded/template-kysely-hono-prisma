import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { routes } from "./controllers/routes.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.js";
import { envConfig } from "./env.js";
import { cors } from "hono/cors";
import { setUpDbClientMiddleware } from "./middlewares/set-up-db-client.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { HonoEnv } from "./types/hono.js";
import { STAGES } from "./const/env.js";
import { swaggerUI } from "@hono/swagger-ui";
import { Scalar } from "@scalar/hono-api-reference";
import { schemas } from "./data/schema.js";

const app = new OpenAPIHono<HonoEnv>();
if (envConfig.STAGE !== STAGES.Prod) {
  /* API Docs */
  app.get("/openapi.json", (c) => {
    const doc = app.getOpenAPIDocument({
      openapi: "3.0.0",
      info: {
        version: "0.0.1",
        title: `${envConfig.STAGE.toUpperCase()} API`,
        description: "API Documentation",
      },
      externalDocs: {
        description: "API Reference",
        url: "/reference",
      },
    });

    return c.json(doc);
  });
  app.openAPIRegistry.registerComponent("securitySchemes", "cookieAuth", {
    type: "apiKey",
    scheme: "cookie",
    name: "auth__access_token",
  });

  /* Register Schemas */
  Object.entries(schemas).forEach(([key, value]) => {
    app.openAPIRegistry.register(key, value);
  });

  /* API Docs */
  app.get("/swagger", swaggerUI({ url: "/openapi.json" }));
  app.get("/reference", Scalar({ url: "/openapi.json" }));
}

app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies
  })
);

app.onError(errorHandlerMiddleware);
app.use(setUpDbClientMiddleware);
app.use("/uploads/*", serveStatic({ root: "./public" }));

/* Routes */
app.get("/", (c: Context) => c.json("App running!"));
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
