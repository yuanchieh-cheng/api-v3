/// <reference path="./logger.d.ts" />

export default class Logger implements ILogger{
    constructor(){}

    logDev(){
        console.log(...arguments);
    }

    error(error:any){
        console.error(...arguments);
    }
}