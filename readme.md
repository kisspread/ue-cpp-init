# UE C++ Init

A simple, zero-dependency CLI tool to quickly initialize a C++ project structure for any Unreal Engine Blueprint-only project.

Now it supports Unreal Engine 5.0+ C++ project.

This tool available on npm now: https://www.npmjs.com/package/uecpp

## Why?

When you want to convert a Blueprint-only Unreal Engine project to a C++ project, you need to manually create the `Source` directory and a set of boilerplate files (`.Build.cs`, `.Target.cs`). This tool automates that process.

## Quick Start (using npx)

The easiest way to use this tool without installation:

```bash
cd <your-project-directory>
npx uecpp
```

This will prompt you to select the Unreal Engine version from 5.0 to 5.9, or you can directly specify the version:

```bash
npx uecpp 5.6    # For UE 5.6
npx uecpp 5.21   # For any UE 5.x version
```

## Installation & Usage

### Global Installation (requires npm & internet)

Install it globally using npm:

```bash
npm install -g ue-cpp-init
```

Then use it anywhere:

```bash
cd <your-project-directory>
uecpp 5.6        # Directly specify version
uecpp            # Interactive mode
```


## Supported Unreal Engine Versions

- **Known versions (5.0-5.9)**: Uses specific BuildSettingsVersion
  - 5.0-5.1: V2
  - 5.2: V3
  - 5.3: V4
  - 5.4-5.9: V5
- **Unknown versions (5.10+)**: Uses Latest settings

## What It Does

This tool will:
1. Check if a `.uproject` file exists in the current directory
2. Create the necessary `Source` directory structure
3. Generate three C# build configuration files with the correct UE version settings
4. Provide instructions for the next step (Generate Visual Studio project files)

That's it! 🎉
