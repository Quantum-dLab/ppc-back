import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join, extname } from 'path';

// file-storage.service.ts
@Injectable()
export class FileStorageService {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'products');

  async save(file: Express.Multer.File): Promise<string> {
    await mkdir(this.uploadDir, { recursive: true });
    const extension = extname(file.originalname);
    const fileName = `${randomUUID()}${extension}`;
    const filePath = join(this.uploadDir, fileName);

    await writeFile(filePath, file.buffer);

    return `/uploads/products/${fileName}`;
  }
}
