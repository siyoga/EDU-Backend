Lists of all available requests and what they are return.

# Auth

---

## POST: /auth/login

Login to account.

### Request

```json
{
  "username": "login",
  "password": "password"
}
```

### Response

- _OK/200_

```json
{
  "message": "Successfully logged in.",
  "data": {
    "user": {
      "username": "username",
      "email": "email@domain.com",
      "type": "USERTYPE",
      "courses": null, // user courses array
      "avatarPath": null // avatar storing path
    },
    "tokenPair": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNTJkZDQ4MC0zMGIyLTQ2NGUtYTFmMy0wNjAyZGMxNzkzN2IiLCJpYXQiOjE2NTI3NTA1NDN9.gGLUeTmVTbPAZiplH2Ucl_7owWmpsT19E4Kwc042fgM",
      "refreshToken": "93a7c215-b378-48d8-862c-0f09c33c3dc5"
    }
  }
}
```

- _Bad Request/400 - Invalid creds_

```json
{
  "message": "Invalid username or password"
}
```

## POST: /auth/register

Register new account

### Request

```json
{
  "username": "login",
  "password": "password",
  "email": "email@domain.com",
  "type": "USERTYPE"
}
```

- _OK/200_

```json
{
  "message": "Successfully register."
}
```

- _Conflict/409_ - _User already exist._

```json
{
  "message": "User already exist"
}
```

- _Bad request/400_ - Something not provided.

```json
{
  "message": "Some or one of require field doesn't provided."
}
```

## GET: /auth/logout

Log out from account.

### Request

Require: Bearer Token.

### Response

- _OK/200_

```json
{
  "message": "Successfully logged out"
}
```

- _Unauthorized/401_ - Not logged in

```json
{
  "message": "Log in to your account."
}
```

# User

---

### GET: /user/get

Get info about logged in user

### Request

Require: Bearer Token.

### Response

- _OK/200_

```json
{
  "message": "User data returned successfully",
  "data": {
    "user": {
      "username": "username",
      "email": "email@domain.com",
      "type": "USERTYPE",
      "courses": null, // user courses array
      "avatarPath": null // avatar storing path
    }
  }
}
```

- _Not Found/404_ - _User not found._

```json
{
  "message": "No such user"
}
```

- _Unauthorized/401_ - Not logged in

```json
{
  "message": "Log in to your account."
}
```

## PATCH: /user/updateUsername

Change username.

### Request:

Require: Bearer Token.

```json
{
  "newUsername": "name"
}
```

- _OK/200_

```json
{
  "message": "Username was successfully updated"
}
```

- _Not Found/404_ - _User not found._

```json
{
  "message": "No such user"
}
```

- _Unauthorized/401_ - Not logged in

```json
{
  "message": "Log in to your account."
}
```

- _Bad request/400_ - Something not provided.

```json
{
  "message": "Some or one of require field doesn't provided."
}
```

## PATCH: /user/updateUserEmail

Change email.

### Request

Require: Bearer Token.

```json
{
  "newEmail": "name"
}
```

- _OK/200_

```json
{
  "message": "Email was successfully updated"
}
```

- _Not Found/404_ - _User not found._

```json
{
  "message": "No such user"
}
```

- _Unauthorized/401_ - Not logged in

```json
{
  "message": "Log in to your account."
}
```

- _Bad request/400_ - Something not provided.

```json
{
  "message": "Some or one of require field doesn't provided."
}
```

## PATCH: /user/updateAvatar

Change avatar

### Request

Require: Bearer Token

| KEY    | VALUE    |
| ------ | -------- |
| userId | string   |
| avatar | png file |

### Response

- _OK/200_

```json
{
  "message": "Avatar updated successfully"
}
```

- _Not Found/404_ - _User not found_

```json
{
  "message": "No such user"
}
```

- _Unauthorized/401_ - _Not logged in_

```json
{
  "message": "Log in to your account."
}
```

_Bad request/400_ - _Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided."
}
```

## PATCH: /user/updateUserPassword

Change password

### Request

Require: Bearer Token

```json
	"oldPassword": "oldPassword",
	"newPassword": "newPassword"
