import { IAccount } from '@devtable/settings-form';
import { get, post, put } from './request';

export const AccountAPI = {
  /**
   * get current account
   */
  get: async (): Promise<IAccount> => {
    const res = await get('/account/get', {});
    return res;
  },
  /**
   * update current account
   */
  update: async (name: string, email: string): Promise<IAccount> => {
    const payload = {
      name,
      email,
    };
    const res: IAccount = await put('/account/update', payload);
    return res;
  },
  /**
   * change current account's password
   */
  changepassword: async (old_password: string, new_password: string): Promise<IAccount> => {
    const payload = {
      old_password,
      new_password,
    };
    const res: IAccount = await post('/account/changepassword', payload);
    return res;
  },
};
