import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

console.log('Testing Terminal Continuous Simulation Architecture & Interactive Controls...')

const terminalSourcePath = path.resolve(process.cwd(), 'src/components/product/TerminalSimulator.astro')
const terminalSource = fs.readFileSync(terminalSourcePath, 'utf8')

const distIndexPath = path.resolve(process.cwd(), 'dist/index.html')
const distIndex = fs.readFileSync(distIndexPath, 'utf8')

// 1. Verify simulation indicators and disclaimer pills in source and dist
assert(terminalSource.includes('LIVE SIMULATION'), 'Terminal must contain LIVE SIMULATION indicator')
assert(terminalSource.includes('[SIMULATED WALKTHROUGH]'), 'Terminal must include SIMULATED WALKTHROUGH badge')
assert(distIndex.includes('LIVE SIMULATION'), 'dist/index.html must contain LIVE SIMULATION indicator')
assert(distIndex.includes('SIMULATED WALKTHROUGH'), 'dist/index.html must include SIMULATED WALKTHROUGH badge')

// 2. Verify interactive control buttons exist
assert(terminalSource.includes('id="btn-pause-trace"'), 'Terminal must have Pause/Resume button')
assert(terminalSource.includes('id="btn-replay-trace"'), 'Terminal must have Replay button')
assert(terminalSource.includes('id="sim-live-indicator"'), 'Terminal must have sim-live-indicator')
assert(distIndex.includes('id="btn-pause-trace"'), 'dist/index.html must have btn-pause-trace')
assert(distIndex.includes('id="btn-replay-trace"'), 'dist/index.html must have btn-replay-trace')
assert(distIndex.includes('id="sim-live-indicator"'), 'dist/index.html must have sim-live-indicator')

// 3. Verify all 5 pipeline stages exist
for (let stage = 1; stage <= 5; stage++) {
  assert(
    terminalSource.includes(`data-step="${stage}"`),
    `Terminal must have trace-step-indicator for stage ${stage}`
  )
  assert(
    terminalSource.includes(`data-stage="${stage}"`),
    `Terminal must have trace-stage-block for stage ${stage}`
  )
}

// 4. Verify 11 log lines exist in trace
const logLineMatches = terminalSource.match(/class="log-line[^"]*"/g) || []
assert(logLineMatches.length >= 11, `Expected at least 11 log lines in terminal, found ${logLineMatches.length}`)

// 5. Verify dynamic timestamp placeholders exist
const tsMatches = terminalSource.match(/class="log-ts text-dim"/g) || []
assert(tsMatches.length >= 7, `Expected at least 7 log-ts timestamp elements, found ${tsMatches.length}`)

// 6. Verify client script handles pause, resume, replay, viewport, and reduced motion
assert(terminalSource.includes('prefers-reduced-motion: reduce'), 'Script must check prefers-reduced-motion')
assert(terminalSource.includes('IntersectionObserver'), 'Script must observe viewport intersection')
assert(terminalSource.includes('visibilitychange'), 'Script must handle tab visibility changes')
assert(terminalSource.includes('STAGE_COMPLETE_DELAY'), 'Script must handle stage 5 completion delay')
assert(terminalSource.includes('LOOP_RESTART_DELAY'), 'Script must handle loop restart pause')
assert(terminalSource.includes('formatElapsed'), 'Script must format elapsed timestamp dynamically')

// 7. Verify mobile responsive layout styles exist
assert(terminalSource.includes('.trace-controls-group'), 'CSS must include .trace-controls-group')
assert(terminalSource.includes('.sim-live-indicator'), 'CSS must include .sim-live-indicator')
assert(terminalSource.includes('.sim-pulse-dot'), 'CSS must include .sim-pulse-dot')
assert(terminalSource.includes('@keyframes simPulse'), 'CSS must include simPulse keyframe animation')
assert(terminalSource.includes('.terminal-card.is-simulating .log-line'), 'CSS must style simulated log lines')

console.log('✓ All Terminal Continuous Simulation static checks passed successfully!')
