export const ServerIssues = {
  UserErrors: {
    statusCode: 409,
    message: 'User already exist.',
    success: false,
  },

  MethodErrors: {
    statusCode: 400,
    notValid: 'Not a valid method.',
  },

  ServerError: {
    statusCode: 500,
    message: 'An error occured',
    success: false,
  },

  LoginToAccount: {
    statusCode: 401,
    message: 'Log in to your account.',
    success: false,
  },

  RequireFieldNotProvided: {
    statusCode: 400,
    message: "Some or one of require field doesn't provided.",
    success: false,
  },

  DoNotHavePermission: {
    statusCode: 400,
    message: "You don't have permission for this",
    success: false,
  },

  FilesNotProvided: {
    statusCode: 400,
    message: 'Files not provided',
    success: false,
  },

  RangeHeadersRequire: {
    statusCode: 400,
    message: 'Requires Range Headers',
    success: false,
  },
};

export const DatabaseIssues = {
  // USER
  NoSuchUser: {
    statusCode: 404,
    message: 'No such user',
    success: false,
  },

  InvalidCreds: {
    statusCode: 400,
    message: 'Invalid username or password',
    success: false,
  },

  UserAlreadyExist: {
    statusCode: 409,
    message: 'User already exist',
    success: false,
  },

  TokenNotFound: {
    statusCode: 404,
    message: "Refresh token isn't already exist.",
    success: false,
  },

  // COURSE
  CourseNotFound: {
    statusCode: 404,
    message: "Course doesn't exist.",
    success: false,
  },

  CourseAlreadyExist: {
    statusCode: 409,
    message: 'Similar course already exist',
    success: false,
  },

  CourseNotAvaliable: {
    statusCode: 404,
    message: 'This course not avaliable',
    success: false,
  },

  CourseAlreadySub: {
    statusCode: 400,
    message: 'You are already subscribed to this course.',
    success: false,
  },

  // VIDEO
  VideoIsNotExist: {
    statusCode: 404,
    message: "Video isn't exist",
    success: false,
  },

  VideoAlreadyExist: {
    statusCode: 409,
    message: 'Similar video already exist',
    success: false,
  },

  FileCannotBeUpload: {
    statusCode: 409,
    message: "File can't be upload",
    success: false,
  },

  // TEXT
  TextIsNotExist: {
    statusCode: 404,
    message: "Text isn't exist",
    success: false,
  },

  TextAlreadyExist: {
    statusCode: 409,
    message: 'Similar text already exist',
    success: false,
  },

  TextCannotBeUpload: {
    statusCode: 409,
    message: "Text can't be upload",
    success: false,
  },
};
