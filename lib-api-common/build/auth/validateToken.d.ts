import * as admin from 'firebase-admin';
export declare function validateToken(token: string, app?: admin.app.App): Promise<{
    uid: string | undefined;
    email: string | undefined;
    userID: string | undefined;
}>;
