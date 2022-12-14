import Role from '../models/role';
import { dashboardDataSource } from '../data_sources/dashboard';
import { ROLE_TYPES } from '../api_models/role';
import Account from '../models/account';
import { ApiError, FORBIDDEN, UNAUTHORIZED } from '../utils/errors';
import { AUTH_ENABLED } from '../utils/constants';
import ApiKey from '../models/apiKey';

export class RoleService {
  async list(): Promise<Role[]> {
    const roleRepo = dashboardDataSource.getRepository(Role);
    return await roleRepo.find();
  }

  static checkPermission(auth: Account | ApiKey | null, minimum_required_role: ROLE_TYPES): void {
    if (!AUTH_ENABLED) {
      return;
    }
    if (!auth) {
      throw new ApiError(UNAUTHORIZED, { message: 'Not authenticated' });
    }
    if (auth.role_id < minimum_required_role) {
      throw new ApiError(FORBIDDEN, { message: 'Insufficient privileges' });
    }
  }
}