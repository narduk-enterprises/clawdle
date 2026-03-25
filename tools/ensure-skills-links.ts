#!/usr/bin/env -S pnpm exec tsx
/**
 * Ensures each local agent-facing `skills` entry in the repo points at the
 * committed skill directory:
 * - Prefer `.github/skills` when it exists as physical repo content so GitHub
 *   coding agents can read the same skills from the repository.
 * - Fall back to `.agents/skills` for older repos that still vendor skills
 *   there.
 * - `.cursor/skills`, `.codex/skills`, `.agent/skills`, `.claude/skills`
 *   become relative symlinks to the chosen committed directory.
 *
 * Invoked by `pnpm run skills:link` or `pnpm run setup` when local agent entry
 * points need to be repaired.
 */
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  unlinkSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const selfPath = fileURLToPath(import.meta.url)
const entryPath = process.argv[1] ? resolve(process.argv[1]) : ''
const isMainModule = Boolean(entryPath && entryPath === selfPath)

const LOCAL_AGENT_SKILL_ROOTS = ['.cursor', '.codex', '.agent', '.claude']
const TRANSIENT_SKILLS_DIRECTORIES = new Set([
  '.git',
  '__pycache__',
  '.pytest_cache',
  'node_modules',
])
const TRANSIENT_SKILLS_FILES = new Set(['.DS_Store'])

export interface EnsureSkillsLinksOptions {
  dryRun?: boolean
  log?: (message: string) => void
}

interface RepoSkillsTarget {
  path: string
  relativeTarget: string
}

function ensureParentDir(dir: string, dryRun: boolean, log: (message: string) => void) {
  if (existsSync(dir)) return
  log(`  ADD: mkdir ${dir}`)
  if (!dryRun) {
    mkdirSync(dir, { recursive: true })
  }
}

/** True if anything exists at path (including a broken symlink). */
function pathOccupied(linkPath: string): boolean {
  try {
    lstatSync(linkPath)
    return true
  } catch {
    return false
  }
}

function removeExistingPath(path: string): void {
  const stat = lstatSync(path)

  if (stat.isSymbolicLink()) {
    unlinkSync(path)
    return
  }

  rmSync(path, { recursive: true, force: true })
}

function pruneSkillsArtifacts(
  rootDir: string,
  dryRun: boolean,
  log: (message: string) => void,
): void {
  if (!existsSync(rootDir) || !lstatSync(rootDir).isDirectory()) return

  const visit = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        if (TRANSIENT_SKILLS_DIRECTORIES.has(entry.name)) {
          log(`  REMOVE transient skills dir: ${fullPath}`)
          if (!dryRun) rmSync(fullPath, { recursive: true, force: true })
          continue
        }

        visit(fullPath)
        continue
      }

      if (TRANSIENT_SKILLS_FILES.has(entry.name) || entry.name.endsWith('.pyc')) {
        log(`  REMOVE transient skills file: ${fullPath}`)
        if (!dryRun) rmSync(fullPath, { force: true })
      }
    }
  }

  visit(rootDir)
}

function resolveRepoSkillsTarget(appDir: string): RepoSkillsTarget | null {
  const candidates: RepoSkillsTarget[] = [
    {
      path: join(appDir, '.github', 'skills'),
      relativeTarget: '../.github/skills',
    },
    {
      path: join(appDir, '.agents', 'skills'),
      relativeTarget: '../.agents/skills',
    },
  ]

  for (const candidate of candidates) {
    if (!existsSync(candidate.path)) continue

    try {
      const stat = lstatSync(candidate.path)
      if (stat.isDirectory() && !stat.isSymbolicLink()) {
        return candidate
      }
    } catch {
      // Skip paths that vanish mid-run.
    }
  }

  return null
}

export function ensureSkillsLinks(appDir: string, options: EnsureSkillsLinksOptions = {}): void {
  const dryRun = options.dryRun ?? false
  const log = options.log ?? console.log
  const repoSkillsTarget = resolveRepoSkillsTarget(appDir)
  if (!repoSkillsTarget) {
    log('  SKIP: skills links (no physical .github/skills or .agents/skills directory found)')
    return
  }

  pruneSkillsArtifacts(repoSkillsTarget.path, dryRun, log)

  for (const root of LOCAL_AGENT_SKILL_ROOTS) {
    const rootDir = join(appDir, root)
    const linkPath = join(rootDir, 'skills')

    ensureParentDir(rootDir, dryRun, log)

    let needsReplace = false
    if (pathOccupied(linkPath)) {
      needsReplace = true
      try {
        const st = lstatSync(linkPath)
        if (st.isSymbolicLink()) {
          const target = readlinkSync(linkPath)
          if (target === repoSkillsTarget.relativeTarget) {
            needsReplace = false
          }
        }
      } catch {}
    } else {
      needsReplace = true
    }

    if (needsReplace) {
      if (pathOccupied(linkPath)) {
        log(`  REMOVE old symlink/dir: ${linkPath}`)
        if (!dryRun) {
          removeExistingPath(linkPath)
        }
      }

      log(`  ADD symlink: ${root}/skills -> ${repoSkillsTarget.relativeTarget}`)
      if (!dryRun) {
        if (pathOccupied(linkPath)) {
          throw new Error(`Failed to clear existing path before linking: ${linkPath}`)
        }
        const originalDir = process.cwd()
        process.chdir(rootDir)
        try {
          symlinkSync(repoSkillsTarget.relativeTarget, 'skills')
        } finally {
          process.chdir(originalDir)
        }
      }
    }
  }

  const legacyRootSkills = join(appDir, '.skills')
  if (pathOccupied(legacyRootSkills)) {
    log('  REMOVE: legacy repo-root .skills')
    if (!dryRun) removeExistingPath(legacyRootSkills)
  }
}

if (isMainModule) {
  const root = resolve(__dirname, '..')
  const dryRun = process.argv.includes('--dry-run')
  console.log('')
  console.log(`Skills links: ${root}${dryRun ? ' [DRY RUN]' : ''}`)
  ensureSkillsLinks(root, { dryRun, log: console.log })
  console.log('')
}
