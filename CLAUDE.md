# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a zero-dependency Node.js CLI tool that automates the conversion of Unreal Engine blueprint-only projects to C++ projects by generating the necessary build configuration files for UE5.6+.

## Architecture

- **Single-file architecture**: All functionality is contained in `index.js` (127 lines)
- **Zero dependencies**: Uses only Node.js built-in modules (`fs/promises`, `path`)
- **ES Modules**: Modern JavaScript module system
- **Linear execution flow**: Safety checks → Project detection → Template generation → File creation

## Development Workflow

### Common Commands
- **Install globally**: `npm install -g ue-cpp-init`
- **Run tool**: `cd <ue-project-directory> && ue-cpp-init`
- **Publish updates**: Update version in `package.json` then `npm publish`

### Development Process
- Edit `index.js` directly - no build process required
- No testing infrastructure currently exists
- Version management via `package.json`

## Technical Details

### Generated File Structure
```
Source/
├── {ProjectName}/
│   └── {ProjectName}.Build.cs
├── {ProjectName}.Target.cs
└── {ProjectName}Editor.Target.cs
```

### Unreal Engine Version
- Targets UE5.6+ specifically
- Uses `BuildSettingsVersion.V5` and `EngineIncludeOrderVersion.Unreal5_6`
- Pre-configured module dependencies: Core, CoreUObject, Engine, InputCore

### Template System
- Hardcoded C# templates embedded in `index.js`
- Includes Epic Games copyright headers
- No external template files or configuration

### Safety Features
- Validates no existing `Source` directory
- Detects `.uproject` file for project name extraction
- Comprehensive error handling with color-coded console output
- Emoji-enhanced status messages for better user experience

## Key Implementation Notes

- The tool expects to be run from a directory containing a `.uproject` file
- Generated files require manual regeneration of Visual Studio project files
- No support for custom templates or UE version configuration
- All file operations use async/await with proper error handling
- User guidance provided for next steps after initialization