export function useSettings() {
    const hardMode = useState<boolean>('settings-hard-mode', () => false)
    const darkMode = useColorMode()

    function toggleHardMode() {
        hardMode.value = !hardMode.value
    }

    function toggleDarkMode() {
        darkMode.preference = darkMode.preference === 'dark' ? 'light' : 'dark'
    }

    return {
        hardMode,
        darkMode,
        toggleHardMode,
        toggleDarkMode,
    }
}
