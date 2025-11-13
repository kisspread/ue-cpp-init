
# Requirements

## 修改命令名称

之前是 `ue-cpp-init`，太长，现在改成 `uecpp`。

## npx 支持

我更喜欢使用 npx 来运行这个工具，因为本来就没多代码。交互式输入更合适，不需要记太多东西。

比如
```bash
npx uecpp 
```

如果没有附加参数，那么就提示用户选择虚幻5的版本：
```bash
1. ue5.4
2. ue5.5
3. ue5.6
4. ue5.7
```
实际上要给出5.0 到 5.9 的选择。

如果有指定版本，比如
```bash
npx uecpp 5.6
```

那么就直接使用 5.6 的版本。

### 虚幻5不同版本的区别

这是 5.6 和 5.7 的区别，以此类推。
```csharp
// ue5.6
DefaultBuildSettings = BuildSettingsVersion.V5;
IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_6;

// ue5.7
DefaultBuildSettings = BuildSettingsVersion.V6;
IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_7;
```

这是UE5源码内的描述：
public enum BuildSettingsVersion
	{
		/// <summary>
		/// Legacy default build settings for 4.23 and earlier.
		/// </summary>
		V1,

		/// <summary>
		/// New defaults for 4.24:
		/// * ModuleRules.PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs
		/// * ModuleRules.bLegacyPublicIncludePaths = false
		/// </summary>
		V2,

		/// <summary>
		/// New defaults for 5.2:
		/// * ModuleRules.bLegacyParentIncludePaths = false
		/// </summary>
		V3,

		/// <summary>
		/// New defaults for 5.3:
		/// * TargetRules.CppStandard = CppStandard.Default has changed from Cpp17 to Cpp20
		/// * TargetRules.WindowsPlatform.bStrictConformanceMode = true
		/// </summary>
		V4,

		/// <summary>
		/// New defaults for 5.4:
		/// * TargetRules.bValidateFormatStrings = true
		/// </summary>
		V5,

		// *** When adding new entries here, be sure to update GameProjectUtils::GetDefaultBuildSettingsVersion() to ensure that new projects are created correctly. ***

		/// <summary>
		/// Always use the defaults for the current engine version. Note that this may cause compatibility issues when upgrading.
		/// </summary>
		Latest = V5,
	}

 对于已知的，就用已知的。未知的，如果用户输入：
 ```bash
 npx uecpp 5.10
 ```
 就用 Latest即可：
 ```csharp
 DefaultBuildSettings = BuildSettingsVersion.Latest;
 IncludeOrderVersion = EngineIncludeOrderVersion.Latest;
 ```