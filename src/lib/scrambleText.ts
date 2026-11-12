/**
 * Monospaced text decryption utility.
 * Resolves completely into the target text without ever leaving corrupted symbols.
 * Permanently respects prefers-reduced-motion and includes a hard resolution safety timeout.
 */

const CHARS = '0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?'

export function initTextScramble() {
  if (typeof window === 'undefined') return

  const elements = document.querySelectorAll<HTMLElement>('[data-scramble]')
  if (!elements.length) return

  // Check prefers-reduced-motion: immediately set final text and exit
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((el) => {
      const finalContent = el.dataset.scramble || el.textContent || ''
      el.innerText = finalContent
    })
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          const finalContent = el.dataset.scramble || el.textContent || ''
          scrambleElement(el, finalContent)
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.15 }
  )

  elements.forEach((el) => observer.observe(el))
}

function scrambleElement(element: HTMLElement, targetText: string) {
  let iteration = 0
  const maxIterations = targetText.length + 8
  const interval = 16 // ms

  const timer = setInterval(() => {
    element.innerText = targetText
      .split('')
      .map((letter, index) => {
        if (letter === ' ') return ' '
        if (index < iteration) {
          return targetText[index]
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      })
      .join('')

    if (iteration >= maxIterations) {
      clearInterval(timer)
      element.innerText = targetText
    }

    iteration += 1
  }, interval)

  // Hard safety timeout: guaranteed resolution within 400ms under any circumstances
  setTimeout(() => {
    clearInterval(timer)
    element.innerText = targetText
  }, 400)
}
