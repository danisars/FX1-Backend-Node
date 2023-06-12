import {
  connect as connectToMongoDB,
  ConnectOptions as MongooseConnectOptions,
  disconnect as disconnectFromMongoDB,
  set
} from 'mongoose';

export {connection} from 'mongoose';

export type ConnectOptions = MongooseConnectOptions;
export type ConnectParams = {
  url?: string;
  options: ConnectOptions;
};

export function connect(params?: ConnectParams) {
  set('strictQuery', true);
  return connectToMongoDB(
    params?.url || process.env.MONGODB_URI!,
    Object.assign(
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true,
      },
      params?.options || {}
    )
  );
}

export function disconnect() {
  return disconnectFromMongoDB();
}

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
// export * from './SystemChannelGroup';
// export * from './SystemChannel';
