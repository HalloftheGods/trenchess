# Generate Barrels Script

This script automatically generates `index.ts` files (barrel files) for specified directories. It exports all `.ts` and `.tsx` files (excluding `index.ts` itself) from the target directory.

## Usage

Run the script using pnpm:

```bash
pnpm generate:barrels
```

To target specific directories:

```bash
pnpm generate:barrels path/to/dir1 path/to/dir2
```

## Configuration

The script targets the following directories by default:
- `src/app/routes/game/components/atoms`
- `src/app/routes/game/components/molecules`
- `src/app/routes/game/components/organisms`
- `src/app/routes/game/components/templates`
- `src/app/routes/game/components` (Parent barrel)
- `src/shared/components/atoms`
- `src/shared/components/molecules`
- `src/shared/components/organisms`
- `src/shared/components/templates`
- `src/shared/components` (Parent barrel)

## Implementation Details

- **File Filter**: Only `.ts` and `.tsx` files are included.
- **Subdirectory Support**: If a targeted directory contains subdirectories with their own `index.ts` or `index.tsx`, they are also exported.
- **Processing Order**: The script sorts directories by depth to ensure child barrels are generated before parent barrels.
- **Exclusion**: The `index.ts` file itself is excluded to avoid circular exports.
- **Format**: `export * from './filename';`
