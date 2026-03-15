/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { FormatSetting } from ".";

export const settings = definePluginSettings({
    format: {
        component: ({ setValue }) => FormatSetting(setValue),
        type: OptionType.COMPONENT,
        default: "{buildChannel} {buildNumber} ({buildHash}) | {equicordName} {equicordVersion} ({equicordHash})",
        restartNeeded: true
    }
});

export const names: Record<string, string> = {
    stable: "Stable",
    ptb: "PTB",
    canary: "Canary",
    staging: "Staging"
};

export const discordVariables = [
    "Discord Variables:",
    "{discordIcon} - Discord icon",
    "{devbannerIcon} - Dev banner icon",
    "{discordName} - The word 'Discord'",
    "{buildChannel} - Discord build channel (e.g. Stable)",
    "{buildNumber} - Discord build number (e.g. 123456)",
    "{buildHash} - Discord build hash (e.g. 123456789)",
];

export const equicordVariables = [
    "Kordexcord Variables:",
    "{equicordIcon} - Kordexcord icon",
    "{equicordName} - The word 'Kordexcord'",
    "{equicordVersion} - Version of Kordexcord (e.g. 1.0.0)",
    "{equicordHash} - Kordexcord build hash (e.g. 123456789)",
    "{equicordPlatform} - Platform Kordexcord is running on (e.g. Dev)",
];

export const electronVariables = [
    "Electron Variables:",
    "{electronIcon} - Electron icon",
    "{electronName} - The word 'Electron'",
    "{electronVersion} - Electron runtime version (e.g. 25.0.0)",
];

export const chromiumVariables = [
    "Chromium Variables:",
    "{chromiumIcon} - Chromium icon",
    "{chromiumName} - The word 'Chromium'",
    "{chromiumVersion} - Chromium engine version (e.g. 125.0.0.0)",
];

export const miscVariables = [
    "Miscellaneous Variables:",
    "{newline} or \\n - Newline character"
];
