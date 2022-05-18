
Lists of all available requests and what they are return.

# Auth
____
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
- *OK/200*
```json
{
    "message": "Successfully logged in.",
    "data": {
        "user": {
            "username": "username",
            "email": "email@domain.com",
            "type": "USERTYPE",
            "courses": null, // user courses array
            "avatarPath": null // avatar storing path
        },
        "tokenPair": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNTJkZDQ4MC0zMGIyLTQ2NGUtYTFmMy0wNjAyZGMxNzkzN2IiLCJpYXQiOjE2NTI3NTA1NDN9.gGLUeTmVTbPAZiplH2Ucl_7owWmpsT19E4Kwc042fgM",
            "refreshToken": "93a7c215-b378-48d8-862c-0f09c33c3dc5"
        }
    }
}
```

* *Bad Request/400 - Invalid creds*
```json
{
    "message": "Invalid username or password"
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
	"type": "USERTYPE",
}
```

- *OK/200*
```json
{
    "message": "Successfully register."
}
```

- *Conflict/409* - *User already exist.*
```json
{
    "message": "User already exist"
}
```

- *Bad request/400* - Something not provided.
```json
{
    "message": "Some or one of require field doesn't provided."
}
```

## GET: /auth/logout
Log out from account.

### Request
Require: Bearer Token.

### Response
- *OK/200*
```json
{
  "message": "Successfully logged out"
}
```

- *Unauthorized/401* - Not logged in
```json
{
	"message": "Log in to your account."
}
```

# User
____
### GET: /user/get
Get info about logged in user

### Request
Require: Bearer Token.

### Response
- *OK/200*
```json
{
    "message": "User data returned successfully",
    "data": {
        "user": {
            "username": "username",
            "email": "email@domain.com",
            "type": "USERTYPE",
            "courses": null, // user courses array
            "avatarPath": null // avatar storing path
        }
    }
}
```

- *Not Found/404* - *User not found.*
```json
{
	"message": "No such user"
}
```

