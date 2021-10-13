import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface Nutrients extends BaseModel {
    id: number;
    nutrientTitle: string;
    categoryId: string;
    typeId: string;
    relatedQuestions:[];
    spotlightQuestion:[]
    multiSensoryQuestion:[]
    spotlightVideo: string;     
    description: string;
    status: boolean
}
