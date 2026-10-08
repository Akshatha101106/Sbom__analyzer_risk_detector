# SBOM Analyzer & Risk Detector

A full-stack application for analyzing Software Bill of Materials (SBOMs), detecting software vulnerabilities, evaluating component risk, and generating security reports.

The application allows users to upload or analyze CycloneDX SBOM files and provides information about components, vulnerabilities, severity, trust, and overall software supply-chain risk.

---

## 🚀 Features

- Upload and analyze SBOM files
- Support for CycloneDX SBOM format
- Extract software components and dependencies
- Vulnerability detection using the OSV (Open Source Vulnerabilities) API
- Vulnerability severity and risk analysis
- Component-level security information
- Trust and risk scoring
- Scan summary and security statistics
- JSON and CSV report generation
- Frontend dashboard for visualizing scan results
- Backend REST API
- Sample CycloneDX SBOM included for testing

---

## 🏗️ Project Structure

```text
SBOM_ANALYZER_RISK_DETECTOR/
│
├── backend/
│   └── sbomback/
│       │
│       ├── data/
│       │
│       ├── samples/
│       │   └── sample-cyclonedx.json
│       │
│       ├── src/
│       │   ├── middleware/
│       │   ├── routes/
│       │   └── services/
│       │
│       ├── config.js
│       ├── controllers.js
│       ├── errors.js
│       ├── store.js
│       ├── server.js
│       │
│       ├── test/
│       ├── .env
│       ├── .env.example
│       ├── package.json
│       └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── dist/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── README.md
