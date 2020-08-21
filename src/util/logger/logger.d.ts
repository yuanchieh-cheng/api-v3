interface ILogger {
    error(error: ServerError):void;
    logDev():void;
    log?(log: any):void;
    warning?(warning: any):void;
    info?(info: any):void;
}
