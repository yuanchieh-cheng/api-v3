/// <reference path="../error.d.ts" />

export default class RefreshTokenMismatch implements HttpError {
    public statusCode: number = 401;
    public errorCode: number = 40102;
    constructor(){}
}
