/**
 * Composable for haptic feedback on mobile devices.
 *
 * - Uses the Vibration API on Android (Chrome, Firefox, etc.)
 * - Uses Selection API trick on iOS Safari to trigger Taptic Engine feedback.
 */
export function useHaptics() {
    /**
     * Trigger a light haptic tap — used on key presses.
     */
    function lightTap() {
        if (import.meta.server) return
        vibrate(10)
    }

    /**
     * Trigger a medium haptic tap — used on submit/enter.
     */
    function mediumTap() {
        if (import.meta.server) return
        vibrate(20)
    }

    /**
     * Trigger an error haptic pattern — used on invalid input.
     */
    function errorTap() {
        if (import.meta.server) return
        vibrate([30, 50, 30])
    }

    /**
     * Trigger a success haptic pattern — used on winning.
     */
    function successTap() {
        if (import.meta.server) return
        vibrate([10, 30, 10, 30, 10])
    }

    return {
        lightTap,
        mediumTap,
        errorTap,
        successTap,
    }
}

/**
 * Attempt to vibrate using the Vibration API.
 * Falls back to a Safari-specific selection trick for iOS Taptic Engine.
 */
function vibrate(pattern: number | number[]): void {
    if (import.meta.client) {
        // Standard Vibration API (Android Chrome, etc.)
        if ('vibrate' in navigator) {
            try {
                navigator.vibrate(pattern)
                return
            }
            catch {
                // Vibration API might be blocked; fall through to fallback
            }
        }

        // iOS Safari fallback: trigger selection change which can invoke Taptic Engine
        try {
            const el = document.createElement('div')
            el.style.position = 'fixed'
            el.style.top = '-100px'
            el.style.opacity = '0'
            el.style.pointerEvents = 'none'
            el.textContent = '\u200b' // zero-width space
            document.body.appendChild(el)
            const range = document.createRange()
            range.selectNode(el)
            const selection = window.getSelection()
            selection?.removeAllRanges()
            selection?.addRange(range)
            // Clean up after a frame
            requestAnimationFrame(() => {
                selection?.removeAllRanges()
                el.remove()
            })
        }
        catch {
            // Silently fail if this trick doesn't work
        }
    }
}
