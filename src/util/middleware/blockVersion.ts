import { Context, Next } from "koa";

export default async function blockVersionMiddleware(ctx: Context, next: Next) {

    
    await next();
}