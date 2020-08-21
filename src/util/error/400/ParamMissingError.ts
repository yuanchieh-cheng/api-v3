import HttpError from "../HttpError";
/// <reference path="../error.d.ts" />

export default class ParamMissingErros extends HttpError {
    public statusCode: number = 400;
    public errorCode: number = 40001;
    public statusText: string;
    constructor(missingParam: string) {
        super();
        this.statusText = `Missing Params: ${missingParam}`;
    }
}
