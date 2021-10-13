import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface Stamps extends BaseModel{
    id: number;
    stampTitle: string;
    stampType: any;
    countryId: string;
    levelTypeId: string;
    learningTypeId: string;
    items: [],
    images:[],
    status: boolean
}