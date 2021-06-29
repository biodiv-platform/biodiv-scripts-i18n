# i18n + Google Sheet Migrator

This script helps in automating translation process to and from google sheet and local json

## Commands

```bash
yarn install         # to install dependencies
yarn upload          # from local to google sheet upload (will not recreate sheets)
yarn upload:full     # from local to google sheet upload (will recreate sheets)
yarn downlod         # from google sheet to local download
yarn delete-sheets   # deletes all sheets on google-sheets
```

## References

- [service account based authincation for google sheets](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account)
