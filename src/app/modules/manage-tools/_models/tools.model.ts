
import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Tools extends BaseModel {
  id: number;
  toolTitle: string;
  images:[];
  safetyLevelId: string;
  //difficultyLevelId:string
  relatedQuestions:[];
  description:string;
  status:boolean
}