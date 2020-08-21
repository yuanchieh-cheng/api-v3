/// <reference path="../error.d.ts" />

export default class AuthFail implements HttpError {
    public statusCode: number = 401;
    public errorCode: number = 40101;
    public statusText: string;
    constructor(reason: string) {
        this.statusText = `AuthFail: ${reason}`;
    }
}
