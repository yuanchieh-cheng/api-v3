/// <reference path="../error.d.ts" />

export default class MalformedToken implements HttpError {
    public statusCode: number = 403;
    public errorCode: number = 40301;
    public statusText: string;
    constructor(reason: string) {
        this.statusText = `AuthFail: ${reason}`;
    }
}
