import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default {
  dialect: "postgresql", // Defina o tipo de banco de dados como 'postgresql'
  schema: "./src/lib/db/schema.ts", // Caminho do seu schema
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:TQpJw9SjEI4D@ep-misty-cloud-a5bdelin.us-east-2.aws.neon.tech/neondb?sslmode=require", // URL direta, como fallback
  },
};



// npx drizzle-kit push