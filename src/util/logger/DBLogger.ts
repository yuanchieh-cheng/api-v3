import mongoDb from "mongodb";
import Logger from "./Logger";
import HttpError from "../error/HttpError";

export class DBLogger extends Logger implements Logger {
    private errorCollection: mongoDb.Collection;
    constructor(mongoDb: mongoDb.Db) {
        super();
        this.errorCollection = mongoDb.collection("server_error_logs");
    }

    async error(error: ServerError|HttpError) {
        await this.errorCollection.insertOne(error);
    }
}
