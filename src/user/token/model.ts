import ioredis from "ioredis";

export default class TokenModel {
    constructor(private rClient: ioredis.Redis) {}

    async isRefreshTokenExists(token: string) {
        const tokenKey = await this.getRefreshTokenKey(token);
        return this.rClient.exists(tokenKey);
    }

    async storeRefreshToken(token: string, kvTokenContent: KvTokenContent) {
        let userKvTokenData: KvTokenExport = {
            user_id: kvTokenContent.uniqueId,
            jid: kvTokenContent.jid,
            email: kvTokenContent.email,
            region: kvTokenContent.region,
            unique_id: kvTokenContent.uniqueId,
            loginType: kvTokenContent.loginType,
        };

        if (
            kvTokenContent.uniqueIds &&
            Array.isArray(kvTokenContent.uniqueIds)
        ) {
            userKvTokenData["_unique_ids"] = kvTokenContent.uniqueIds;
        }
        const tokenKey = await this.getRefreshTokenKey(token);
        return this.rClient.hmset(tokenKey, <any>userKvTokenData);
    }

    async storeEmailMapRefreshToken(
        email: string,
        jid: string,
        refreshToken: string
    ) {
        const emailKey = await this.getEmailMapRefreshTokenKey(email);
        this.rClient.hmset(emailKey, {
            [jid]: refreshToken,
        });
    }

    async getRefreshTokenByDevice(email: string, jid: string) {
        const emailKey = await this.getEmailMapRefreshTokenKey(email);
        return this.rClient.hmget(emailKey, jid);
    }

    async getRefreshTokenContent(token: string){
        const tokenKey = await this.getRefreshTokenKey(token);
        return this.rClient.hmget(
            tokenKey,
            "user_id",
            "jid",
            "email",
            "region",
            "unique_id",
            "loginType",
            "_unique_ids"
        );
    }

    async deleteRefreshToken(token: string){
        const tokenKey = await this.getRefreshTokenKey(token);

    }

    private async getRefreshTokenKey(token: string) {
        return `refreshToken::${token}`;
    }

    private async getEmailMapRefreshTokenKey(email: string) {
        return `refreshTokenEmail::${email}`;
    }
}
