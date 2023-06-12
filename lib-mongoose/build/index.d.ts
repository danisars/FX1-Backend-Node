/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { ConnectOptions as MongooseConnectOptions } from 'mongoose';
export { connection } from 'mongoose';
export declare type ConnectOptions = MongooseConnectOptions;
export declare type ConnectParams = {
    url?: string;
    options: ConnectOptions;
};
export declare function connect(params?: ConnectParams): Promise<typeof import("mongoose")>;
export declare function disconnect(): Promise<void>;
export * from './User';
export * from './League';
export * from './Club';
export * from './Sport';
export * from './ChannelGroup';
export * from './Channel';
export * from './CMSUser';
export * from './UserRole';
export * from './UserRoleType';
export * from './GroupAggregates';
export * from './UserAggregates';
export * from './FormEntry';
export * from './Logs';
export * from './LockerRoom';
export * from './Message';
export * from './UserInvites';
export * from './ReadMessage';
export * from './FanGroup';
export * from './ProfileAction';
export * from './Notification';
export * from './Livestream';
export * from './LivestreamSource';
export * from './Utilities';
export * from './InHouse';
export * from './Game';
export * from './GameReminder';
export * from './ZipCode';
export * from './GamePartner';
export * from './GameReminder';
