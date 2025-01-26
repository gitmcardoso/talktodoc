import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

// Função para obter o cliente Pinecone
export const getPineconeClient = () => {
  return new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. Obter o PDF -> Baixar e ler o PDF
  console.log("Baixando o arquivo do S3 para o sistema de arquivos");
  const fileName = await downloadFromS3(fileKey);
  if (!fileName) {
    throw new Error("Não foi possível baixar o arquivo do S3");
  }
  console.log("Carregando PDF para a memória: " + fileName);
  const loader = new PDFLoader(fileName);
  const pages = (await loader.load()) as PDFPage[];

  // 2. Dividir e segmentar o PDF
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. Vetorizar e incorporar os documentos individuais
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. Fazer upload para o Pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("talktodoc");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("Inserindo vetores no Pinecone");
  await namespace.upsert(vectors);

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("Erro ao incorporar o documento", error);
    throw error;
  }
}

// Função para truncar a string por bytes
export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

// Função para preparar o documento
async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");

  // Dividir os documentos
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
