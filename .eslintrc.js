module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        globalThis: 'readonly',
        RequestInit: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            globalReturn: false,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', '@typescript-eslint'],
    rules: {
        'react/prop-types': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-unused-vars': 'off', // Disable base rule for TypeScript
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
