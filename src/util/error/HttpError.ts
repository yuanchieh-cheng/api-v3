export default class HttpError implements HttpError {
    public statusCode: number = 500;
    public errorCode: number = 50001;
    public statusText?: string;
}
