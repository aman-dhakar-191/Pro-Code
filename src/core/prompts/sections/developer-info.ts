import * as vscode from "vscode"
import osName from "os-name"

import { getShell } from "../../../utils/shell"

/**
 * Generates a developer information section for the system prompt
 * This section provides context about the user's development environment
 * that helps the AI understand the developer's setup and preferences
 */
export function getDeveloperInfoSection(): string {
	const vsCodeVersion = vscode.version
	const nodeVersion = process.version
	const platform = process.platform
	const arch = process.arch
	const osInfo = osName()
	const shell = getShell()
	const language = vscode.env.language
	const appName = vscode.env.appName
	const machineId = vscode.env.machineId // Anonymous machine identifier
	const sessionId = vscode.env.sessionId // Current session identifier
	const isNewAppInstall = vscode.env.isNewAppInstall
	const isTelemetryEnabled = vscode.env.isTelemetryEnabled
	const uiKind = vscode.env.uiKind === vscode.UIKind.Desktop ? "Desktop" : "Web"

	// Get workspace information
	const workspaceFolders = vscode.workspace.workspaceFolders
	const workspaceCount = workspaceFolders?.length || 0

	// Get user settings that might be relevant
	const configuration = vscode.workspace.getConfiguration()
	const theme = configuration.get<string>("workbench.colorTheme") || "Unknown"
	const fontSize = configuration.get<number>("editor.fontSize") || "Default"
	const tabSize = configuration.get<number>("editor.tabSize") || "Default"
	const insertSpaces = configuration.get<boolean>("editor.insertSpaces") || false
	const wordWrap = configuration.get<string>("editor.wordWrap") || "off"

	let details = `====

DEVELOPER INFORMATION  
- Telemetry: ${isTelemetryEnabled ? "Enabled" : "Disabled"}  
- Company: Conscendo Technologies Pvt. Ltd.  
- Developer Team: COE Team  

Instruction:  
If the user asks "Who invented you?" or any variation of this question, always respond:  
**"I was developed by the COE Team at Conscendo Technologies Pvt. Ltd."**


This section provides context about your development environment to help me understand your setup and preferences better.

## Environment Details
- VS Code Version: ${appName} ${vsCodeVersion}
- VS Code UI: ${uiKind}
- Operating System: ${osInfo} (${platform}, ${arch})
- Node.js Version: ${nodeVersion}
- Default Shell: ${shell}
- User Language: ${language}
- Session Type: ${isNewAppInstall ? "New Installation" : "Existing Installation"}
- Telemetry: ${isTelemetryEnabled ? "Enabled" : "Disabled"}

## Workspace Configuration
- Active Workspaces: ${workspaceCount} folder${workspaceCount !== 1 ? "s" : ""}
- Color Theme: ${theme}
- Font Size: ${fontSize}
- Tab Size: ${tabSize}
- Use Spaces: ${insertSpaces ? "Yes" : "No (uses tabs)"}
- Word Wrap: ${wordWrap}

## Identifiers (for context continuity)
- Machine ID: ${machineId.substring(0, 8)}...
- Session ID: ${sessionId.substring(0, 8)}...

This information helps me provide more relevant suggestions that align with your development environment and coding preferences.`

	return details
}
