#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import * as readline from 'readline/promises';

// Function to generate UE version config dynamically
function generateUEConfig(version) {
    // Validate version format (must be 5.x, where x is a number)
    const versionRegex = /^5\.\d+$/;
    if (!versionRegex.test(version)) {
        return null;
    }

    const minorVersion = parseInt(version.split('.')[1]);

    // Known UE versions from UE5 source code
    if (minorVersion === 0) {
        return {
            version: version,
            DefaultBuildSettings: 'BuildSettingsVersion.V2',
            IncludeOrderVersion: 'EngineIncludeOrderVersion.Unreal5_0'
        };
    } else if (minorVersion === 1) {
        return {
            version: version,
            DefaultBuildSettings: 'BuildSettingsVersion.V2',
            IncludeOrderVersion: 'EngineIncludeOrderVersion.Unreal5_1'
        };
    } else if (minorVersion === 2) {
        return {
            version: version,
            DefaultBuildSettings: 'BuildSettingsVersion.V3',
            IncludeOrderVersion: 'EngineIncludeOrderVersion.Unreal5_2'
        };
    } else if (minorVersion === 3) {
        return {
            version: version,
            DefaultBuildSettings: 'BuildSettingsVersion.V4',
            IncludeOrderVersion: 'EngineIncludeOrderVersion.Unreal5_3'
        };
    } else if (minorVersion === 4) {
        return {
            version: version,
            DefaultBuildSettings: 'BuildSettingsVersion.V5',
            IncludeOrderVersion: 'EngineIncludeOrderVersion.Unreal5_4'
        };
    } else if (minorVersion === 5) {
        return {
            version: version,
            DefaultBuildSettings: 'BuildSettingsVersion.V5',
            IncludeOrderVersion: 'EngineIncludeOrderVersion.Unreal5_5'
        };
    } else if (minorVersion === 6) {
        return {
            version: version,
            DefaultBuildSettings: 'BuildSettingsVersion.V5',
            IncludeOrderVersion: 'EngineIncludeOrderVersion.Unreal5_6'
        };
    } else if (minorVersion === 7) {
        return {
            version: version,
            DefaultBuildSettings: 'BuildSettingsVersion.V5',
            IncludeOrderVersion: 'EngineIncludeOrderVersion.Unreal5_7'
        };
    } else if (minorVersion >= 8 && minorVersion <= 9) {
        // For 5.8 and 5.9, use V5 (based on current UE source code)
        return {
            version: version,
            DefaultBuildSettings: 'BuildSettingsVersion.V5',
            IncludeOrderVersion: `EngineIncludeOrderVersion.Unreal5_${minorVersion}`
        };
    } else {
        // Unknown version (5.10+), use Latest
        return {
            version: version,
            DefaultBuildSettings: 'BuildSettingsVersion.Latest',
            IncludeOrderVersion: 'EngineIncludeOrderVersion.Latest'
        };
    }
}

// ANSI escape codes for colors
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
};

const log = (message, color = colors.reset) => console.log(`${color}${message}${colors.reset}`);

