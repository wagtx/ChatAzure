import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'

export class StorageService {
    private containerClient: ContainerClient;

    constructor() {
        const connectionString = import.meta.env.VITE_STORAGE_CONNECTION_STRING;
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = blobServiceClient.getContainerClient('chat-attachments');
    }

    async uploadFile(file: File): Promise<string> {
        const blobName = `${Date.now()}-${file.name}`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

        const options = {
            blobHTTPHeaders: {
                blobContentType: file.type
            }
        };

        await blockBlobClient.uploadData(file, options);
        return blockBlobClient.url;
    }

    async deleteFile(url: string): Promise<void> {
        const blobName = url.split('/').pop();
        if (blobName) {
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.delete();
        }
    }

    async listFiles(): Promise<string[]> {
        const urls: string[] = [];
        for await (const blob of this.containerClient.listBlobsFlat()) {
            const blockBlobClient = this.containerClient.getBlockBlobClient(blob.name);
            urls.push(blockBlobClient.url);
        }
        return urls;
    }
}

export const storageService = new StorageService();


