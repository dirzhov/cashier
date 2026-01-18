import { chromium } from '@playwright/test'
import fs from 'fs'

export default async () => {
  fs.rmSync('.nyc_output', { recursive: true, force: true })
  fs.mkdirSync('.nyc_output', { recursive: true })
}
