import swaggerJsdoc from "swagger-jsdoc";

const serverUrl = `${process.env.HOST}:${process.env.PORT}`

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Chat App API",
            version: "1.0.0",
            description: "API documentation for the chat app",
        },
        servers: [{ url: serverUrl }], // Update if needed
    },
    apis: ["./src/routes/*.ts"], // Adjust to match your route files
};

export const swaggerSpec = swaggerJsdoc(options);
