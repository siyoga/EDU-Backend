export interface ISafeUser {
  username: string;
  email: string;
  type: string;
  courses: string[];
  avatarPath: string;
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
  createdAt: string;
}

export interface ISafeVideoData {
  name: string;
  path: string;
  lessonNumber: number;
  courseId: string;
}

export interface ISafeTextData {
  name: string;
  path: string;
  lessonNumber: number;
  courseId: string;
}
