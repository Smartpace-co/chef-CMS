import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface Ingredients extends BaseModel {
    id: number;
    ingredientTitle:string;
    images: [];
    easyOrdering: string;
   // spotlightQuestions:[]
  //  multiSensoryQuestions:[]
    scienceFacts: [];
    size:string;
    seasonId:any;
  //  seasonTo:number;
    commonName: string;
    scientificName: string;
    allergen: [];
    substitutes: [];
    additionalNutrients: [];
//matchThePairQuestions:[];
    status: boolean;
}