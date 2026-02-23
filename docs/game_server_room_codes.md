# Room Code System

## Overview
To improve user experience and shareability, battle lobby room codes are generated as short, human-readable strings instead of long UUIDs.

## Design Specifications
- **Length**: 4 characters.
- **Format**: Alphanumeric (uppercase).
- **Entropy**: Approximately 1 million unique combinations (32^4).

## Unambiguous Character Set
The following character set is used to prevent confusion between similar-looking glyphs:
`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`

### Excluded Characters
| Excluded | Reason |
|----------|--------|
| `0`      | Looks like `O` |
| `O`      | Looks like `0` |
| `1`      | Looks like `I` |
| `I`      | Looks like `1` |
| `L`      | Looks like `I` |

## Implementation Details
The room code generation is integrated into the `boardgame.io` server configuration.

- **Generator Utility**: `src/shared/utils/room-code.ts`
- **Server Configuration**: `server/index.ts` (using the `uuid` option in the `Server` constructor)
- **UI Display**: Room codes are displayed in the `HeaderLobby` organism and are used for join/copy actions.
