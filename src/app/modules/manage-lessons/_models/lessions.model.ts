import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface Lesson extends BaseModel {
    id: number;
    lessonTitle: string;
    createrName: string;
    reviewerName: string;
    learningObjForTeacher: string;
    learningObjForStudent: string;
    greeting: string;
    linguisticDetails: string;
    chefIntroduction: Array<[]>;
    safteySteps: Array<[]>;
    safteyLevel: string;
    grade: number;
    multiSenserActivity: string;
    subject: string;
    // activity: string;
    // experiment: string;
    // recips: string
    types: string;
    // questions: string,
    cleanUpText: string;
    funFactText: string;
    socialStudiesFact: string;
    links: [];
    status: boolean
}


export interface Recips {
    reciepsName: string;
    country: string;
    alterNativeName: string;
    estimatesTime: string;
    serves: number;
    ingredients: string;
    quantity: string;
    toolsBigChef: string;
    toolslittleChef: string;
    techniques: string;
    description: Array<[]>;
    holidays: string;
}


export interface Experiment {
    experimentName: string;
    ingredients: Array<[]>;
    tools: Array<[]>;
    techniques: Array<[]>;
    experimentsStepsArray: Array<[]>;
    // steps: string;
    // description: Array<[]>;
}


export interface Questions {
    questionName: string;
    hint: string;
    standard: string;
    answerType: string;
    description: []
    answer: []
}
export interface Activity {
    activityName: string;
    image: string;
    video: string;
    link: string;
    descriptions: string;
}