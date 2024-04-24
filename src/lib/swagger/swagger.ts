/**
 * Swagger registry class.
 */
class SwaggerRegistry {
  public static registry = new Map<
    any,
    {
      routes: {
        propertyKey: string;
        path?: string;
        method?: "get" | "post" | "put" | "patch" | "delete";
        request?: any;
        response?: any;
      }[];
      prefix: string;
      tags?: string[];
    }
  >();

  public initControllerIfNotExists(controller: any, prefix: string = "") {
    if (!SwaggerRegistry.registry.has(controller)) {
      SwaggerRegistry.registry.set(controller, {
        routes: [],
        prefix,
      });
    }
  }

  public setControllerPrefix(controller: any, prefix: string) {
    this.initControllerIfNotExists(controller);
    const data = SwaggerRegistry.registry.get(controller);
    data.prefix = prefix;
    SwaggerRegistry.registry.set(controller, data);
  }

  public updateRoute(
    controller: any,
    params: {
      propertyKey: string;
      path?: string;
      method?: "get" | "post" | "put" | "patch" | "delete";
      request?: any;
      response?: any;
    }
  ) {
    this.initControllerIfNotExists(controller);
    const data = SwaggerRegistry.registry.get(controller);

    // delete undefined keys
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    const route = data.routes.find(
      (route) => route.propertyKey === params.propertyKey
    );
    if (route) {
      Object.assign(route, params);
    } else {
      data.routes.push(params);
    }

    SwaggerRegistry.registry.set(controller, data);
  }

  public setControllerTags(controller: any, tags: string[]) {
    this.initControllerIfNotExists(controller);
    const data = SwaggerRegistry.registry.get(controller);
    data.tags = tags;
    SwaggerRegistry.registry.set(controller, data);
  }

  public generateSwaggerDocument() {
    const paths: any = {};
    SwaggerRegistry.registry.forEach((value) => {
      const controllerData = value;

      controllerData.routes.forEach((route) => {
        route.path = `/api/v1${controllerData.prefix}${route.path}`;

        if (!paths[route.path]) {
          paths[route.path] = {};
        }

        paths[route.path][route.method] = {
          security: [
            {
              bearerAuth: [],
            },
          ],
          tags: controllerData.tags,
          responses: {
            200: {
              description: "Success",
              content: {
                "application/json": {
                  schema: route.response,
                },
              },
            },
          },
        };

        if (route.request) {
          paths[route.path][route.method].requestBody = {
            content: {
              "application/json": {
                schema: route.request,
              },
            },
          };
        }

        if (!paths[route.path].summary) {
          paths[route.path].summary = route.propertyKey;
        }

        if (!paths[route.path].description) {
          paths[route.path].description = route.propertyKey;
        }

        if (!paths[route.path].parameters) {
          paths[route.path].parameters = [];
        }

        if (!paths[route.path].responses) {
          paths[route.path].responses = [];
        }
      });
    });

    const document = {
      openapi: "3.0.0",
      info: {
        title: "Express TypeScript Swagger",
        version: "1.0.0",
        description:
          "API documentation using Swagger and Express with TypeScript.",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      security: [
        {
          bearerAuth: [],
        },
      ],
      paths,
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    };

    return document;
  }
}
export const swaggerRegistry = new SwaggerRegistry();
