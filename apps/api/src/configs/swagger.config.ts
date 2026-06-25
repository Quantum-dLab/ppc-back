import { applyDecorators } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
  OpenAPIObject,
  ApiTags,
} from '@nestjs/swagger';
interface SwaggerInstanceConfig {
  title: string;
  description: string;
  routePrefix: string;
  tagPrefix: string; // 'Admin' | 'User'
  version?: string;
}
const SWAGGER_INSTANCES: SwaggerInstanceConfig[] = [
  {
    title: 'PPC - Admin Panel',
    description: 'Admin panel endpoints',
    routePrefix: 'docs/admin',
    tagPrefix: 'Admin',
    version: '1.0',
  },
  {
    title: 'PPC - User Panel',
    description: 'User panel endpoints',
    routePrefix: 'docs/user',
    tagPrefix: 'User',
    version: '1.0',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildBaseConfig(config: SwaggerInstanceConfig) {
  return new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version ?? '1.0')
    .addBearerAuth(
      {
        description: 'JWT token from login response',
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'Header',
      },
      'Authorization',
    )
    .build();
}

function filterAndCleanDocument(
  doc: OpenAPIObject,
  tagPrefix: string,
): OpenAPIObject {
  const filteredDoc = { ...doc, paths: {} };

  Object.entries(doc.paths).forEach(([path, operations]) => {
    const filteredOperations = {};
    Object.entries(operations).forEach(([method, operation]) => {
      if (!operation.tags) return;

      const matchingTags = operation.tags.filter((tag: string) =>
        tag.startsWith(`${tagPrefix} |`),
      );

      if (matchingTags.length > 0) {
        filteredOperations[method] = {
          ...operation,
          // حذف prefix از نام tag برای نمایش تمیز در UI
          tags: matchingTags.map((tag: string) =>
            tag.replace(`${tagPrefix} | `, ''),
          ),
        };
      }
    });

    if (Object.keys(filteredOperations).length > 0) {
      filteredDoc.paths[path] = filteredOperations;
    }
  });

  return sortDocumentByTags(filteredDoc);
}

function sortDocumentByTags(doc: OpenAPIObject): OpenAPIObject {
  const tags = new Set<string>();

  Object.values(doc.paths).forEach((operations: any) => {
    Object.values(operations).forEach((operation: any) => {
      operation.tags?.forEach((tag: string) => tags.add(tag));
    });
  });

  const sortedTags = Array.from(tags).sort((a, b) => {
    const numA = parseFloat(a.match(/^\d+(\.\d+)?/)?.[0] ?? '0');
    const numB = parseFloat(b.match(/^\d+(\.\d+)?/)?.[0] ?? '0');
    return numA - numB;
  });

  const orderedPaths: Record<string, any> = {};

  sortedTags.forEach((tag) => {
    Object.entries(doc.paths).forEach(([path, operations]: [string, any]) => {
      Object.entries(operations).forEach(
        ([method, operation]: [string, any]) => {
          if (operation.tags?.includes(tag)) {
            if (!orderedPaths[path]) orderedPaths[path] = {};
            orderedPaths[path][method] = operation;
          }
        },
      );
    });
  });

  return { ...doc, paths: orderedPaths };
}

// ─── Main Setup ───────────────────────────────────────────────────────────────

export function SetupSwagger(app: NestApplication): void {
  // یه بار کل document رو می‌سازیم
  const masterConfig = new DocumentBuilder()
    .setTitle('PPC Master')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'JWT token from login response',
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'Header',
      },
      'Authorization',
    )
    .build();

  const masterDocument = SwaggerModule.createDocument(app, masterConfig);
  SWAGGER_INSTANCES.forEach((config) => {
    const filteredDoc = filterAndCleanDocument(
      masterDocument,
      config.tagPrefix,
    );

    // title و info رو override می‌کنیم
    filteredDoc.info = {
      ...filteredDoc.info,
      title: config.title,
      description: config.description,
    };

    SwaggerModule.setup(config.routePrefix, app, filteredDoc, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none', // collapse by default
        filter: true, // enable search
        showRequestDuration: true,
      },
      customSiteTitle: config.title,
    });
  });
}
