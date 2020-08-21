declare type ServerError = {
    action: string;
    type: "error" | "info" | "warning";
    detail: object;
};

declare interface HttpError {
    statusCode: number;
    errorCode: number;
    statusText?: string;
}
