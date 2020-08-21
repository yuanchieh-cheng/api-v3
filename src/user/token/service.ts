/// <reference path="./token.d.ts" />

import moment from "moment";
import jwt from "jsonwebtoken";
import uuid from "uuid";

import * as credential from "../../credential.json";
import RefreshTokenMismatch from "../../util/error/401/RefreshTokenMismatch";
import TokenModel from "./model";
import MalformedToken from "../../util/error/403/MalformedToken";

export default class TokenService {
    constructor(private tokenModel: TokenModel){}

    async createKvToken(kvTokenContent: KvTokenContent){
        const options: jwt.SignOptions = {
            algorithm: "HS256"
        };

        const now = moment();
        const iat = parseInt(now.format("X"), 10);
        const exp = parseInt(
            now.add(credential.token.kvToken.expireTime, "seconds").format("X"),
            10
        );

        let claims:KvTokenClaim = {
            user_id: kvTokenContent.userId,
            iss: "alfred.labs",
            iat: iat,
            exp: exp,
            email: kvTokenContent.email,
            jid: kvTokenContent.jid,
            region: kvTokenContent.region,
            loginType: kvTokenContent.loginType,
            unique_id: kvTokenContent.uniqueId
        };

        if (
            kvTokenContent.uniqueIds &&
            Array.isArray(kvTokenContent.uniqueIds)
        ) {
            claims["_unique_ids"] = kvTokenContent.uniqueIds;
        }

        const token = jwt.sign(claims, credential.token.kvToken.secret, options);

        return {
            token: token,
            iat: iat,
            exp: exp,
        };
    }

    async createRefreshToken(kvTokenContent: KvTokenContent){
        let token = `${uuid.v4()}`;
        
        while (true) {
            const isRefreshTokenExists = await this.tokenModel.isRefreshTokenExists(
                token
            );
            if (isRefreshTokenExists) {
                token = `${uuid.v4()}`;
            } else {
                break;
            }
        }

        await Promise.all([
            this.tokenModel.storeRefreshToken(token, kvTokenContent),
            this.tokenModel.storeEmailMapRefreshToken(
                kvTokenContent.email,
                kvTokenContent.jid,
                token
            ),
        ]);

        return token;
    }

    async createKvTokenByRefreshToken({
        refreshToken,
        email,
        jid
    }: {
        refreshToken: string,
        email: string,
        jid: string
    }){
         const [
             [deviceExistedRefreshToken],
             [userId, _jid, _email, region, uniqueId, loginType, uniqueIds],
         ] = await Promise.all([
             this.tokenModel.getRefreshTokenByDevice(email, jid),
             this.tokenModel.getRefreshTokenContent(refreshToken),
         ]);

         if (
             !deviceExistedRefreshToken ||
             deviceExistedRefreshToken !== refreshToken
         ) {
             throw new RefreshTokenMismatch();
         }

         if (jid !== _jid || email !== _email) {
             throw new MalformedToken('mismatch identify');
         }

         if (!uniqueId) {
             throw new RefreshTokenMismatch();
         }

         let data: KvTokenContent = {
             userId: userId!,
             uniqueId: uniqueId,
             email,
             jid,
             region: region!,
             loginType: loginType!,
         };

         if (uniqueIds !== null) {
             data.uniqueIds = uniqueIds.split(",");
         }

         const [_refreshToken, kvTokenInfo] = await Promise.all([
             this.createRefreshToken(data),
             this.createKvToken(data),
             this.tokenModel.deleteRefreshToken(refreshToken),
         ]);

         return {
             refreshToken: _refreshToken,
             kvTokenInfo,
         };
    }

    async verifyKvToken(kvToken: string){
        const result = jwt.verify(kvToken, credential.token.kvToken.secret);
        return result;
    }
}