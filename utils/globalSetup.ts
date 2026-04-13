import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(_config: FullConfig): Promise<void> {
  const authDir = path.resolve('.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
    console.log('[globalSetup] Created .auth/ directory.');
  }
}

export default globalSetup;