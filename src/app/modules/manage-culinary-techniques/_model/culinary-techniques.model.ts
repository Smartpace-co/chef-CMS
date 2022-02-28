import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface CulinaryTechniques extends BaseModel {
    id: number;
    culinaryTechniqueTitle: string
    toolRequirements: []
    kitchenRequirements: string
    video: string,
    description:string,
    status: boolean
}