// Function to get UE version (interactive if no argument provided)
async function getUEVersion() {
    const args = process.argv.slice(2);

    // If version is provided as argument (e.g., npx uecpp 5.21)
    if (args.length > 0) {
        const version = args[0];
        const config = generateUEConfig(version);

        if (config) {
            log(`✅ Using UE ${version} settings`, colors.green);
            return { version, config };
        } else {
            log(`❌ Invalid version format: ${version}`, colors.red);
            log('   Please use format: 5.x (e.g., 5.6, 5.21)', colors.yellow);
            process.exit(1);
        }
    }

    // Interactive prompt - display 5.0 to 5.9 choices
    log('🎮 Select Unreal Engine version:', colors.yellow);

    // Display menu for 5.0 to 5.9
    const menuVersions = ['5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9'];
    menuVersions.forEach((v, i) => {
        log(`${i + 1}. UE ${v}`);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        while (true) {
            const answer = await rl.question('Enter your choice (1-10) or version: ');

            // Check for empty input
            if (!answer || answer.trim() === '') {
                log(`❌ Please enter a valid choice or version`, colors.red);
                continue;
            }

            // Try to parse as menu choice first
            const trimmedAnswer = answer.trim();
            const choice = parseInt(trimmedAnswer);
            if (!isNaN(choice) && choice >= 1 && choice <= menuVersions.length) {
                const version = menuVersions[choice - 1];
                rl.close();
                log(`✅ Using UE ${version} settings`, colors.green);
                return { version, config: generateUEConfig(version) };
            }

            // Otherwise treat as version string
            const config = generateUEConfig(trimmedAnswer);
            if (config) {
                rl.close();
                log(`✅ Using UE ${trimmedAnswer} settings`, colors.green);
                return { version: trimmedAnswer, config };
            } else {
                log(`❌ Invalid version format: ${trimmedAnswer}`, colors.red);
                log('   Please use format: 5.x (e.g., 5.6, 5.11)', colors.yellow);
            }
        }
    } catch (error) {
        rl.close();
        throw error;
    }
}

async function main() {
    log('🚀 UE C++ Initializer started...');

    try {
        const currentDir = process.cwd();
        const sourcePath = path.join(currentDir, 'Source');

        // Safety check: if 'Source' directory already exists, abort.
        try {
            await fs.access(sourcePath);
            log(`❌ Error: 'Source' directory already exists. Aborting.`, colors.red);
            process.exit(1);
        } catch (error) {
            // Directory does not exist, which is what we want. Continue.
        }

        const files = await fs.readdir(currentDir);
        const uprojectFile = files.find(f => f.endsWith('.uproject'));

        if (!uprojectFile) {
            log(`❌ Error: No .uproject file found in the current directory.`, colors.red);
            process.exit(1);
        }

        const projectName = path.basename(uprojectFile, '.uproject');
        log(`✅ Found project: ${projectName}`, colors.green);

        // Get UE version (interactive or from command line)
        const { version, config } = await getUEVersion();

        // --- Template for Build.cs ---
        const buildCsContent = `
// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class ${projectName} : ModuleRules
{
	public ${projectName}(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
	
		PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore" });

		PrivateDependencyModuleNames.AddRange(new string[] {  });
	}
}
`;

        // --- Template for Game Target ---
        const targetCsContent = `
// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;
using System.Collections.Generic;

public class ${projectName}Target : TargetRules
{
	public ${projectName}Target(TargetInfo Target) : base(Target)
	{
        Type = TargetType.Game;
		DefaultBuildSettings = ${config.DefaultBuildSettings};
		IncludeOrderVersion = ${config.IncludeOrderVersion};
		ExtraModuleNames.Add("${projectName}");
	}
}
`;

        // --- Template for Editor Target ---
        const editorTargetCsContent = `
// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;
using System.Collections.Generic;

public class ${projectName}EditorTarget : TargetRules
{
	public ${projectName}EditorTarget(TargetInfo Target) : base(Target)
	{
		Type = TargetType.Editor;
		DefaultBuildSettings = ${config.DefaultBuildSettings};
		IncludeOrderVersion = ${config.IncludeOrderVersion};
		ExtraModuleNames.Add("${projectName}");
	}
}
`;
        // --- Create directories and files ---
        const projectSourcePath = path.join(sourcePath, projectName);

        log('  Creating directory: Source');
        await fs.mkdir(sourcePath);
        
        log(`  Creating directory: Source/${projectName}`);
        await fs.mkdir(projectSourcePath);
        
        log(`  Writing file: Source/${projectName}/${projectName}.Build.cs`);
        await fs.writeFile(path.join(projectSourcePath, `${projectName}.Build.cs`), buildCsContent.trim());

        log(`  Writing file: Source/${projectName}.Target.cs`);
        await fs.writeFile(path.join(sourcePath, `${projectName}.Target.cs`), targetCsContent.trim());
        
        log(`  Writing file: Source/${projectName}Editor.Target.cs`);
        await fs.writeFile(path.join(sourcePath, `${projectName}Editor.Target.cs`), editorTargetCsContent.trim());

        log(`\n✅ Successfully created C++ project structure for UE ${version}!`, colors.green);
        log('Next step: Right-click on your .uproject file and select "Generate Visual Studio project files".', colors.yellow);

    } catch (error) {
        log(`\n❌ An unexpected error occurred: ${error.message}`, colors.red);
        process.exit(1);
    }
}

main();
