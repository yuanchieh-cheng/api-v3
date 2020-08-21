import { Next, Context } from "koa";
import HttpError from "../error/HttpError";

export default async function errorReturn(ctx: Context, next: Next){
    try{
        await next();
    } catch(error){
        if (error instanceof HttpError){
            ctx.status = error.statusCode;
            ctx.body = {
                error_code: error.errorCode
            };
            return;
        }
        ctx.status = 500;
        ctx.body = {
            error_code: 50001,
        };
    }
}