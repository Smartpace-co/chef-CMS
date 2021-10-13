import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface Grade extends BaseModel {
    item_id: number;
    item_text: string;
    status: boolean;
}