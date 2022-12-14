import * as express from 'express';
import _ from 'lodash';
import { inject, interfaces as inverfaces } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { DataSourceService } from '../services/datasource.service';
import { validate } from '../middleware/validation';
import { DataSourceListRequest, DataSourceCreateRequest, DataSourceIDRequest, DataSourceConfig } from '../api_models/datasource';
import { ROLE_TYPES } from '../api_models/role';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import permission from '../middleware/permission';

@ApiPath({
  path: '/datasource',
  name: 'DataSource'
})
@controller('/datasource')
export class DataSourceController implements interfaces.Controller {
  public static TARGET_NAME = 'DataSource';
  private dataSourceService: DataSourceService;

  public constructor(
    @inject('Newable<DataSourceService>') DataSourceService: inverfaces.Newable<DataSourceService>
  ) {
    this.dataSourceService = new DataSourceService();
  }

  @ApiOperationPost({
    path: '/list',
    description: 'List datasources',
    parameters: {
      body: { description: 'datasource list request', required: true, model: 'DataSourceListRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DataSourcePaginationResponse' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPost('/list', permission(ROLE_TYPES.READER))
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = validate(DataSourceListRequest, req.body);
      const result = await this.dataSourceService.list(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/create',
    description: 'Create a new datasource',
    parameters: {
      body: { description: 'new datasource request', required: true, model: 'DataSourceCreateRequest'}
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DataSource' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPost('/create', permission(ROLE_TYPES.ADMIN))
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // eslint-disable-next-line prefer-const
      let {type, key, config } = validate(DataSourceCreateRequest, req.body);
      config = this.validateConfig(type, config);
      const result = await this.dataSourceService.create(type, key, config);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/delete',
    description: 'Remove datasource',
    parameters: {
      body: { description: 'update datasource request', required: true, model: 'DataSourceIDRequest'}
    },
    responses: {
      200: { description: 'SUCCESS' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPost('/delete', permission(ROLE_TYPES.ADMIN))
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = validate(DataSourceIDRequest, req.body);
      await this.dataSourceService.delete(id);
      res.json();
    } catch (err) {
      next(err);
    }
  }

  private validateConfig(type: 'mysql' | 'postgresql' | 'http', config: DataSourceConfig): DataSourceConfig {
    switch (type) {
      case 'http':
        return _.omit(config, ['port', 'username', 'password', 'database']);
      
      default:
        if (
          !_.has(config, 'port') ||
          !_.has(config, 'username') ||
          !_.has(config, 'password') ||
          !_.has(config, 'database')
        ) throw new ApiError(BAD_REQUEST, { message: 'Mysql|Postgresql config must contain [port, username, password, database]' });
        return config;
    }
  }
}