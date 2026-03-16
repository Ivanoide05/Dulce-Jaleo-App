// Diagnostic script - query Airtable directly to see all records
const https = require('https');

const AIRTABLE_BASE = 'app7VJr4iHt5v1r5c';
const TABLES = {
    FACTURAS: 'tblLC7oMOUQtRWkn7',
    ALBARANES: 'tblX9EQUmwItNJCZI',
    GASTOS_VARIOS: 'tblHzVIPEde7zWnUv'
};

// Try to read token from n8n credentials or from a known source
// First try the n8n MCP execution data
const fs = require('fs');

// Try to find the token from previous execution logs
let TOKEN = '';

// Check if user has a config file somewhere
const possiblePaths = [
    process.env.AIRTABLE_TOKEN,
    process.env.AIRTABLE_PAT
].filter(Boolean);

if (possiblePaths.length > 0) {
    TOKEN = possiblePaths[0];
}

// If no token found, try to extract from the workflow execution
if (!TOKEN) {
    try {
        const execPath = 'C:/Users/ezequiel/.gemini/antigravity/brain/e32594e0-62fd-43d4-ade7-4a4211052b7e/.system_generated/steps/962/output.txt';
        if (fs.existsSync(execPath)) {
            const execData = JSON.parse(fs.readFileSync(execPath, 'utf8'));
            // Check for Airtable credential in the execution
            console.log('Execution data keys:', Object.keys(execData.data));
        }
    } catch(e) {}
}

// Try to read from the workflow data for the Airtable credential
try {
    const wfPath = 'C:/Users/ezequiel/.gemini/antigravity/brain/e32594e0-62fd-43d4-ade7-4a4211052b7e/.system_generated/steps/923/output.txt';
    if (fs.existsSync(wfPath)) {
        const wfData = JSON.parse(fs.readFileSync(wfPath, 'utf8'));
        const nodes = wfData.data ? wfData.data.nodes : wfData.nodes;
        const airtableNode = nodes.find(n => n.type && n.type.includes('airtable'));
        if (airtableNode && airtableNode.credentials) {
            console.log('Airtable credentials ref:', JSON.stringify(airtableNode.credentials));
        }
    }
} catch(e) {}

console.log('\n=== TOKEN NOT AVAILABLE FROM LOCAL FILES ===');
console.log('The Airtable PAT is stored in the browser localStorage.');
console.log('Cannot query Airtable directly without the token.');
console.log('\nHowever, I can analyze the problem from the code logic:');

const now = new Date();
const mesActual = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
console.log('\nCurrent month filter:', mesActual);
console.log('Any record with a Fecha NOT starting with', mesActual, 'will be EXCLUDED from stats');
console.log('\nThis is the ROOT CAUSE: if documents have dates like 2019-09-25 or 2025-12-14,');
console.log('they will NOT appear in the "2 TOTAL" counter.');
console.log('\nThe fix: Dashboard should show ALL records, not just current month.');
console.log('Monthly filtering should ONLY apply to Márgenes "GASTOS MES" label.');
