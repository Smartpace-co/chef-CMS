import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    constructor() { }

    /**
     * Strict compare function
     * @param val1 - value 1
     * @param val2 - value 2
     */
    strictCompare(val1: any, val2: any, strictMode: boolean = true) {
        try {
            let result: boolean;
            if (strictMode) {
                result = val1.toString().toLowerCase() === val2.toString().toLowerCase();
                // tslint:disable-next-line: triple-equals
            } else {
                result = val1.toString().toLowerCase() == val2.toString().toLowerCase();
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Format the phone number into :(000)-000-0000
     * @param number 
     */
    formatPhoneNumber(number) {
        try {
            let formattedPhoneNumber;
            formattedPhoneNumber = number.replace(/\D\-+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3');
            return formattedPhoneNumber;
        } catch (error) {
            throw error;
        }
    }
}
