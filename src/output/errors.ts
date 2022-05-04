export const UserErrors = {
  statusCode: 409,
  alreadyExist: 'User already exist.',
};

export const MethodErrors = {
  statusCode: 400,
  notValid: 'Not a valid method.',
};

export const InvalidPassword = {
  statusCode: 404,
  message: 'Invalid password',
  success: false,
};

export const NoSuchUser = {
  statusCode: 404,
  message: 'No such user',
  success: false,
};

export const ServerError = {
  statusCode: 500,
  message: 'An error occured',
  success: false,
};

export const UserAlreadyExist = {
  statusCode: 409,
  message: 'User already exist',
  success: false,
};

export const TokenNotFound = {
  statusCode: 404,
  message: "Refresh token isn't already exist.",
  success: false,
};

export const LoginToAccount = {
  statusCode: 401,
  message: 'Log in to your account.',
  success: false,
};

export const CourseNotFound = {
  statusCode: 404,
  message: "Course doesn't exist.",
  success: false,
};

export const CourseAlreadyExist = {
  statusCode: 409,
  message: 'Similar course already exist',
  success: false,
};

export const RequireFieldNotProvided = {
  statusCode: 400,
  message: "Email doesn't provided.",
  success: false,
};
