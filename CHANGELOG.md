# Changelog

All changes to XM WEB CLIENT project will be documented in this file.

## Version 3

### [3.14] - 2021-05-18
### Update
- Update router for app
- Update login page
### Add
- Add Captcha to forget password form
- Add login with ERP feature

### [3.13] - 2021-05-18
### Fix
- Fix issue with ERP integration.

### [3.12] - 2021-05-06
### Update
- Add 'Accept-Language' header to API requests.
- Update image large URL.
- Update size of language icon.
### Fix
- Show year messages date.
- Fix user can add html tag to chatbox

### [3.11] - 2021-05-04
### Add
- Add Japanese and Portuguese translations. 
### Update
- Update Spanish translation.
### Fix
- Hide "Updating" dialog correctly on mobile devices.

### [3.10] - 2021-04-28
### Added
- Messages searching functionality.
- Shows dialog to when app is loading.
### Update
- Chats list now loads in batchs.
### Fix
- Fix phone does not working when camera is damaged.

### [3.9] - 2021-04-19
### Added
- Added languages: Chinese Simplified and Chinese Traditional.
- Other minor fixes.

### [3.8] - 2021-04-13
### Update
- Fix issue loading previous messages on Safari.
- Fix issue when access use Private Mode on Firefox.
- Fix issue when adding messages on Safari.
- Refactor API access.

### [3.7] - 2021-03-31
### Update
- Use 'sequence' property instead of 'id.messageId', as 'offset' when getting messages.
- Eliminate any unnecessary API calls.
### Add
- Add Multiple Language.
- Add message immediately after send and display its status.
- Add draft message.

### [3.6] - 2021-03-24
### Fix
- Fix invite.
- Add email to editing room modal, change icon of attach button.

### [3.5] - 2021-03-22
### Fix
- Fix sharing screen doesn't have the sound.
- Fix user can't edit room information.
- Fix editing room modal does not display user's email.
- Fix user can attend the meeting with no camera.
### Update
- Update UI for chat input box.

### [3.4] - 2021-03-08
### Add
- Add Start Conference features.
- Display the number of unread messages on 'scroll to bottom' button when users are reviewing old messages.
### Update
- Update method for message API.
- Update structure for validate API.
- Update structure for message comment.
- Update UI for forwarding message.


### [3.3] - 2021-02-03
### Fix
- Get LA group when customer require without reloading the page.


### [3.2] - 2021-01-30
### Add
- Add video chat feature.
### Fix
- Information LA can get now.

### [3.1] - 2021-01-27
### Update
- Update UI for creating/editing group modal.
- Update UI for editing room modal.
- Update UI for editing profile modal.
### Add
- Add loading page when load web page.

## Version 2

### [2.3] - 2021-01-14
### Add
- Handle call messages in sync method.
- Add message templates for call messages.

### [2.2] - 2021-01-04
### Fix
- "Internal messages" option in Live Assistance chats now works.
- "Disable notifications" option in chats now works.

### [2.1] - 2020-12-30
### Update
- disable send button while message is being sent
- use $CI_PIPELINE_ID instead of $CI_PIPELINE_IID for project version
