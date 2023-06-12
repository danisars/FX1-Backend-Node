import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { gql } from 'graphql-request';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CmsUser = {
  __typename?: 'CMSUser';
  accessLevel: Scalars['String'];
  birthDate?: Maybe<Scalars['String']>;
  contactNumber?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Float']>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  invitedBy: Scalars['String'];
  jobTitle?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  profilePhotoID?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  uid: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
};

export type CmsUsers = {
  __typename?: 'CMSUsers';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<CmsUser>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type Channel = {
  __typename?: 'Channel';
  Livestream?: Maybe<Livestream>;
  channelGroupID: Scalars['String'];
  createdAt?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  livestreamID?: Maybe<Scalars['String']>;
  lockerRoomID: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  type: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
};

export type ChannelGroup = {
  __typename?: 'ChannelGroup';
  Channels?: Maybe<Array<Maybe<Channel>>>;
  createdAt?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  group: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  lockerRoomID: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
  withLivestream?: Maybe<Scalars['Boolean']>;
};

export type ChannelGroups = {
  __typename?: 'ChannelGroups';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<ChannelGroup>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type Channels = {
  __typename?: 'Channels';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Channel>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type Club = {
  __typename?: 'Club';
  Avatar?: Maybe<Media>;
  CoverPhoto?: Maybe<Media>;
  League?: Maybe<League>;
  LockerRoom?: Maybe<LockerRoom>;
  Sports?: Maybe<Array<Sport>>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  isFeatured?: Maybe<Scalars['Boolean']>;
  leagueID?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type Clubs = {
  __typename?: 'Clubs';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Club>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type FanGroup = {
  __typename?: 'FanGroup';
  Avatar?: Maybe<Media>;
  CoverPhoto?: Maybe<Media>;
  LockerRoom?: Maybe<LockerRoom>;
  Sports?: Maybe<Array<Sport>>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type FanGroups = {
  __typename?: 'FanGroups';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<FanGroup>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type GamePartner = {
  __typename?: 'GamePartner';
  Icon?: Maybe<Media>;
  id?: Maybe<Scalars['ID']>;
  isHidden?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type GamePartners = {
  __typename?: 'GamePartners';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<GamePartner>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type InHouse = {
  __typename?: 'InHouse';
  Avatar?: Maybe<Media>;
  CoverPhoto?: Maybe<Media>;
  LockerRoom?: Maybe<LockerRoom>;
  Sports?: Maybe<Array<Sport>>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type InHouses = {
  __typename?: 'InHouses';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<InHouse>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type InputClub = {
  Avatar?: InputMaybe<InputMedia>;
  CoverPhoto?: InputMaybe<InputMedia>;
  isFeatured?: InputMaybe<Scalars['Boolean']>;
  leagueID: Scalars['String'];
  name: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
};

export type InputCreateCmsUser = {
  accessLevel: Scalars['String'];
  birthDate?: InputMaybe<Scalars['String']>;
  contactNumber?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  jobTitle?: InputMaybe<Scalars['String']>;
  lastName: Scalars['String'];
  password: Scalars['String'];
  profilePhotoID?: InputMaybe<Scalars['String']>;
};

export type InputEditCmsUserProfile = {
  birthDate?: InputMaybe<Scalars['String']>;
  contactNumber?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  displayName: Scalars['String'];
  firstName: Scalars['String'];
  jobTitle?: InputMaybe<Scalars['String']>;
  lastName: Scalars['String'];
  profilePhotoID?: InputMaybe<Scalars['String']>;
};

export type InputFanGroup = {
  Avatar?: InputMaybe<InputMedia>;
  CoverPhoto?: InputMaybe<InputMedia>;
  name: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
};

export type InputGamePartner = {
  Icon?: InputMaybe<InputMedia>;
  isHidden?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
};

export type InputInHouse = {
  Avatar?: InputMaybe<InputMedia>;
  CoverPhoto?: InputMaybe<InputMedia>;
  name: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
};

export type InputLeague = {
  Avatar?: InputMaybe<InputMedia>;
  CoverPhoto?: InputMaybe<InputMedia>;
  name: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
};

export type InputLivestream = {
  link: Scalars['String'];
  source: Scalars['String'];
  startDate?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type InputMedia = {
  objectID: Scalars['String'];
  objectType: Scalars['String'];
};

export type InputSport = {
  Avatar: InputMedia;
  CoverPhoto: InputMedia;
  Icon?: InputMaybe<InputMedia>;
  isHidden?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  status?: InputMaybe<Scalars['String']>;
};

export type League = {
  __typename?: 'League';
  Avatar?: Maybe<Media>;
  CoverPhoto?: Maybe<Media>;
  LockerRoom?: Maybe<LockerRoom>;
  Sports?: Maybe<Array<Sport>>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  sportIDs: Array<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type Leagues = {
  __typename?: 'Leagues';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<League>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type Livestream = {
  __typename?: 'Livestream';
  LivestreamSource?: Maybe<LivestreamSource>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  isLive?: Maybe<Scalars['Boolean']>;
  link: Scalars['String'];
  source: Scalars['String'];
  startDate?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
};

export type LivestreamSource = {
  __typename?: 'LivestreamSource';
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type LockerRoom = {
  __typename?: 'LockerRoom';
  Roles?: Maybe<UserRolesInLockerRoom>;
  createdAt?: Maybe<Scalars['Float']>;
  group: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
};

export type LockerRooms = {
  __typename?: 'LockerRooms';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<LockerRoom>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type Media = {
  __typename?: 'Media';
  PhotoURL?: Maybe<Scalars['String']>;
  isSport?: Maybe<Scalars['Boolean']>;
  objectID: Scalars['String'];
  objectType: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addLivestream: MutationResult;
  addLivestreamSource: MutationResult;
  addUserManagerialRole: MutationResult;
  createCMSUser: MutationResult;
  createClub: MutationResult;
  createFanGroup: MutationResult;
  createGamePartner: MutationResult;
  createInHouse: MutationResult;
  createLeague: MutationResult;
  createSport: MutationResult;
  createUserRoleType: MutationResult;
  deleteClub: MutationResult;
  deleteFanGroup: MutationResult;
  deleteInHouse: MutationResult;
  deleteLeague: MutationResult;
  deleteSport: MutationResult;
  editCMSUserAccessLevel: MutationResult;
  editCMSUserProfile: MutationResult;
  editClub: MutationResult;
  editFanGroup: MutationResult;
  editInHouse: MutationResult;
  editLeague: MutationResult;
  editSport: MutationResult;
  resendInviteCMSUser: MutationResult;
  setFeaturedGame: MutationResult;
  setLivestreamLive: MutationResult;
};


export type MutationAddLivestreamArgs = {
  channelName: Scalars['String'];
  input: InputLivestream;
  lockerRoomID: Scalars['String'];
};


export type MutationAddLivestreamSourceArgs = {
  name: Scalars['String'];
};


export type MutationAddUserManagerialRoleArgs = {
  emailAddress?: InputMaybe<Scalars['String']>;
  lockerRoomID: Scalars['String'];
  role: Scalars['String'];
  userID?: InputMaybe<Scalars['String']>;
};


export type MutationCreateCmsUserArgs = {
  input: InputCreateCmsUser;
};


export type MutationCreateClubArgs = {
  input: InputClub;
};


export type MutationCreateFanGroupArgs = {
  input: InputFanGroup;
};


export type MutationCreateGamePartnerArgs = {
  input: InputGamePartner;
};


export type MutationCreateInHouseArgs = {
  input: InputInHouse;
};


export type MutationCreateLeagueArgs = {
  input: InputLeague;
};


export type MutationCreateSportArgs = {
  input: InputSport;
};


export type MutationCreateUserRoleTypeArgs = {
  name: Scalars['String'];
};


export type MutationDeleteClubArgs = {
  id: Scalars['String'];
};


export type MutationDeleteFanGroupArgs = {
  id: Scalars['String'];
};


export type MutationDeleteInHouseArgs = {
  id: Scalars['String'];
};


export type MutationDeleteLeagueArgs = {
  id: Scalars['String'];
};


export type MutationDeleteSportArgs = {
  id: Scalars['String'];
};


export type MutationEditCmsUserAccessLevelArgs = {
  accessLevel: Scalars['String'];
  id: Scalars['String'];
};


export type MutationEditCmsUserProfileArgs = {
  id: Scalars['String'];
  input: InputEditCmsUserProfile;
};


export type MutationEditClubArgs = {
  id: Scalars['String'];
  input: InputClub;
};


export type MutationEditFanGroupArgs = {
  id: Scalars['String'];
  input: InputFanGroup;
};


export type MutationEditInHouseArgs = {
  id: Scalars['String'];
  input: InputInHouse;
};


export type MutationEditLeagueArgs = {
  id: Scalars['String'];
  input: InputLeague;
};


export type MutationEditSportArgs = {
  id: Scalars['String'];
  input: InputSport;
};


export type MutationResendInviteCmsUserArgs = {
  email: Scalars['String'];
};


export type MutationSetFeaturedGameArgs = {
  objectID: Scalars['String'];
};


export type MutationSetLivestreamLiveArgs = {
  id: Scalars['String'];
};

export type MutationResult = {
  __typename?: 'MutationResult';
  objectID?: Maybe<Scalars['String']>;
  objectType?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  timestamp?: Maybe<Scalars['Float']>;
};

export type Query = {
  __typename?: 'Query';
  getCMSUser?: Maybe<CmsUser>;
  getCMSUsers: CmsUsers;
  getClub?: Maybe<Club>;
  getClubs: Clubs;
  getFanGroup?: Maybe<FanGroup>;
  getFanGroups: FanGroups;
  getGamePartners: GamePartners;
  getInHouse?: Maybe<InHouse>;
  getInHouses: InHouses;
  getLeague?: Maybe<League>;
  getLeagues: Leagues;
  getLockerRoom?: Maybe<LockerRoom>;
  getLockerRooms: LockerRooms;
  getSport?: Maybe<Sport>;
  getSports: Sports;
  getUser?: Maybe<User>;
  getUsers: Users;
};


export type QueryGetCmsUserArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetClubArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetFanGroupArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetInHouseArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetLeagueArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetLockerRoomArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetSportArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryGetUserArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type Sport = {
  __typename?: 'Sport';
  Avatar: Media;
  CoverPhoto: Media;
  Icon?: Maybe<Media>;
  createdAt?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  status: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
};

export type Sports = {
  __typename?: 'Sports';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Sport>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  Avatar?: Maybe<Media>;
  ZipCode?: Maybe<ZipCode>;
  createdAt?: Maybe<Scalars['Float']>;
  emailAddress: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  lastName?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  uid: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
  username: Scalars['String'];
  zipCode?: Maybe<Scalars['String']>;
};

export type UserRole = {
  __typename?: 'UserRole';
  User: User;
  createdAt?: Maybe<Scalars['Float']>;
  group: Scalars['String'];
  groupID: Scalars['String'];
  groupType: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  isPrimaryOwner?: Maybe<Scalars['Boolean']>;
  lockerRoomID: Scalars['String'];
  role: Scalars['String'];
  status: Scalars['String'];
  uid: Scalars['String'];
  updatedAt?: Maybe<Scalars['Float']>;
  userID: Scalars['String'];
};

export type UserRolesInLockerRoom = {
  __typename?: 'UserRolesInLockerRoom';
  Managers: Array<UserRole>;
  Owners: Array<UserRole>;
  Supporters: Array<UserRole>;
};

export type Users = {
  __typename?: 'Users';
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<User>>;
  next?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type ZipCode = {
  __typename?: 'ZipCode';
  city: Scalars['String'];
  country: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  state: Scalars['String'];
  zip: Scalars['String'];
};

export type CreateClubMutationVariables = Exact<{
  input: InputClub;
}>;


export type CreateClubMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type CreateLeagueMutationVariables = Exact<{
  input: InputLeague;
}>;


export type CreateLeagueMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type CreateSportMutationVariables = Exact<{
  input: InputSport;
}>;


export type CreateSportMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectType?: string | null, objectID?: string | null, success: boolean, timestamp?: number | null } };

export type EditClubMutationVariables = Exact<{
  id: Scalars['String'];
  input: InputClub;
}>;


export type EditClubMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type EditLeagueMutationVariables = Exact<{
  id: Scalars['String'];
  input: InputLeague;
}>;


export type EditLeagueMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectID?: string | null, objectType?: string | null, success: boolean, timestamp?: number | null } };

export type EditSportMutationVariables = Exact<{
  id: Scalars['String'];
  input: InputSport;
}>;


export type EditSportMutation = { __typename?: 'Mutation', result: { __typename?: 'MutationResult', objectType?: string | null, objectID?: string | null, success: boolean, timestamp?: number | null } };

export type GetClubQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetClubQuery = { __typename?: 'Query', result?: { __typename?: 'Club', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, sportIDs: Array<string>, leagueID?: string | null, Avatar?: { __typename?: 'Media', objectID: string, objectType: string, PhotoURL?: string | null } | null, CoverPhoto?: { __typename?: 'Media', objectID: string, objectType: string, PhotoURL?: string | null } | null } | null };

export type GetClubsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClubsQuery = { __typename?: 'Query', result: { __typename?: 'Clubs', count?: number | null, total?: number | null, items?: Array<{ __typename?: 'Club', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, sportIDs: Array<string>, leagueID?: string | null, Avatar?: { __typename?: 'Media', objectID: string, objectType: string, PhotoURL?: string | null } | null, CoverPhoto?: { __typename?: 'Media', objectID: string, objectType: string, PhotoURL?: string | null } | null }> | null } };

export type GetLeagueQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetLeagueQuery = { __typename?: 'Query', result?: { __typename?: 'League', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, sportIDs: Array<string>, Avatar?: { __typename?: 'Media', objectID: string, objectType: string, PhotoURL?: string | null } | null, CoverPhoto?: { __typename?: 'Media', objectID: string, objectType: string, PhotoURL?: string | null } | null } | null };

export type GetLeaguesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLeaguesQuery = { __typename?: 'Query', result: { __typename?: 'Leagues', count?: number | null, total?: number | null, next?: string | null, items?: Array<{ __typename?: 'League', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, sportIDs: Array<string>, Avatar?: { __typename?: 'Media', objectID: string, objectType: string, PhotoURL?: string | null } | null, CoverPhoto?: { __typename?: 'Media', objectID: string, objectType: string, PhotoURL?: string | null } | null }> | null } };

export type GetSportQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetSportQuery = { __typename?: 'Query', result?: { __typename?: 'Sport', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, Avatar: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null }, CoverPhoto: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } } | null };

export type GetSportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSportsQuery = { __typename?: 'Query', result: { __typename?: 'Sports', count?: number | null, total?: number | null, items?: Array<{ __typename?: 'Sport', id?: string | null, createdAt?: number | null, updatedAt?: number | null, name: string, slug: string, Avatar: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null }, CoverPhoto: { __typename?: 'Media', objectID: string, objectType: string, isSport?: boolean | null, PhotoURL?: string | null } }> | null } };


export const CreateClubDocument = gql`
    mutation createClub($input: InputClub!) {
  result: createClub(input: $input) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const CreateLeagueDocument = gql`
    mutation createLeague($input: InputLeague!) {
  result: createLeague(input: $input) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const CreateSportDocument = gql`
    mutation createSport($input: InputSport!) {
  result: createSport(input: $input) {
    objectType
    objectID
    success
    timestamp
  }
}
    `;
export const EditClubDocument = gql`
    mutation editClub($id: String!, $input: InputClub!) {
  result: editClub(id: $id, input: $input) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const EditLeagueDocument = gql`
    mutation editLeague($id: String!, $input: InputLeague!) {
  result: editLeague(id: $id, input: $input) {
    objectID
    objectType
    success
    timestamp
  }
}
    `;
export const EditSportDocument = gql`
    mutation editSport($id: String!, $input: InputSport!) {
  result: editSport(id: $id, input: $input) {
    objectType
    objectID
    success
    timestamp
  }
}
    `;
export const GetClubDocument = gql`
    query getClub($id: String, $slug: String) {
  result: getClub(id: $id, slug: $slug) {
    id
    createdAt
    updatedAt
    name
    slug
    sportIDs
    Avatar {
      objectID
      objectType
      PhotoURL
    }
    CoverPhoto {
      objectID
      objectType
      PhotoURL
    }
    leagueID
  }
}
    `;
export const GetClubsDocument = gql`
    query getClubs {
  result: getClubs {
    count
    total
    items {
      id
      createdAt
      updatedAt
      name
      slug
      sportIDs
      Avatar {
        objectID
        objectType
        PhotoURL
      }
      CoverPhoto {
        objectID
        objectType
        PhotoURL
      }
      leagueID
    }
  }
}
    `;
export const GetLeagueDocument = gql`
    query getLeague($id: String, $slug: String) {
  result: getLeague(id: $id, slug: $slug) {
    id
    createdAt
    updatedAt
    name
    slug
    sportIDs
    Avatar {
      objectID
      objectType
      PhotoURL
    }
    CoverPhoto {
      objectID
      objectType
      PhotoURL
    }
  }
}
    `;
export const GetLeaguesDocument = gql`
    query getLeagues {
  result: getLeagues {
    count
    total
    next
    items {
      id
      createdAt
      updatedAt
      name
      slug
      sportIDs
      Avatar {
        objectID
        objectType
        PhotoURL
      }
      CoverPhoto {
        objectID
        objectType
        PhotoURL
      }
    }
  }
}
    `;
export const GetSportDocument = gql`
    query getSport($id: String, $slug: String) {
  result: getSport(id: $id, slug: $slug) {
    id
    createdAt
    updatedAt
    name
    slug
    Avatar {
      objectID
      objectType
      isSport
      PhotoURL
    }
    CoverPhoto {
      objectID
      objectType
      isSport
      PhotoURL
    }
  }
}
    `;
export const GetSportsDocument = gql`
    query getSports {
  result: getSports {
    count
    total
    items {
      id
      createdAt
      updatedAt
      name
      slug
      Avatar {
        objectID
        objectType
        isSport
        PhotoURL
      }
      CoverPhoto {
        objectID
        objectType
        isSport
        PhotoURL
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createClub(variables: CreateClubMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateClubMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateClubMutation>(CreateClubDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createClub', 'mutation');
    },
    createLeague(variables: CreateLeagueMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateLeagueMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateLeagueMutation>(CreateLeagueDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createLeague', 'mutation');
    },
    createSport(variables: CreateSportMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateSportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateSportMutation>(CreateSportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createSport', 'mutation');
    },
    editClub(variables: EditClubMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditClubMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditClubMutation>(EditClubDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'editClub', 'mutation');
    },
    editLeague(variables: EditLeagueMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditLeagueMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditLeagueMutation>(EditLeagueDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'editLeague', 'mutation');
    },
    editSport(variables: EditSportMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditSportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditSportMutation>(EditSportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'editSport', 'mutation');
    },
    getClub(variables?: GetClubQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetClubQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetClubQuery>(GetClubDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getClub', 'query');
    },
    getClubs(variables?: GetClubsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetClubsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetClubsQuery>(GetClubsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getClubs', 'query');
    },
    getLeague(variables?: GetLeagueQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLeagueQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLeagueQuery>(GetLeagueDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLeague', 'query');
    },
    getLeagues(variables?: GetLeaguesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLeaguesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLeaguesQuery>(GetLeaguesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLeagues', 'query');
    },
    getSport(variables?: GetSportQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetSportQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSportQuery>(GetSportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSport', 'query');
    },
    getSports(variables?: GetSportsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetSportsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSportsQuery>(GetSportsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSports', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;