// Copyright (C) 2025 Keygraph, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License version 3
// as published by the Free Software Foundation.

/**
 * Get the actual model name being used.
 * When using claude-code-router, the SDK reports its configured model (claude-sonnet)
 * but the actual model is determined by ROUTER_DEFAULT env var.
 * When using GLM mode, returns the GLM model name.
 */
export function getActualModelName(sdkReportedModel?: string): string | undefined {
  // Check for GLM mode first
  if (isGlmMode()) {
    return getGlmModelName();
  }

  const routerBaseUrl = process.env.ANTHROPIC_BASE_URL;
  const routerDefault = process.env.ROUTER_DEFAULT;

  // If router mode is active and ROUTER_DEFAULT is set, use that
  if (routerBaseUrl && routerDefault) {
    // ROUTER_DEFAULT format: "provider,model" (e.g., "gemini,gemini-2.5-pro")
    const parts = routerDefault.split(',');
    if (parts.length >= 2) {
      return parts.slice(1).join(','); // Handle model names with commas
    }
  }

  // Fall back to SDK-reported model
  return sdkReportedModel;
}

/**
 * Check if router mode is active.
 */
export function isRouterMode(): boolean {
  return !!process.env.ANTHROPIC_BASE_URL && !!process.env.ROUTER_DEFAULT;
}

/**
 * Check if GLM mode is active.
 * GLM mode is active when GLM_BASE_URL is set to the GLM API endpoint.
 */
export function isGlmMode(): boolean {
  const glmBaseUrl = process.env.GLM_BASE_URL || process.env.ANTHROPIC_BASE_URL;
  return glmBaseUrl?.includes('bigmodel.cn') ?? false;
}

/**
 * Get the GLM model name.
 * Defaults to glm-4.7 but can be customized via GLM_MODEL env var.
 */
export function getGlmModelName(): string {
  return process.env.GLM_MODEL || 'glm-4.7';
}
