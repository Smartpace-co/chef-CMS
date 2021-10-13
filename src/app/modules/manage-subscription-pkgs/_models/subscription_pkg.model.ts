import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface SubscriptionPkgs extends BaseModel {
  id: number;
  title: string;
  packageFor:number;
  validity:number,
  maximumUsers:number,
  price:number,
  gracePeriod:number,
  status: string;
}