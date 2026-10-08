/**
 * Centralized API Client for SBOM Risk & Trust Auditor
 * 
 * Target Backend: http://localhost:5000
 * Handles health checking, SBOM upload requests, and graceful fallback.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Checks the status of the Express backend on port 5000
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        isOnline: true,
        message: data.message || "Connected to backend",
        url: API_BASE_URL,
      };
    }
    return {
      isOnline: false,
      message: `Backend returned HTTP ${response.status}`,
      url: API_BASE_URL,
    };
  } catch (err) {
    return {
      isOnline: false,
      message: err.name === "AbortError" ? "Backend connection timed out" : "Backend unreachable (Port 5000 offline)",
      url: API_BASE_URL,
    };
  }
}

/**
 * Upload and analyze an SBOM file via backend API
 * If backend endpoint is unavailable or returns an error, returns clean error status
 */
export async function uploadSbom(file) {
  try {
    const formData = new FormData();
    formData.append("sbom", file);

    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        isLive: true,
        data: result,
      };
    }
    
    // If the backend has not yet implemented /api/scan
    return {
      success: false,
      isLive: false,
      error: `Backend endpoint /api/scan responded with status ${response.status}`,
    };
  } catch {
    return {


      success: false,
      isLive: false,
      error: "Backend API is not currently reachable. Use demo mode to preview audit capabilities.",
    };
  }
}

/**
 * Validates basic CycloneDX / SPDX JSON schema on the client
 */
export function validateSbomJson(fileContent) {
  try {
    const parsed = JSON.parse(fileContent);
    
    // Check CycloneDX format
    if (parsed.bomFormat === "CycloneDX" || parsed.$schema?.includes("cyclonedx") || parsed.components) {
      return {
        isValid: true,
        format: "CycloneDX",
        version: parsed.specVersion || "1.5",
        componentCount: Array.isArray(parsed.components) ? parsed.components.length : 0,
        hasDependencies: Array.isArray(parsed.dependencies) && parsed.dependencies.length > 0,
        metadata: parsed.metadata || {},
      };
    }

    // Check SPDX format
    if (parsed.spdxVersion || parsed.SPDXID || parsed.packages) {
      return {
        isValid: true,
        format: "SPDX",
        version: parsed.spdxVersion || "2.3",
        componentCount: Array.isArray(parsed.packages) ? parsed.packages.length : 0,
        hasDependencies: Array.isArray(parsed.relationships) && parsed.relationships.length > 0,
        metadata: { name: parsed.name },
      };
    }

    return {
      isValid: false,
      error: "Document does not match recognized CycloneDX or SPDX JSON specifications.",
    };
  } catch (e) {
    return {
      isValid: false,
      error: `Invalid JSON syntax: ${e.message}`,
    };
  }
}
