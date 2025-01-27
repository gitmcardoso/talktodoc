import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // Importa os módulos necessários do SDK v3

export async function uploadToS3(file: File) {
    try {
        // Configura o cliente do S3 com as credenciais e região
        const s3 = new S3Client({
            region: 'sa-east-1',
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
            },
        });

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file,
        };

        // Cria o comando para enviar o arquivo para o S3
        const command = new PutObjectCommand(params);

        // Envia o arquivo para o S3
        await s3.send(command); // Removido o uso da variável 'data', já que não era necessária

        
        return Promise.resolve({
            file_key,
            file_name: file.name,
        });

    } catch (error) {
        console.error('Error uploading to S3:', error);
    }
}

export function getS3Url(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.sa-east-1.amazonaws.com/${file_key}`;
    return url;
}