```

- _OK/200_

```json
{
  "message": "Password was updated successfully"
}
```

- _Not Found/404_ - _User not found_

```json
{
  "message": "No such user"
}
```

- _Unauthorized/401_ - _Not logged in_

```json
{
  "message": "Log in to your account."
}
```

_Bad request/400_ - Something not provided.

```json
{
  "message": "Some or one of require field doesn't provided."
}
```

## PATCH: /user/subscribeOnCourse

Subscribe user on course

### Request

Require: Bearer Token

```json
{
  "courseId": "courseId"
}
```

### Response

- _OK/200_

```json
{
  "message": "Successfully subscribe"
}
```

- _Unauthorized/401_ - Not logged in

```json
{
  "message": "No such user"
}
```

- _Bad request/400_ - _Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided."
}
```

- _Not Found/404_ - _Course not found_

```json
{
  "message": "Course doesn't exist."
}
```

- _Not Found/404_ - _User not found._

```json
{
  "message": "No such user"
}
```

_Bad Request/400 - Invalid user type_

```json
{
  "message": "This course not avaliable"
}
```

## PATCH: /user/unsubscribeOnCourse

Unsubscribe user on course

### Request

Require: Bearer Token

```json
{
  "courseId": "courseId"
}
```

### Response

- _OK/200_

```json
{
  "message": "Successfully subscribe"
}
```

- _Unathorized/401_ - _Not logged in_

```json
{
  "message": "No such user"
}
```

- _Bad request/400_ - _Something not provided._

```json
{
  "message": "Some or one of require field doesn't provided."
}
```

- _Not Found/404_ - _Course not found_

```json
{
  "message": "Course doesn't exist."
}
```

- _Not Found/404 - User not found._

```json
{
  "message": "No such user"
}
```

- Bad request/400 - _Invalid user type_

```json
{
  "message": "This course not avaliable"
}
```

# Course

---

## POST: /course/create

Create course

### Request

```json
{
	"name": "course name"
	"description": "course desc"
	"author": "author"
	"userType" "TEACHER"
}
```

### Response

- _OK/200_

```json
{
  "message": "Course created successfully"
}
```

- _Conflict/409 - Course already exist_

```json
{
  "message": "Similar course already exist"
}
```

- _Bad request/400 - Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided"
}
```

- Bad request/400 - User don't have permission, wrong userType

```json
{
  "message": "You don't have permission for this"
}
```

## PATCH /course/update

Update course information

### Request

```json
{
  "courseId": "course id",
  "newDescription": "new description",
  "oldDescription": "old description"
}
```

### Response

- OK/200

```json
{
  "message": "Course updated successfully"
}
```

- _Bad request/400 - Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided"
}
```

- Not Found/404 - Course not found

```json
{
  "message": "Course doesn't exist."
}
```

## GET: /course/get/all

Get all courses in system

- OK/200

```json
{
  "message": "Course returned successfully",
  "data": [
    {
      "id": "course id",
      "name": "course name",
      "description": "course description",
      "studentCount": 0,
      "author": "course author"
    }
  ]
}
```

- Not Found/404 - Course not found

```json
{
  "message": "Course doesn't exist."
}
```

## GET: /course/get/id/:courseId

Get course by courseId

### Response

- OK/200

```json
{
  "message": "Course returned successfully",
  "data": {
    "id": "course id",
    "name": "course name",
    "description": "course description",
    "studentCount": 0,
    "author": "course author"
  }
}
```

- _Bad request/400 - Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided"
}
```

- Not Found/404 - Course not found

```json
{
  "message": "Course doesn't exist."
}
```

### GET: /course/get/name/:partcoursename

Search course by part of full name

### Response

- OK/200

```json
{
  "message": "Course returned successfully",
  "data": [
    {
      "id": "078ac9ec-d80e-465f-b460-115466dba709",
      "name": "test",
      "description": "test course",
      "studentCount": 0,
      "author": "admin"
    }
  ]
}
```

- _Bad request/400 - Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided"
}
```

- Not Found/404 - Course not found

```json
{
  "message": "Course doesn't exist."
}
```

## GET: /course/get/author/:author

Get courses by specific author

### Response

- OK/200

```json
{
  "message": "Course returned successfully",
  "data": [
    {
      "id": "078ac9ec-d80e-465f-b460-115466dba709",
      "name": "test",
      "description": "test course",
      "studentCount": 0,
      "author": "admin"
    }
  ]
}
```

- _Bad request/400 - Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided"
}
```

- Not Found/404 - Course not found

```json
{
  "message": "Course doesn't exist."
}
```

## DELETE: /course/delete

Delete specific course

### Request

```json
{
  "courseId": "course id"
}
```

### Response

- OK/200

```json
{
  "message": "Course deleted successfully"
}
```

- _Bad request/400 - Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided"
}
```

