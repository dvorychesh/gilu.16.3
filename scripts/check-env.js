#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const requiredEnvVars = ['GOOGLE_API_KEY'];
const envFile = path.join(process.cwd(), '.env.local');

console.log('🔍 Checking environment...\n');

// Check if .env.local exists
if (!fs.existsSync(envFile)) {
  console.error('❌ .env.local not found!');
  console.error('\n📋 Create it from template:');
  console.error('   cp .env.local.example .env.local');
  process.exit(1);
}

// Check required variables
const envContent = fs.readFileSync(envFile, 'utf-8');
const missing = [];

requiredEnvVars.forEach((varName) => {
  const regex = new RegExp(`^${varName}=.+`, 'm');
  if (!regex.test(envContent)) {
    missing.push(varName);
  }
});

if (missing.length > 0) {
  console.error(`❌ Missing environment variables: ${missing.join(', ')}`);
  console.error('\n📋 Update .env.local with:');
  missing.forEach((v) => console.error(`   ${v}=your_value_here`));
  process.exit(1);
}

console.log('✅ All environment variables configured');
console.log(`\n📝 Loaded from: ${envFile}`);
console.log(`✓ GOOGLE_API_KEY is set\n`);
