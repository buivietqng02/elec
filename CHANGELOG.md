# Changelog

All changes to XM WEB CLIENT project will be documented in this file.

## Version 4

### [4.20] - 2022-03-21
### Add
- Log out when can not load API
- Update new chat interface (remove unecessary space, avatar, name, group the chat by same user, shortern quotedMess)
- New tag features
- Fix bug pin message (Not render pin topbar accordingly if other people pin/ unpin mess while you're in other rooms)
- Make media files dowloadable
- Fix bug in mobile - send button does not show up when just type 1 letter
- Fix bug draft message not delete when send
- Update new forward message, chat list will not show up all at once, scroll more to load
- Front-end for new search tool (NOT finished)
- Each member in a chat room has a different color for their names.


### [4.19] - 2022-03-08
### Update
- Fix "Sign in with Apple" button.
- Remove "Get it on Google Play" and "Download on the Appstore" buttons from the login page.
- Other minor changes.

### [4.18] - 2022-03-04
### Add
- Add "Sign in with Apple" functionality.

### [4.17] - 2022-02-24
### Add
- Enhanced search tool.
- New functionality: Pin a message. When you pin a message it shows up at the top of the conversation. To pin a message, just click on the three-line menu at the bottom-right of any message and select "Pin message".
### Update
- Enables play/stop of voice messages.
### Fix
- Fixes the issue that didn't show the year in date when the message was from a different year.
- Fixes the issues with scrolling to previous messages.
- Small UI fixes.

### [4.16] - 2022-01-31
### Add
- Adds the option to "bookmark" a message.
- Added 'last synced at' param to the sync method.
### Update
- Change the color of the "new messages alert".
- Other small UI/UX improvements.
### Fix
- Remove the animation of the "new messages" alert.
- Fix some issues with slide menu on mobile devices.

### [4.15] - 2022-01-21
### Add
- Now it is possible to mark a chat as a favorite, so you can filter your chats list and see only your fav chats. Just move your cursor over the chat list and you'll see the favorite icon. If you're using XM on a mobile device, please slide the chat to the left and you'll see the fav option.
### Fix
- Auto mute/unmute when someone call on conference.
- Fix bug with invite conference link.
### Update
- Other small UI/UX improvements.

### [4.14] - 2022-01-06
### Update
- Mute/unmute chats now works with mobile notifications.
- Improves browser notifications content.
- Reduces loading time while displaying full-size images.
- Improve UI for notice for new messages when scrolling up.
- Other small UI/UX improvements.
### Fix
- Fix issue: removed & edited messages not updated in the chat list.

### [4.13] - 2021-12-22
### Fix
- Fixed the bug that didn't allow special characters in the password.

### [4.12] - 2021-12-20
### Update
- Add GitLab jobs for slave node
### Fix
- Fix issue: show bagde with unread messages.
- Fix issue: copy message content without HTML tags.

### [4.11] - 2021-12-16
### Update
- Reject incoming calls when the user is in another call.
- Register SW for both dev and prod environments.
- Update styles on call window.
- Shows that a message is edited on web notifications.
- Remove logs.
### Fix
- Fixed a bug that allowed too many files to be sent at once.
- Other minor improvements.

### [4.10] - 2021-12-09
### Update
- Added group calls.
- Added view multimedia (images and files) window.
- Fixed the bug that caused repeating messages.
- Fixed the bug showing chats with new messages in the wrong order when opening XM.
- Fixed the bug that won't allow updating on iOS devices.
- Other minor improvements.

### [4.9] - 2021-11-18
### Update
- Fix refresh token bugs
- Update version on login page
- Fix repeating messages when bad connection
- Update new conference design and functions
- Fix pop up new version alert & and need to add close button
- Improve scroll to origin quoted message
- Update single chat call

### [4.8] - 2021-10-29
### Fix
- Update sidebar last message when remove last message on chat.
- Hide LagBlaster authentication button.

### [4.7] - 2021-10-28
### Update
- Fix remove last message.
- Add scroll to origin message.
- Fix bugs delete section ID after conference
- Make scrollable for market content
- Intergrate Lagblaster into XM (In progress)
- Improve some css layout

### [4.6] - 2021-10-21
### Update
- Update route /meeting.
- Add comments to refresh token code.

### [4.5] - 2021-10-15
### Update
- Improvements to XM meetings.
- Add 'Accept-Language' header to API requets on interceptor.
- Improve user upload avatar function.
### Fix
- Fix issue on sync method.

### [4.4] - 2021-10-06
### Add
- Add new route 'signup'.
- Handle send and accept invitations on sync method.
- Add image slider on chats.
### Update
- Handle errors properly on sync.js and on request interceptor.
### Fix
- Fix issue: handle 'invite_key' when a invited user register a new account.

### [4.3] - 2021-09-29
### Update
- Update UI of voice messages recording.
- Improve response to user on Integrate ERP contacts.
### Fix
- It is now possible to forward messages to your own channels.

### [4.2] - 2021-09-24
### Fix
- Exclude 'xm/oauth2' requests from sw.js fetch to fix and issue with Google OAuth2.

### [4.1] - 2021-09-24
### Fix
- Fixes an issue on scrolling up to see the chat history.

### [4.0] - 2021-09-23
### Add
- Now users can send voice messages.
- It is possible to login with your Google account.
- Users can create their own channels.
- Add new route /oauth2 to handle OAuth2 authentication.
- Show last seen when open a cached chat.
### Update
- All XHR request are made with Axios.
- Add 'Authorization' header with Axios interceptor.
- Handle refresh of expired tokens.
- Allow to create groups with one member.
### Fix
- Fix error when store chats as offlineData.
- Fix an error when remove group.
- Show correct chat options by type of chat.

## Version 3

### [3.26] - 2021-09-01
### ADD
- Show Live Assistance guest location.

### [3.25] - 2021-08-26
### Fix
- Remove room messages from user's cache when the user left a room.

### [3.24] - 2021-08-25
### Fix
- Don't notify when someone left a room.
### Update
- Show API error message on failed login.
- Only run sync method if 'session_id' is present.

### [3.23] - 2021-08-24
### Add
- Show user who add/remove members from room.
### Update
- Update css style of joined/left chat messages.

### [3.22] - 2021-08-14
### Fix
- Fix issue that renders removed messages.

### [3.21] - 2021-08-13
### Fix
- ERP groups in user profile shows properly in a text area.

### [3.20] - 2021-08-11
### Add
- Add option to copy the text of the message.
- Show when is message is edited or deleted.
- Show when your chat partner is typing.
- Add option to show message info.
- Show ERP info in user modal.
### Fix
- Fix the issue with the image viewer displaying the old image while loading the new one.
### Update
- Call 'logout' API on logout.

### [3.19] - 2021-07-15
### Update
- Change sidebar, fix mobile tab icon
### Fix
- Hide attachment menu after attach a file.
- Other minor CSS fixes.

### [3.18] - 2021-07-04
### Update
- Add user setting: 'enter key preference'.
- gitlab-ci: set 'switch' jobs for all nodes.

### [3.17] - 2021-07-02
### Update
- Changes in chat box input: Now 'Enter' adds a new line and 'Shift+Enter' send message.
- Add switch environment job on gitlab-ci.

### [3.16] - 2021-06-24
### Add
- Add super market
### Update
- Update options of sidbear

### [3.15] - 2021-06-07
### Fix
- Hide "Edit" option for forwarded messages.

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
