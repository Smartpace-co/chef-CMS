import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface UnitOfMeasurement extends BaseModel {
    id: number;
    unitOfMeasure: string;
    description: string;
    status: boolean
}