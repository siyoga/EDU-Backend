export interface ISafeUser {
  username: string;
  email: string;
}

export interface ISafeData {
  user: ISafeUser;
  jwt?: string;
}
