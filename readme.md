<img src="https://i.imgur.com/Uo0FVG7.png" align="right" width="200">

# pastebin.js

An object-oriented JavaScript wrapper for the Pastebin API.

## Quick Example

```js
const { PastebinClient } = require("pastebin.js")
const pastebin = new PastebinClient(process.env.API_KEY)

const paste = await pastebin.pastes.create("console.log('hello, world')", {
    title: "pastebin.js test",
    format: "javascript",
    privacy: "unlisted"
})
console.log(paste.url)
```

## Usage

-   [Classes](#classes)
    -   [PastebinClient](#pastebinclient)
    -   [PastebinError](#pastebinerror-extends-error)
    -   [Paste](#paste)
    -   [User](#user-1)
    -   [ClientUser](#clientuser-extends-user)
    -   [PasteStore](#pastestore-extends-map)
    -   [UserStore](#userstore)
    -   [UserPasteStore](#userpastestore)
-   [Typedefs](#typedefs)
    -   [PastebinCredentials](#pastebincredentials)
    -   [PasteCreateOptions](#pastecreateoptions)
    -   [Format](#format-2)
    -   [Privacy](#privacy-2)
    -   [Expiry](#expiry-2)

## Classes

The module exports the following classes, you can import them like so:

```js
const {
    PastebinClient,
    PastebinError,
    Paste,
    User,
    ClientUser,
    PasteStore,
    UserStore,
    UserPasteStore
} = require("pastebin.js")
```

### PastebinClient

The client used to interact with the Pastebin API.

#### .constructor()

```js
new PastebinClient(apiKey, username, password)
```

##### Parameters

| name     | description            | type   | default |
| -------- | ---------------------- | ------ | ------- |
| apiKey   | Your Pastebin API key  | string | `null`  |
| username | Your Pastebin username | string | `null`  |
| password | Your Pastebin password | string | `null`  |

#### .credentials

Your Pastebin credentials.  
**Type: [PastebinCredentials](#pastebincredentials)**

#### .user

The user the client logged in with, if it has.  
**Type: ?[ClientUser](#clientuser-extends-user)**

#### .users

All of the cached users.  
**Type: ?[UserStore](#userstore)**

#### .pastes

All of the cached pastes.  
**Type: ?[PasteStore](#pastestore-extends-map)**

#### .login()

Login with the stored username and password and store the user key.

##### Returns

**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[PastebinClient](#pastebinclient)>**

### PastebinError _extends [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)_

Thrown when there's an error related to the Pastebin API or pastebin.js.

#### .constructor()

```js
new PastebinError(message)
```

##### Parameters

| name    | description       | type   | default |
| ------- | ----------------- | ------ | ------- |
| message | The error message | string |         |

#### .message

The error message.

### Paste

A Pastebin paste.

#### .constructor()

```js
new Paste(client, data)
```

##### Parameters

| name            | description                              | type                  | default |
| --------------- | ---------------------------------------- | --------------------- | ------- |
| client          | The client used to get this paste        | PastebinClient        |         |
| data            |                                          | Object                |         |
| data.key        | The key of the paste                     | string                |         |
| data.title      | The title of the paste                   | string                | `null`  |
| data.author     | The author of the paste                  | User                  | `null`  |
| data.content    | The content of the paste                 | string                | `null`  |
| data.size       | The length of the content of the paste   | number                | `null`  |
| data.date       | The date the paste was posted            | Date                  | `null`  |
| data.format     | The format of the paste                  | [Format](#format-2)   | `null`  |
| data.privacy    | The privacy setting of the paste         | [Privacy](#privacy-2) | `null`  |
| data.expiry     | The expiry time of the paste             | [Expiry](#expiry-2)   | `null`  |
| data.expiryDate | The expiry date of the paste             | Date                  | `null`  |
| data.hits       | The number of times anyone saw the paste | number                | `null`  |

#### .client

The client used to get this paste.  
**Type: [PastebinClient](#pastebinclient)**

#### .key

The key of this paste.  
**Type: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .url

The URL of this paste.  
**Type: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .title

The title of this paste.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .author

The author of this paste.  
**Type: ?[User](#user)**

#### .content

The content of this paste.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .size

The length of the content of this paste.  
**Type: ?[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### .date

The date this paste was posted.  
**Type: ?[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)**

#### .format

The format of this paste.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .privacy

The privacy setting of this paste.  
**Type: ?[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### .expiry

The expiry time of this paste.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .expiryDate

The expiry date of this paste.  
**Type: ?[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)**

#### .hits

The number of times anyone saw this paste.  
**Type: ?[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### .fetch()

Fetch the content of this paste, and store it in the cache.

##### Returns

**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Paste](#paste)>**

#### .delete()

Delete this paste.

##### Returns

**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Paste](#paste)>**

### User

A Pastebin user.

#### .constructor()

```js
new User(client, username)
```

##### Parameters

| name     | description                       | type           | default |
| -------- | --------------------------------- | -------------- | ------- |
| client   | The client used to get this paste | PastebinClient |         |
| username | The user's username               | string         |         |

#### .client

The client used to get this user.  
**Type: [PastebinClient](#pastebinclient)**

#### .username

This user's username.  
**Type: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .me

Whether this user is the same as the client's user.  
**Type: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

### ClientUser _extends [User](#user)_

The Pastebin user of the logged in client.

#### .constructor()

```js
new ClientUser(client, data)
```

##### Parameters

| name           | description                       | type                  | default |
| -------------- | --------------------------------- | --------------------- | ------- |
| client         | The client used to get this paste | PastebinClient        |         |
| data           |                                   | Object                |         |
| data.username  | The user's username               | string                |         |
| data.format    | The user's format setting         | [Format](#format-2)   | `null`  |
| data.expiry    | The user's expiry setting         | [Expiry](#expiry-2)   | `null`  |
| data.avatarURL | The user's avatar URL             | string                | `null`  |
| data.privacy   | The user's privacy setting        | [Privacy](#privacy-2) | `null`  |
| data.website   | The user's website                | string                | `null`  |
| data.email     | The user's e-mail                 | string                | `null`  |
| data.location  | The user's location               | string                | `null`  |
| data.pro       | Whether the user is a PRO account | boolean               | `null`  |

#### .username

This user's username.  
**Type: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .format

This user's format setting.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .expiry

This user's expiry setting.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .avatarURL

This user's avatar URL.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .privacy

This user's privacy setting.  
**Type: ?[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

#### .website

This user's website.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .email

This user's e-mail.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .location

This user's location.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### .pro

Whether this user is a PRO account.  
**Type: ?[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

#### .pastes

All of this user's cached pastes.  
**Type: ?[UserPasteStore](#userpastestore)**

### PasteStore _extends [Map](#https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)_

A structure that holds all of the cached pastes.

#### .constructor()

```js
new PasteStore(client, entries)
```

##### Parameters

| name    | description                     | type                        | default |
| ------- | ------------------------------- | --------------------------- | ------- |
| client  | The client the store belongs to | PastebinClient              |         |
| entries |                                 | Array<Array<string, Paste>> | `null`  |

#### .client

The client this store belongs to.  
**Type: [PastebinClient](#pastebinclient)**

#### .fetch()

Fetch a paste by its key, and store it in the cache.

##### Parameters

| name | description     | type   | default |
| ---- | --------------- | ------ | ------- |
| key  | The paste's key | string |         |

##### Returns

**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Paste](#paste)>**

#### .create()

Create a paste, and store it in the cache.

##### Parameters

| name            | description                 | type                        | default |
| --------------- | --------------------------- | --------------------------- | ------- |
| content         | The paste's content         | any                         |         |
| options         |                             | Array<Array<string, Paste>> | `null`  |
| options.title   | The paste's title           | string                      | `{}`    |
| options.format  | The paste's format          | [Format](#format-2)         | `null`  |
| options.privacy | The paste's privacy setting | [Privacy](#privacy-2)       | `null`  |
| options.expiry  | The paste's expiry time     | [Expiry](#expiry-2)         | `null`  |

##### Returns

**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Paste](#paste)>**

### UserStore

A structure that holds all of the cached users.

#### .constructor()

```js
new UserStore(client, entries)
```

##### Paramaters

| name    | description                     | type                        | default |
| ------- | ------------------------------- | --------------------------- | ------- |
| client  | The client the store belongs to | PastebinClient              |         |
| entries |                                 | Array<Array<string, Paste>> | `null`  |

#### .client

The client this store belongs to.  
**Type: [PastebinClient](#pastebinclient)**

#### .fetch()

Fetch a user by their username, and store them in the cache.

##### Parameters

| name     | description         | type   | default |
| -------- | ------------------- | ------ | ------- |
| username | The user's username | string |         |

##### Returns

**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[User](#user)>**

### UserPasteStore

A structure that holds all of a user's cached pastes.

#### .constructor()

```js
new UserPasteStore()
```

##### Parameters

| name    | description                     | type                        | default |
| ------- | ------------------------------- | --------------------------- | ------- |
| client  | The client the store belongs to | PastebinClient              |         |
| user    | The user the store belongs to   | User                        |         |
| entries |                                 | Array<Array<string, Paste>> | `null`  |

#### .client

The client this store belongs to.  
**Type: [PastebinClient](#pastebinclient)**

#### .user

The user this store belongs to.  
**Type: [User](#user)**

#### .fetch()

Fetch this user's pastes, and store them in the cache.

##### Parameters

| name | description                           | type   | default |
| ---- | ------------------------------------- | ------ | ------- |
| max  | The maximum number of pastes to fetch | number | `50`    |

##### Returns

**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[UserPasteStore](#userpastestore)>**

## Typedefs

### PastebinCredentials

The credentials provided to and stored in the PastebinClient.

**Type:** `{ apiKey?, username?, password?, userKey? }`

#### Properties

| name     | description                                      | type   | default |
| -------- | ------------------------------------------------ | ------ | ------- |
| apiKey   | Your Pastebin API key                            | string | `null`  |
| username | Your Pastebin username                           | string | `null`  |
| password | Your Pastebin password                           | string | `null`  |
| userKey  | Your Pastebin user key, obtained when logging in | string | `null`  |

### PasteCreateOptions

Options to create a paste.

**Type:** `{ title?, format?, privacy?, expiry? }`

#### Properties

| name    | description                                      | type                  | default |
| ------- | ------------------------------------------------ | --------------------- | ------- |
| title   | Your Pastebin API key                            | string                | `null`  |
| format  | Your Pastebin username                           | [Format](#format-2)   | `null`  |
| privacy | Your Pastebin password                           | [Privacy](#privacy-2) | `null`  |
| expiry  | Your Pastebin user key, obtained when logging in | [Expiry](#expiry-2)   | `null`  |

### Format

A "format," which will be used for syntax highlighting. You can see the full list of formats [here](https://pastebin.com/doc_api#5).

**Type:** `string`

### Privacy

A privacy setting. Can be one of the following:

-   `0` (or `"public"`)
-   `1` (or `"unlisted"`)
-   `2` (or `"private"`)

**Type:** `string` or `number`

### Expiry

An expiry setting. Can be one of the following:

-   `"NEVER"` (or `"N"`)
-   `"10 MINUTES"` (or `"10M"`)
-   `"1 HOUR"` (or `"1H"`)
-   `"1 DAY"` (or `"1D"`)
-   `"1 WEEK"` (or `"1W"`)
-   `"2 WEEKS"` (or `"2W"`)
-   `"1 MONTH"` (or `"1M"`)
-   `"6 MONTHS"` (or `"6M"`)
-   `"1 YEAR"` (or `"1Y"`)
