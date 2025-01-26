import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    // Chamada à API OpenAI para criar o embedding
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "), // Remove quebras de linha
    });

    // Converte a resposta para JSON
    const result = await response.json();
    
    // Log da resposta completa para depuração
    console.log("OpenAI API Response:", result);

    // Verifica a estrutura da resposta
    if (result && result.data && result.data.length > 0) {
      console.log("Embedding encontrado:", result.data[0].embedding);
      return result.data[0].embedding as number[];
    } else {
      console.error("Resposta sem embeddings:", result);
      throw new Error("No embeddings found in the response");
    }
  } catch (error) {
    console.log("Error calling OpenAI embeddings API", error);
    throw error;
  }
}
