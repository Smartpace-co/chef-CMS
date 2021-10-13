import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface CulinaryTechniques extends BaseModel {
    id: number;
    culinaryTechniqueTitle: string
    easyOrdering: string
    tagId: string
    categoryId: string
    toolRequirements: []
    kitchenRequirements: string
    video: string,
    spotlightVideo: string
    spotlightQuestions:[]
    multiSensoryQuestions:[]
    status: boolean
}