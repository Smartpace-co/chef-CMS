import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Roles extends BaseModel {
  id: number;
  title: string;
  status: boolean;
  modulesORPages: string;
}