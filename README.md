# pastebin.js
An OOP JavaScript wrapper for the Pastebin API

# Docs
The module exports 8 classes:
```js
const { PastebinClient, PastebinError, Paste, User, ClientUser, PasteStore, UserStore, userPasteStore } = require("pastebin.js")
```

## PastebinClient
The client used to interact with the Pastebin API.

### constructor()
```js
new PastebinClient(apiKey, username, password)
```

#### Parameters
| name     | description            | type   | default |
|----------|------------------------|--------|---------|
| apiKey   | Your Pastebin API key  | string | `null`  |
| username | Your Pastebin username | string | `null`  |
| password | Your Pastebin password | string | `null`  |

### credentials
Your Pastebin credentials.  
**Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**

#### credentials.apiKey
Your Pastebin API key.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### credentials.username
Your Pastebin username.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

#### credentials.password
Your Pastebin password.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### user
The user the client logged in with, if it has.  
**Type: ?[ClientUser](#ClientUser)**

### users
All of the cached users.  
**Type: ?[UserStore](#UserStore)**

### pastes
All of the cached pastes.  
**Type: ?[PasteStore](#PasteStore)**

### login()
Login with the stored username and password and store the user key.

#### Returns
**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[PastebinClient](#PastebinClient)>**

## PastebinError
Thrown when there's an error related to the Pastebin API or pastebin.js.

### constructor()
```js
new PastebinError(message)
```

#### Parameters
| name     | description       | type   | default |
|----------|-------------------|--------|---------|
| message  | The error message | string |         |

### message
The error message.

## Paste
A Pastebin paste.

### constructor()
```js
new Paste(client, data)
```

#### Parameters
| name            | description                              | type           | default |
|-----------------|------------------------------------------|----------------|---------|
| client          | The client used to get this paste        | PastebinClient |         |
| data            |                                          | Object         |         |
| data.key        | The key of the paste                     | string         |         |
| data.title      | The title of the paste                   | string         | `null`  |
| data.author     | The author of the paste                  | User           | `null`  |
| data.content    | The content of the paste                 | string         | `null`  |
| data.size       | The length of the content of the paste   | number         | `null`  |
| data.date       | The date the paste was posted            | Date           | `null`  |
| data.format     | The format of the paste                  | string         | `null`  |
| data.privacy    | The privacy setting of the paste         | number         | `null`  |
| data.expiry     | The expiry time of the paste             | string         | `null`  |
| data.expiryDate | The expiry date of the paste             | Date           | `null`  |
| data.hits       | The number of times anyone saw the paste | number         | `null`  |

### client
The client used to get this paste.  
**Type: [PastebinClient](#PastebinClient)**

### key
The key of this paste.  
**Type: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### url
The URL of this paste.  
**Type: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### title
The title of this paste.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### author
The author of this paste.  
**Type: ?[User](#User)**

### content
The content of this paste.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### size
The length of the content of this paste.  
**Type: ?[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

### date
The date this paste was posted.  
**Type: ?[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)**

### format
The format of this paste.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### privacy
The privacy setting of this paste.  
**Type: ?[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

### expiry
The expiry time of this paste.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### expiryDate
The expiry date of this paste.  
**Type: ?[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)**

### hits
The number of times anyone saw this paste.  
**Type: ?[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

### fetch()
Fetch the content of this paste, and store it in the cache.

#### Returns
**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Paste](#Paste)>**

### delete()
Delete this paste.

#### Returns
**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Paste](#Paste)>**

## User
A Pastebin user.

### constructor()
```js
new User(client, username)
```

#### Parameters
| name            | description                              | type           | default |
|-----------------|------------------------------------------|----------------|---------|
| client          | The client used to get this paste        | PastebinClient |         |
| username        | The user's username                      | string         |         |

### client
The client used to get this user.  
**Type: [PastebinClient](#PastebinClient)**

### username
This user's username.  
**Type: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### me
Whether this user is the same as the client's user.  
**Type: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

## ClientUser *extends User*
The Pastebin user of the logged in client.

### constructor()
```js
new ClientUser(client, data)
```

#### Parameters
| name            | description                              | type           | default |
|-----------------|------------------------------------------|----------------|---------|
| client          | The client used to get this paste        | PastebinClient |         |
| data            |                                          | Object         |         |
| data.username   | The user's username                      | string         |         |
| data.format     | The user's format setting                | string         | `null`  |
| data.expiry     | The user's expiry setting                | string         | `null`  |
| data.avatarURL  | The user's avatar URL                    | string         | `null`  |
| data.privacy    | The user's privacy setting               | number         | `null`  |
| data.website    | The user's website                       | string         | `null`  |
| data.email      | The user's e-mail                        | string         | `null`  |
| data.location   | The user's location                      | string         | `null`  |
| data.pro        | Whether the user is a PRO account        | boolean        | `null`  |

### username
This user's username.  
**Type: [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### format
This user's format setting.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### expiry
This user's expiry setting.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### avatarURL
This user's avatar URL.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### privacy
This user's privacy setting.  
**Type: ?[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

### website
This user's website.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### email
This user's e-mail.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### location
This user's location.  
**Type: ?[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

### pro
Whether this user is a PRO account.  
**Type: ?[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

### pastes
All of this user's cached pastes.  
**Type: ?[UserPasteStore](#UserPasteStore)**

## PasteStore *extends Map*
A structure that holds all of the cached pastes.

### constructor()
```js
new PasteStore(client, entries)
```

#### Parameters
| name            | description                     | type                        | default |
|-----------------|---------------------------------|-----------------------------|---------|
| client          | The client the store belongs to | PastebinClient              |         |
| entries         |                                 | Array<Array<string, Paste>> | `null`  |

### client
The client this store belongs to.  
**Type: [PastebinClient](#PastebinClient)**

### fetch()
Fetch a paste by its key, and store it in the cache.

#### Parameters
| name | description     | type   | default |
|------|-----------------|--------|---------|
| key  | The paste's key | string |         |

#### Returns
**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Paste](#Paste)>**

### create()
Create a paste, and store it in the cache.

#### Parameters
| name            | description                 | type                        | default |
|-----------------|-----------------------------|-----------------------------|---------|
| content         | The paste's content         | any                         |         |
| options         |                             | Array<Array<string, Paste>> | `null`  |
| options.title   | The paste's title           | string                      | `{}`    |
| options.format  | The paste's format          | string                      | `null`  |
| options.privacy | The paste's privacy setting | number                      | `null`  |
| options.expiry  | The paste's expiry time     | string                      | `null`  |

#### Returns
**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Paste](#Paste)>**

## UserStore
A structure that holds all of the cached users.

### constructor()
```js
new UserStore(client, entries)
```

#### Paramaters
| name    | description                     | type                        | default |
|---------|---------------------------------|-----------------------------|---------|
| client  | The client the store belongs to | PastebinClient              |         |
| entries |                                 | Array<Array<string, Paste>> | `null`  |

### client
The client this store belongs to.  
**Type: [PastebinClient](#PastebinClient)**

### fetch()
Fetch a user by their username, and store them in the cache.

#### Parameters
| name     | description         | type           | default |
|----------|---------------------|----------------|---------|
| username | The user's username | PastebinClient |         |

#### Returns
**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[User](#User)>**

## UserPasteStore
A structure that holds all of a user's cached pastes.

### constructor()
```js
new UserPasteStore()
```

#### Parameters
| name    | description                     | type                        | default |
|---------|---------------------------------|-----------------------------|---------|
| client  | The client the store belongs to | PastebinClient              |         |
| user    | The user the store belongs to   | User                        |         |
| entries |                                 | Array<Array<string, Paste>> | `null`  |

### client
The client this store belongs to.  
**Type: [PastebinClient](#PastebinClient)**

### user
The user this store belongs to.  
**Type: [User](#User)**

### fetch()
Fetch this user's pastes, and store them in the cache.

#### Parameters
| name | description                           | type   | default |
|------|---------------------------------------|--------|---------|
| max  | The maximum number of pastes to fetch | number | `50`    |

#### Returns
**[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[UserPasteStore](#UserPasteStore)>**