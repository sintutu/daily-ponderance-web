# Daily Ponderance: Public Reading, Private Journal

This document describes the current app and a proposed architecture for adding a private journal. The diagrams use Mermaid and render inline in compatible Markdown viewers, including GitHub.

## As-is: current system

The app is a static React/Vite frontend. Daily readings are bundled with the frontend as JSON. There is no server, sign-in, or persistent private journal today.

### C4 · System context

```mermaid
flowchart LR
    Visitor["Visitor"]
    App["Daily Ponderance\nReact/Vite web app"]
    Readings["Bundled daily readings\nJSON file"]
    Visitor -->|"Views reading and selects date"| App
    App -->|"Reads from bundle"| Readings
```

### C4 · Container view

```mermaid
flowchart TB
    Browser["Browser"]
    subgraph WebApp["Daily Ponderance web app"]
        UI["React UI\nDaily reading, date picker,\nother pages"]
        Data["Static reading data\nJSON bundled at build time"]
    end
    Browser --> UI
    UI --> Data
```

## To-be: private journal added

The reading remains public. Personal reflections live behind an authenticated hosted service, separate from the public reading bundle.

### C4 · System context

```mermaid
flowchart LR
    You["You"]
    Visitor["Other visitors"]
    Web["Daily Ponderance\nWeb app"]
    Auth["Identity provider\nSign-in and session"]
    Journal["Private journal service\nAuthenticated API"]
    DB[("Journal database")]
    Backup["Backups and export"]

    Visitor -->|"Views public reading"| Web
    You -->|"Views reading, writes or retrieves reflection"| Web
    Web -->|"Sign in / verify session"| Auth
    Web -->|"Read and save your entries\nwith session token"| Journal
    Journal -->|"Read/write only this account's entries"| DB
    DB -->|"Backup"| Backup
    You -->|"Request personal export"| Journal
```

### C4 · Container view

```mermaid
flowchart TB
    subgraph Browser["Your browser"]
        UI["React/Vite app\nPublic reading + journal editor"]
        Speech["Browser speech recognition\nOptional text transcription"]
    end

    subgraph PrivateService["Hosted private journal service"]
        API["Journal API\nSession validation + ownership checks"]
        Identity["Authentication provider"]
        DB[("Persistent database\nEntries keyed by account and date")]
        Export["Personal export"]
        Backup["Database backups"]
    end

    Readings["Bundled public readings\nJSON"]

    UI -->|"Displays readings"| Readings
    UI -->|"Optional dictation to text"| Speech
    Speech -->|"Transcribed text for review"| UI
    UI <-->|"Sign-in/session"| Identity
    UI <-->|"Authenticated read/write"| API
    API <-->|"Entries"| DB
    DB --> Backup
    API --> Export
```

## Private data flow

1. You open a reading and select a date.
2. After sign-in, the app checks whether you have a reflection saved for that date.
3. You type or dictate text. Dictation fills the editor for review; the first version does not save audio.
4. On save, the app sends the date and reflection to the journal API using your authenticated session.
5. The API derives your account from the session and checks ownership before reading or writing. The browser cannot choose which account's entries it accesses.
6. The journal view retrieves your entries by date. You can request an export of your entries.

## Implementation steps

1. **Settle the hosted service choice.** Choose authentication and database providers; confirm backup, export, recovery, and deletion capabilities.
2. **Build the private API and data model.** Start with one editable reflection per account per date and timestamps. Enforce authentication and ownership checks.
3. **Add the editor to the reading page.** Load the entry when the selected date changes; provide save, loading, and error states; warn before losing unsaved edits.
4. **Add optional dictation.** Use browser speech recognition when supported and permitted. Keep typing available in every case.
5. **Add journal retrieval and export.** List dates with entries, open them alongside the corresponding reading, and allow a personal export.
6. **Verify privacy and access behavior.** Check unauthenticated access, account isolation, date switching, reload and retrieval, dictation fallback, and export.

## Decisions and open items

- Daily readings remain public and locally bundled.
- Journal access requires an account and hosted private service, allowing access across devices.
- The initial model is one editable reflection per date.
- Voice input transcribes to text; audio recording and storage are out of scope.
- Provider-specific privacy, recovery, backup, and deletion guarantees must be confirmed during provider selection.