- Not Found/404 - Course not found

```json
{
  "message": "Course doesn't exist."
}
```

# Video

---

## POST: /video/upload

Upload video on course

### Request

| KEY          | VALUE    |
| ------------ | -------- |
| video        | mp4 file |
| lessonNumber | number   |
| courseId     | string   |
| videoName    | string   |

### Response

- OK/200

```json
{
  "message": "Video uploaded successfully.",
  "data": {
    "statusCode": 200,
    "message": "Video uploaded successfully.",
    "success": true,
    "data": {
      "name": "super video",
      "path": "/server/dist/public/texts/testvideo.mp4",
      "lessonNumber": 1,
      "courseId": "078ac9ec-d80e-465f-b460-115466dba709"
    }
  }
}
```

- _Bad Request/400 - Video file not provided_

```json
{
  "message": "Files not provided"
}
```

- _Bad request/400 - Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided"
}
```

- Conflict/409 - Video already exist

```json
{
  "message": "Similar video already exist"
}
```

## GET: /video/get/:courseId/:lessonNumber

Get video

### Response

- OK/206 - Partial message

- Bad Request/400 - Provide range headers

```json
{
  "message": "Requires range headers"
}
```

- Not Found/404 - Video not found

```json
{
  "message": "Video isn't exist"
}
```

## DELETE: /video/delete

Delete video

### Request

```json
{
  "courseId": "course id",
  "lessonNumber": "lesson number"
}
```

### Response

- OK/200

```json
{
	"message": "Video deleted successfully.
}
```

- _Bad request/400 - Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided"
}
```

- Not Found/404 - Video not found

```json
{
  "message": "Video isn't exist"
}
```

## PATCH: /video/update

Update video information

### Request

```json
{
  "courseId": "course id",
  "lessonNumber": "lesson number",
  "newName": "new video name",
  "newLessonNumber": 1 // new lesson number
}
```

### Response

- OK/200

```json
{
  "message": "Video updated successfully"
}
```

- Not Found/404 - Video not found

```json
{
  "message": "Video isn't exist"
}
```

- Conflict/409 - Same video name/video already exist

```json
{
  "message": "Similar video already exist"
}
```

# Text

---

## POST: /text/upload

Upload text on course

### Request

| KEY          | VALUE         |
| ------------ | ------------- |
| text         | markdown file |
| lessonNumber | number        |
| courseId     | string        |
| videoName    | string        |

### Response

- OK/200

```json
{
  "message": "Video uploaded successfully.",
  "data": {
    "statusCode": 200,
    "message": "Text uploaded successfully.",
    "success": true,
    "data": {
      "name": "super text",
      "path": "/server/dist/public/texts/supettext.md",
      "lessonNumber": 2,
      "courseId": "078ac9ec-d80e-465f-b460-115466dba709"
    }
  }
}
```

- _Bad Request/400 - Video file not provided_

```json
{
  "message": "Files not provided"
}
```

- _Bad request/400 - Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided"
}
```

- Conflict/409 - Video already exist

```json
{
  "message": "Similar text already exist"
}
```

## GET: /text/get/:courseId/:lessonNumber

Get text

### Response

- OK/200 - Partial message

```json
{
	"message": "Text found successfully."
	"data": "markdown text"
}
```

- Bad Request/400 - Provide range headers

```json
{
  "message": "Requires range headers"
}
```

- Not Found/404 - Video not found

```json
{
  "message": "Text isn't exist"
}
```

## DELETE: /video/delete

Delete text

### Request

```json
{
  "courseId": "course id",
  "lessonNumber": "lesson number"
}
```

### Response

- OK/200

```json
{
	"message": "Text deleted successfully.
}
```

- _Bad request/400 - Something not provided_

```json
{
  "message": "Some or one of require field doesn't provided"
}
```

- Not Found/404 - Video not found

```json
{
  "message": "Text isn't exist"
}
```

## PATCH: /video/update

Update video information

### Request

```json
{
  "courseId": "course id",
  "lessonNumber": "lesson number",
  "newName": "new text name",
  "newLessonNumber": 1 // new text number
}
```

### Response

- OK/200

```json
{
  "message": "Text updated successfully"
}
```

- Not Found/404 - Video not found

```json
{
  "message": "Text isn't exist"
}
```

- Conflict/409 - Same video name/video already exist

```json
{
  "message": "Similar text already exist"
}
```
