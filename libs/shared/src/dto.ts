import { ApiProperty } from "@nestjs/swagger";

export class PagingDto {
  @ApiProperty({ description: "Requested page number" })
  public page: number = 1;
  @ApiProperty({ description: "Items per page" })
  public limit: number = 10;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  currentPage?: number;

  @ApiProperty({ example: 20 })
  itemsPerPage?: number;

  @ApiProperty({ example: 340 })
  totalItems?: number;

  @ApiProperty({ example: 17 })
  totalPages?: number;
}

export class PagingResponseDto<T> {
  @ApiProperty({
    description:
      "The rows returned from database per given limit and page number",
  })
  public rows?: Partial<T>[];

  @ApiProperty({
    description: "The meta data of result-set per given limit and page number",
  })
  public meta?: PaginationMetaDto;
}