- *Unauthorized/401* - Not logged in
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
    "newUsername": "name"
}
```

- *OK/200*
```json
{
	"message": "Username was successfully updated",
}
```

- *Not Found/404* - *User not found.*
```json
{
	"message": "No such user"
}
```

- *Unauthorized/401* - Not logged in
```json
{
	"message": "Log in to your account."
}
```

- *Bad request/400* - Something not provided.
```json
{
    "message": "Some or one of require field doesn't provided."
}
```

## PATCH: /user/updateUserEmail
Change email.

### Request
Require: Bearer Token.

```json
{
    "newEmail": "name"
}
```

- *OK/200*
```json
{
	"message": "Email was successfully updated",
}
```

- *Not Found/404* - *User not found.*
```json
{
	"message": "No such user"
}
```

- *Unauthorized/401* - Not logged in
```json
{
	"message": "Log in to your account."
}
```

- *Bad request/400* - Something not provided.
```json
{
    "message": "Some or one of require field doesn't provided."
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
- *OK/200*
```json
{
	"message": "Avatar updated successfully",
}
```

- *Not Found/404* - *User not found*
```json
{
	"message": "No such user"
}
```

- *Unauthorized/401* - *Not logged in*
```json
{
	"message": "Log in to your account."
}
```

*Bad request/400* - *Something not provided*
```json
{
    "message": "Some or one of require field doesn't provided."
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

- *OK/200*
```json
{
	"message": "Password was updated successfully",
}
```

- *Not Found/404* - *User not found*
```json
{
	"message": "No such user"
}
```

- *Unauthorized/401* - *Not logged in*
```json
{
	"message": "Log in to your account."
}
```

*Bad request/400* - Something not provided.
```json
{
    "message": "Some or one of require field doesn't provided."
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
- *OK/200*
```json
{
	"message": "Successfully subscribe",
}
```

- *Unauthorized/401* - Not logged in
```json
{
	"message": "No such user"
}
```

- *Bad request/400* - *Something not provided*
```json
{
    "message": "Some or one of require field doesn't provided."
}
```

- *Not Found/404* - *Course not found*
```json
{
	"message": "Course doesn't exist."
}
```

- *Not Found/404* - *User not found.*
```json
{
	"message": "No such user"
}
```

*Bad Request/400 - Invalid user type*
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
- *OK/200*
```json
{
	"message": "Successfully subscribe",
}
```

- *Unathorized/401* - *Not logged in*
```json
{
	"message": "No such user"
}
```

- *Bad request/400* - *Something not provided.*
```json
{
    "message": "Some or one of require field doesn't provided."
}
```

- *Not Found/404* - *Course not found*
```json
{
	"message": "Course doesn't exist."
}
```

- *Not Found/404 - User not found.*
```json
{
	"message": "No such user"
}
```

- Bad request/400 - *Invalid user type*
```json
{
	"message": "This course not avaliable"
}
```

# Course
_____
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
- *OK/200*
```json
{
	"message": "Course created successfully"
}
```

- *Conflict/409 - Course already exist*
```json
{
	"message": "Similar course already exist"
}
```

- *Bad request/400 - Something not provided*
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

- *Bad request/400 - Something not provided*
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

## GET: /course/get/id/:courseId
Get course by courseId

### Response
- OK/200
```json
{
	"message": "Course returned successfully",
    "data": {
        "id": "course id",
        "name": "course name",
        "description": "course description",
        "studentCount": 0,
        "author": "course author"
    }
}
```

- *Bad request/400 - Something not provided*
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
    "message": "Course returned successfully",
    "data": [
        {
            "id": "078ac9ec-d80e-465f-b460-115466dba709",
            "name": "test",
            "description": "test course",
            "studentCount": 0,
            "author": "admin"
        }
    ]
}
```

- *Bad request/400 - Something not provided*
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
    "message": "Course returned successfully",
    "data": [
        {
            "id": "078ac9ec-d80e-465f-b460-115466dba709",
            "name": "test",
            "description": "test course",
            "studentCount": 0,
            "author": "admin"
        }
    ]
}
```

- *Bad request/400 - Something not provided*
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
	"message": "Course deleted successfully",
}
```

- *Bad request/400 - Something not provided*
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
____
## POST: /video/upload
Upload video on course

### Request
| KEY          | VALUE    |
| ------------ | -------- |
| video        | mp4 file |
| lessonNumber | number   |
| courseId     | string   |
| videoName    | string |

### Response
- OK/200
```json
{
    "message": "Video uploaded successfully.",
    "data": {
        "statusCode": 200,
        "message": "Video uploaded successfully.",
        "success": true,
        "data": {
            "name": "super video",
            "path": "/server/dist/public/texts/testvideo.mp4",
            "lessonNumber": 1,
            "courseId": "078ac9ec-d80e-465f-b460-115466dba709"
        }
    }
}
```

- *Bad Request/400 - Video file not provided*
```json
{
	"message": "Files not provided"
}
```

- *Bad request/400 - Something not provided*
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

- *Bad request/400 - Something not provided*
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
____
## POST: /text/upload
Upload text on course

### Request
| KEY          | VALUE    |
| ------------ | -------- |
| text        | markdown file |
| lessonNumber | number   |
| courseId     | string   |
| videoName    | string |

### Response
- OK/200
```json
{
    "message": "Video uploaded successfully.",
    "data": {
        "statusCode": 200,
        "message": "Text uploaded successfully.",
        "success": true,
        "data": {
            "name": "super text",
            "path": "/server/dist/public/texts/supettext.md",
            "lessonNumber": 2,
            "courseId": "078ac9ec-d80e-465f-b460-115466dba709"
        }
    }
}
```

- *Bad Request/400 - Video file not provided*
```json
{
	"message": "Files not provided"
}
```

- *Bad request/400 - Something not provided*
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

- *Bad request/400 - Something not provided*
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

