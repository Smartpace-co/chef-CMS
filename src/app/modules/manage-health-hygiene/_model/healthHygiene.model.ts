import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface HealthHygiene extends BaseModel{
    id: number;
    question: string;
    status: boolean
}