import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface User extends BaseModel {
  id: number;
  name: string;
  email: string;
  phoneNumber: number;
  roleId: any;
  status:boolean;
}