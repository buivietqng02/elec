## Content

1. [Get chat list by user](#1-get-chat-list-by-user)
2. [Get messages by chat](#1-get-messages-by-chat)
3. [Send a message](#3-send-a-message)
4. [Edit a message](#4-edit-a-message)
5. [Delete a message](#5-delete-a-message)
6. [Forward a message](#6-forward-a-message)

## 1. Get chat list by user

### 1.1 POST /xm/api/validate

Return chats list and user information for requesting user.

### 1.2 Headers

| Name | Description |
| ------ | ------ |
| `X-Authorization-Token` | (Required) User's authorization token returned by server after a successful login. |

### 1.3 Parameters

None.

### 1.4 Sample

**Request**:

```shell
curl --location --request POST 'https://xm.iptp.dev/xm/api/validate' \
--header 'X-Authorization-Token: j9lehdHFaIpxGBFsDgX...'
```

**Response**:

Successful HTTP status: `200 (Ok)`

<details><summary>See response body</summary>
<p>

```json
{
    "erp_url": "https://erp.iptp.net/erp/dispatcher",
    "user": {
        "id": "0bbac78ae7d5",
        "name": "André @ IPTP",
        "email": "andreb@iptp.pe",
        "avatartype": "jpg",
        "blocked": false,
        "resetcode": "",
        "url": "",
        "status": 0,
        "selected": false,
        "userPreferences": "{\"body_fz\":\"14px\",\"body_bg_theme\":\"body_theme_blue\"}",
        "lastActivityAt": "2021-02-26T01:05:05.648+00:00",
        "department": {
            "departmentId": 1,
            "departmentName": "Support (NCC)"
        },
        "guest": false
    },
    "chats": [
        {
            "id": "97c0a4f5dbc7",
            "partner": {
                "id": "8e2d2b1a9b5c",
                "name": "Alex",
                "email": "sa@iptp.net"
            },
            "subject": null,
            "groupAvatarType": null,
            "lastMessage": "we are online",
            "updated": "2021-02-18T14:22:12.783+00:00",
            "unreadMessages": 0,
            "ticket": null,
            "admin": false,
            "members": [],
            "guest": null,
            "sender": false,
            "channel": false,
            "group": false,
            "liveAssistance": false
        },
        {
            "id": "c89e8c37c3b6",
            "partner": null,
            "subject": "Bugs & Features",
            "groupAvatarType": "",
            "lastMessage": "🙏🙏🙏",
            "updated": "2021-01-15T00:24:20.374+00:00",
            "unreadMessages": 0,
            "ticket": null,
            "admin": false,
            "members": [],
            "guest": null,
            "sender": false,
            "channel": false,
            "group": true,
            "liveAssistance": false
        }
    ]
}
```
</p>
</details>

### 1.5 Notes

- Please note that if chat is not a group, you can get chat title from `partner` property, as well as chat avatar.
- This response doesn't include chat members. You can get chat members for each chat (when necessary) from `GET /xm/api/chats/{chatId}`.

## 2. Get messages by chat

### 2.1 GET /xm/api/messages

Return 20 last messages of the specified chat.

### 2.2 Headers

| Name | Description |
| ------ | ------ |
| `X-Authorization-Token` | (Required) User's authorization token returned by server after a successful login. |

### 2.3 Parameters

| Name | Type | Description |
| ------ | ------ | ------ |
| `chatId` | string | (Required) Id of the chat from which messages will be returned, it must be a valid id. |
| `offset` | long | (Required) Id of the message from which previous messages will be returned. If not specified, default value is 0. |
| `type` | int | (Optional) Message type, allowed values are: 2 (images), 3 (audios), 4 (videos) and 20 (files). |
| `search` | string | (Optional) Search keyword. If provided, must be at least 3 characters length. |

### 2.4 Samples

**Request**

Getting 20 last messages in chat with id = 0e78b6b7045r.

```shell
curl --location --request GET 'https://xm.iptp.dev/xm/api/messages?offset=0&chatId=0e78b6b7045r' \
--header 'X-Authorization-Token: PY5lLVX9O4enjxfc...'
```
Getting 20 last messages in chat with id = 0e78b6b7045r sent before message with id = 928.

```shell
curl --location --request GET 'https://xm.iptp.dev/xm/api/messages?offset=928&chatId=0e78b6b7045r' \
--header 'X-Authorization-Token: PY5lLVX9O4enjxfc...'
```

Getting 20 last image (type = 2) messages in chat id with id = 0e78b6b7045r.

```shell
curl --location --request GET 'https://xm.iptp.dev/xm/api/messages?chatId=0e78b6b7045r&type=2' \
--header 'X-Authorization-Token: PY5lLVX9O4enjxfc...'
```

Searching messages including `docker` keyword in chat with id = 0e78b6b7045r.

```shell
curl --location --request GET 'https://xm.iptp.dev/xm/api/messages&chatId=0e78b6b7045r&search=docker' \
--header 'X-Authorization-Token: PY5lLVX9O4enjxfc...'
```

**Response**

Successful HTTP status: `200 (Ok)`

<details><summary>See response body</summary>
<p>

```json
{
    "status": 0,
    "message": "Success",
    "errors": [],
    "data": {
        "messages": [
            {
                "id": {
                    "messageId": 116,
                    "chatId": "0e78b6b7045r"
                },
                "sender": {
                    "id": 4,
                    "name": "André",
                    "avatartype": "jpg",
                    "selected": false,
                    "lastActivityAt": "2020-10-03T20:35:49.277+0000"
                },
                "message": "please create docker containers",
                "msgDate": "2020-10-01T22:03:20.721+0000",
                "type": 1,
                "uploaded": false,
                "updated": false,
                "deleted": false,
                "internal": false
            },
            {
                "id": {
                    "messageId": 101,
                    "chatId": "0e78b6b7045r"
                },
                "sender": {
                    "id": 4,
                    "name": "André",
                    "avatartype": "jpg",
                    "selected": false,
                    "lastActivityAt": "2020-10-03T20:35:49.277+0000"
                },
                "message": "dockerized xm is running on dev node",
                "msgDate": "2020-09-29T20:35:40.889+0000",
                "type": 1,
                "uploaded": false,
                "updated": false,
                "deleted": false,
                "internal": false
            }
        ]
    }
}
```
<p>
</details>

## 3. Send a message
### 3.1 POST /xm/api/chats/{chatId}/messages
Send a message to the specified chat.
| Name | Type | Description |
| ------ | ------ | ------ |
| `chatId` | string | (Required) Id of the chat room where the message will be sent. |

### 3.2 Headers
| Name | Description |
| ------ | ------ |
| `X-Authorization-Token` | (Required) User's authorization token returned by server after a successful login. |

### 3.3 Parameters

JSON request body:

```json
{
    "message": "this is a message!",
    "internal": false,
    "quotedMessageId": null
}
```
| Name | Type | Description |
| ------ | ------ | ------ |
| `message` | string | (Required) Text message. |
| `internal` | boolean | (Optional, default: false) Whether the message is internal or not. It will only work on Live Assistance chats, otherwise it will be ignored.|
| `quotedMessageId` | string | (Optional, default: null) Id of the quoted messaged (to comment it). |
### 3.4 Sample
**Request:**

```shell
curl --location --request POST 'https://xm.iptp.dev/xm/api/chats/f61f50126077/messages' \
--header 'X-Authorization-Token: j9lehdHFaIpxGBFsDgX...' \
--header 'Content-Type: application/json' \
--data-raw '{
    "message": "this is a message!",
    "internal": false,
    "quotedMessageId": null
}'
```
**Response**

Successful HTTP status: `201 (Created)`
```json
{
    "chatId": "f61f50126077",
    "messageId": "97c0a4f5dbc7"
}
```

## 4. Edit a message
### 4.1 PUT /xm/api/chats/{chatId}/messages/{messageId}
Update the specified message on the specified chat.
| Name | Type | Description |
| ------ | ------ | ------ |
| `chatId` | string | (Required) Id of the chat room to which the specified message belongs. |
| `messageId` | string | (Required) Id of the message to update. |

### 4.2 Headers
| Name | Description |
| ------ | ------ |
| `X-Authorization-Token` | (Required) User's authorization token returned by server after a successful login. |

### 4.3 Parameters

PLAIN TEXT request body:

```plaintext
hello world
```
Just the new message.
### 4.4 Sample
Request:

```shell
curl --location --request PUT 'https://xm.iptp.dev/xm/api/chats/f61f50126077/messages/30' \
--header 'X-Authorization-Token: j9lehdHFaIpxGBFsDgX...' \
--header 'Content-Type: text/plain' \
--data-raw 'hello world'
```
Response:
`HTTP 204 (No Content)`

## 5. Delete a message
### 5.1 DELETE /xm/api/chats/{chatId}/messages/{messageId}
Delete the specified message on the specified chat.
| Name | Type | Description |
| ------ | ------ | ------ |
| `chatId` | string | (Required) Id of the chat room to which the specified message belongs. |
| `messageId` | string | (Required) Id of the message to delete. |

### 5.2 Headers
| Name | Description |
| ------ | ------ |
| `X-Authorization-Token` | (Required) User's authorization token returned by server after a successful login. |

### 5.3 Parameters
None.
### 5.4 Sample
Request:

```shell
curl --location --request DELETE 'https://xm.iptp.dev/xm/api/chats/f61f50126077/messages/30' \
--header 'X-Authorization-Token: j9lehdHFaIpxGBFsDgX...'
```
Response:
`HTTP 204 (No Content)`

## 6. Forward a message
### 6.1 POST /xm/api/messages/forward

Forward a message from a source chat to a destination chat (previously `/xm/api/forwardmsg`).

### 6.2 Headers

| Name | Description |
| ------ | ------ |
| `X-Authorization-Token` | (Required) User's authorization token returned by server after a successful login. |

### 6.3 Parameters

JSON request body:

```json
{
    "sourceChatId": "97c0a4f5dbc7",
    "messageId": "898ad50299e8",
    "destChatId": "d056d1b6a136"
}
```

| Name | Type | Description |
| ------ | ------ | ------ |
| `sourceChatId` | string | (Required) Id of the source chat from where message will be forwarded. |
| `messageId` | string | (Required) Id of the message. |
| `destChatId` | string | (Required) Id of the destination chat to where message will be forwarded. |

### 6.4 Sample

**Request:**

```shell
curl --location --request POST 'https://xm.iptp.dev/xm/api/messages/forward' \
--header 'X-Authorization-Token: j9lehdHFaIpxGBFsDgX...' \
--header 'Content-Type: application/json' \
--data-raw '{
    "sourceChatId": "97c0a4f5dbc7",
    "messageId": "898ad50299e8",
    "destChatId": "d056d1b6a136"
}'
```

**Response:**

Successful HTTP status: `201 (Created)`
```json
{
    "chatId": "d056d1b6a136",
    "messageId": "3b71e864fd8c"
}
```
