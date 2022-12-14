import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Length, IsString, IsOptional, ValidateNested, IsUUID, IsIn, IsInt, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { Authentication, FilterRequest, PaginationRequest, PaginationResponse, SortRequest } from './base';

@ApiModel({
  description: 'Datasource config',
  name: 'DataSourceConfig',
})
export class DataSourceConfig {
  @IsString()
  @ApiModelProperty({
    description: 'host',
    required: true,
  })
  host: string;

  @IsOptional()
  @IsInt()
  @ApiModelProperty({
    description: 'port',
    required: false,
  })
  port?: number;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'username. Required for mysql | postgresql data sources',
    required: false,
  })
  username?: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'password. Required for mysql | postgresql data sources',
    required: false,
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'database name. Required for mysql | postgresql data sources',
    required: false,
  })
  database?: string;
}

@ApiModel({
  description: 'Datasource entity',
  name: 'DataSource',
})
export class DataSource {
  @ApiModelProperty({
    description : 'datasource ID in uuid format' ,
    required : false,
  })
  id: string;

  @ApiModelProperty({
    description: 'type of the datasource',
    required: true,
    enum: ['postgresql', 'mysql', 'http'],
  })
  type: string;

  @ApiModelProperty({
    description: 'key of the datasource',
    required: true,
  })
  key: string;
}

@ApiModel({
  description: 'DataSource filter object',
  name: 'DataSourceFilterObject',
})
export class DataSourceFilterObject implements FilterRequest {
  @IsOptional()
  @ApiModelProperty({
    description: 'search term. Uses fuzzy search for type and key fields',
    required: false,
  })
  search?: string;
}

@ApiModel({
  description: 'DataSource sort object',
  name: 'DataSourceSortObject'
})
export class DataSourceSortObject implements SortRequest {
  @IsIn(['type', 'key', 'create_time'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['type', 'key', 'create_time'],
  })
  field: 'type' | 'key' | 'create_time';

  @IsIn(['ASC', 'DESC'])
  @ApiModelProperty({
    description: 'Sort order',
    required: true,
    enum: ['ASC', 'DESC'],
  })
  order: 'ASC' | 'DESC';

  constructor(data: any) {
    Object.assign(this, data);
  }
}

@ApiModel({
  description: 'DataSource list request object',
  name: 'DataSourceListRequest',
})
export class DataSourceListRequest {
  @IsOptional()
  @Type(() => DataSourceFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'DataSource filter object',
    required: false,
    model: 'DataSourceFilterObject',
  })
  filter?: DataSourceFilterObject;

  @Type(() => DataSourceSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'DataSource sort object',
    required: true,
    model: 'DataSourceSortObject',
  })
  sort: DataSourceSortObject = new DataSourceSortObject({ field: 'create_time', order: 'ASC' });

  @Type(() => PaginationRequest)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Pagination object',
    required: true,
    model: 'PaginationRequest',
  })
  pagination: PaginationRequest = new PaginationRequest({ page: 1, pagesize: 20 });

  @IsOptional()
  @Type(() => Authentication)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'authentication object for use with app_id / app_secret',
    required: false,
    model: 'Authentication',
  })
  authentication?: Authentication;
}

@ApiModel({
  description: 'DataSource pagination response object',
  name: 'DataSourcePaginationResponse',
})
export class DataSourcePaginationResponse implements PaginationResponse<DataSource> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'DataSources',
    model: 'DataSource',
  })
  data: DataSource[];
}

@ApiModel({
  description: 'DataSource create request object',
  name: 'DataSourceCreateRequest',
})
export class DataSourceCreateRequest {
  @IsString()
  @IsIn(['postgresql', 'mysql', 'http'])
  @ApiModelProperty({
    description: 'type of the datasource',
    required: true,
    enum: ['postgresql', 'mysql', 'http'],
  })
  type: 'postgresql' | 'mysql' | 'http';

  @IsString()
  @Length(1, 250)
  @ApiModelProperty({
    description: 'key of the datasource',
    required: true,
  })
  key: string;

  @IsObject()
  @Type(() => DataSourceConfig)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'config of the datasource stored in json object format',
    required: true,
    model: 'DataSourceConfig',
  })
  config: DataSourceConfig;

  @IsOptional()
  @Type(() => Authentication)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'authentication object for use with app_id / app_secret',
    required: false,
    model: 'Authentication',
  })
  authentication?: Authentication;
}

@ApiModel({
  description: 'DataSource ID request',
  name: 'DataSourceIDRequest',
})
export class DataSourceIDRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'DataSource uuid',
    required: true,
  })
  id: string;

  @IsOptional()
  @Type(() => Authentication)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'authentication object for use with app_id / app_secret',
    required: false,
    model: 'Authentication',
  })
  authentication?: Authentication;
}