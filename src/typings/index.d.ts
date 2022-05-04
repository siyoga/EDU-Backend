export interface ISafeUser {
  username: string;
  email: string;
}

export interface ISafeUserData {
  user: ISafeUser;
  tokenPair?: ISafeToken;
}

export interface ISafeToken {
  token: string;
  refreshToken: string;
}

export interface ISafeTokenData {
  token: ISafeToken;
}

export interface ICryptToken {
  userId: string;
}

export interface ISafeCourseData {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  author: string;
}
