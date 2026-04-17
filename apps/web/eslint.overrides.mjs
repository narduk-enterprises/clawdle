// App-specific ESLint exceptions. Keep this list tight and justified.
export default [
  {
    files: ['server/utils/dictionary.ts'],
    rules: {
      // Generated full word list for gameplay validation; line count tracks the dataset, not logic.
      'narduk/file-size-budget': 'off',
    },
  },
]
