import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from '../modules/api.module';
export function SetupSwagger(app: NestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('flowEx')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'The token received in the response of login request',
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'Bearer JWT',
        name: 'Authorization',
        in: 'Header',
      },
      'Authorization',
    )
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [ApiModule],
  });

  const tags = new Set<string>();
  Object.values(swaggerDoc.paths).forEach((path) => {
    Object.values(path).forEach((operation) => {
      if (operation.tags) {
        operation.tags.forEach((tag) => tags.add(tag));
      }
    });
  });

  const sortedTags = Array.from(tags).sort((a, b) => {
    const numberA = parseFloat(a.match(/^\d+(\.\d+)?/)?.[0] || '0');
    const numberB = parseFloat(b.match(/^\d+(\.\d+)?/)?.[0] || '0');

    return numberA - numberB;
  });
  const cleanedTags = sortedTags.map((tag) => {
    return tag.replace(/^\d+(\.\d+)?\.?\s*/, '');
  });

  // Cleaning numbers from operation tags shown in UI
  Object.values(swaggerDoc.paths).forEach((operations) => {
    Object.values(operations).forEach((operation) => {
      if (operation.tags) {
        operation.tags = operation.tags.map((tag) => {
          return tag.replace(/^\d+(\.\d+)?\.?\s*/, '');
        });
      }
    });
  });

  const orderedPaths = {};
  cleanedTags.forEach((tag) => {
    Object.entries(swaggerDoc.paths).forEach(([path, operations]) => {
      Object.entries(operations).forEach(([method, operation]) => {
        if (operation.tags?.includes(tag)) {
          if (!orderedPaths[path]) {
            orderedPaths[path] = {};
          }
          orderedPaths[path][method] = operation;
        }
      });
    });
  });
  swaggerDoc.paths = orderedPaths;

  SwaggerModule.setup(`docs`, app, swaggerDoc, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
