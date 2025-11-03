#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

// ANSI escape codes for colors
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
};

const log = (message, color = colors.reset) => console.log(`${color}${message}${colors.reset}`);

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
		DefaultBuildSettings = BuildSettingsVersion.V5;
		IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_6;
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
		DefaultBuildSettings = BuildSettingsVersion.V5;
		IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_6;
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

        log('\n🎉 Successfully created C++ project structure!', colors.green);
        log('Next step: Right-click on your .uproject file and select "Generate Visual Studio project files".', colors.yellow);

    } catch (error) {
        log(`\n❌ An unexpected error occurred: ${error.message}`, colors.red);
        process.exit(1);
    }
}

main();
