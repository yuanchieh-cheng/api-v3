// in api server we use camel case naming
interface KvTokenContent {
    userId: string;
    jid: string;
    email: string;
    region: string;
    uniqueId: string;
    loginType: string;
    uniqueIds?: Array<string>;
}

// for forward capacity, we use snack naming
interface KvTokenExport {
    user_id: string;
    jid: string;
    email: string;
    unique_id: string;
    loginType: string;
    region: string;
    _unique_ids?: Array<string>;
}

interface KvTokenClaim extends KvTokenExport {
    iss: string;
    iat: number;
    exp: number;
}
