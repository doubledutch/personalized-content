# Personalized Content

A React Native extension for DoubleDutch apps, allowing personalized attendee
content in the app.

DoubleDutch ❤️ React Native. [Get started](https://doubledutch.github.io/rn/)

## Data Model

### Firebase Database

This extension connects to a simple firebase database via
[@doubledutch/firebase-connector](https://www.npmjs.com/package/@doubledutch/firebase-connector)
on a per-event basis.

#### `private/admin`

The master list of content is only accessible with admin (CMS) tokens.
Each content item's key is a unique ID assigned by Firebase. An `order` property
is the index that should be used to order content. Any reordering of content
must update all the `order` properties for all content whose index has changed.

Two separate copies of the master list of content will be kept as `content` and
`pendingContent`. `pendingContent` contains all changes that have been made
in the CMS, but which have not necessarily been published. When a
`Publish changes` button is pressed, `pendingContent` is copied to various other
DB locations for correct attendee visibility (see below), and then `content` is
replaced with `pendingContent` so the two are identical.  The `lastPublishedAt`
millisecond timestamp is also updated. A `Revert changes` button will simply
copy `content` to `pendingContent`, annihilating any changes made after the last
publish (Note that no copying to other DB locations is necessary in this case).

The `visibility` property of each content item specifies which attendees should
be able to see the content.  An attendee who matches ANY of the specified tiers,
groups, or attendee IDs can see the content (i.e. filters are OR-ed together).
If `visibility.all` is `true`, no filtering is performed, and all attendees will
see the content.

This master content list (which is hidden from attendees) is copied to other
database paths based on `visibility`. Any changes (creates, updates, reordering,
deletions, or changes in visibility) must propagate to those other database
paths in a reliable way.

```json
{
  "pendingContent": "NOTE: same structure as `content`",
  "lastPublishedAt": "1518725377387",
  "content": {
    "0": {
      "type": "web",
      "title": "DoubleDutch",
      "url:": "https://doubledutch.me",
      "visibility": {
        "tierIds": [55,78],
        "groupIds": [42],
        "attendeeIds": [901,1027]
      }
    },
    "1": {
      "type": "text",
      "title": "Honey Badgers",
      "text": "They don't care",
      "visibility": {
        "tierIds": [],
        "groupIds": [],
        "attendeeIds": []
      }
    },
    "2": {
      "type": "survey",
      "surveyId": 12345,
      "visibility": {
        "tierIds": [],
        "groupIds": [],
        "attendeeIds": [1234]
      }
    }
  }
}
```

#### Content copied to other paths

- `public/admin`
- `private/adminable/users/:userId`
- `private/adminable/tiers/:tierId`

Content from the master list is copied (and copies kept 100% up to date) by the
admin panel for this extension in the CMS. For private tier- and user-based
firebase database locations, the `visibility` key will be removed in the copies.
These database locations have access limited to firebase tokens with the
appropriate `userId`/`tierId` claims, so visibility is implied.

The `public/admin` DB location is used for any content with
`"visibility": {"all": true}}` or a non-empty list of attendee groups specified
(`"visibility": {"groupIds": [...]}}`). This means that content filtered ONLY by
tier or specific attendees will secured to only those attendees at the database
level, but if any attendee groups are specified, the content should not be
considered secret, because it will be merely filtered on the mobile client.

Content items in the `public/admin` DB location will retain their `visibility`
property, since filtering will be done in the mobile client.

```json
{
  "content": {
    "0": {
      "type": "web",
      "title": "DoubleDutch",
      "url:": "https://doubledutch.me"  
    },
    "1": {
      "type": "text",
      "title": "Honey Badgers",
      "text": "They don't care"
    }
  }
}
```

When the `Publish changes` button is pressed, the admin panel Javascript will
perform the following steps, in this order:

1. Delete `public/admin/content`, `private/adminable/users`, and 
`private/adminable/tiers`, paving the way for all new data to be inserted. This
assumes that no keys other than `content` are present under
`private/adminable/users` and `private/adminable/tiers`, and is a simple way to
ensure that stale data does not persist for any attendees.
2. Make one or more copies of the `pendingContent` (with `visibility` property
removed for the `private/adminable/users` and `private/adminable/tiers`
locations) to the same locations that were wiped clean in the previous step,
according to the `visibility` rules.
3. Set `private/admin/content` to the value of `pendingContent`.
4. Set `private/admin/lastPublishedAt` to `moment().valueOf()` (Unix millisecond
timestamp)

### Mobile client state

A mobile client's state will mirror the Firebase data in these locations, for
the current attendee's `userId` and `tierId`:

- **`public/admin`**: Content items here are added if any of the current
attendee's groups match any of the `visibility.groupIds`, or no
`visibility` filters are specified (i.e. global visibility).
- **`private/adminable/users/:userId`**: All content items found here are added
- **`private/adminable/tiers/:tierId`**: All content items found here are added

3 matching `groupContent` (with a simple attendee groups filter), `userContent`,
and `tierContent` key/value pair objects can be contructed from `value` events
(updating or emptying the whole array at once) from the Firebase locations
above. A derived combined `content` state is an array constructed from the union
of these objects, sorted by keys that have been converted to integers to yield
the proper viewing order. `content` should be reconstructed as the last step in
processing any of the 3 `value` handlers above, to keep it up to date with any
DB changes.
