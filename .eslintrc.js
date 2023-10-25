module.exports = {
    root: true,
    parser: "@babel/eslint-parser",
    parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: {
            experimentalDecorators: true,
        },
    },
    plugins: ["prettier"],
    extends: ["eslint:recommended", "google", "plugin:prettier/recommended"],
    rules: {
        curly: ["error", "all"],
        "new-cap": "off",
        "require-jsdoc": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        camelcase: "off",
        "no-invalid-this": "off",
        "max-len": [
            "error",
            {
                code: 80,
                ignoreStrings: true,
                ignoreRegExpLiterals: true,
                ignoreComments: true,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreTemplateLiterals: true,
            },
        ],
        semi: ["error", "never"],
        quotes: [
            "error",
            "double",
            {
                allowTemplateLiterals: true,
            },
        ],
        "comma-dangle": [
            "error",
            {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: "never",
            },
        ],
        "object-curly-spacing": ["error", "always"],
        "arrow-parens": ["error", "always"],
        "linebreak-style": 0,
        "no-confusing-arrow": [
            "error",
            {
                allowParens: false,
            },
        ],
        "space-before-function-paren": [
            "error",
            {
                anonymous: "always",
                named: "never",
                asyncArrow: "always",
            },
        ],
        "space-infix-ops": "error",
        "eol-last": ["error", "always"],
    },
    env: {
        es6: true,
        node: true,
        jest: true,
    },
    ignorePatterns: [],
    overrides: [
        {
            files: ["*.ts"],
            plugins: ["@typescript-eslint/eslint-plugin"],
            extends: ["plugin:@typescript-eslint/recommended"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: [
                    "./tsconfig.json"
                ],
            },
            rules: {
                "valid-jsdoc": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-floating-promises": "error",
                "@typescript-eslint/await-thenable": "error",
                "@typescript-eslint/promise-function-async": "error",
                "@typescript-eslint/keyword-spacing": "error",
                "@typescript-eslint/space-before-function-paren": [
                    "error",
                    {
                        anonymous: "always",
                        named: "never",
                        asyncArrow: "always",
                    },
                ],
                "@typescript-eslint/space-infix-ops": "error",

                "@typescript-eslint/ban-ts-comment": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/ban-types": "off",
                "@typescript-eslint/no-var-requires": "off",
            },
        },
        {
            files: ["src/admin/**/*.ts", "src/admin/**/*.tsx"],
            plugins: ["unused-imports"],
            extends: [
                "plugin:react/recommended",
                "plugin:react/jsx-runtime",
                "plugin:react-hooks/recommended",
            ],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
                sourceType: "module", // Allows for the use of imports
                project: "./tsconfig.admin.json",
            },
            globals: {
                __BASE__: "readonly",
            },
            env: {
                browser: true,
            },
            rules: {
                "prettier/prettier": "error",
                "react/prop-types": "off",
                "new-cap": "off",
                "require-jsdoc": "off",
                "valid-jsdoc": "off",
                "no-unused-expressions": "off",
                "unused-imports/no-unused-imports": "error",
                "unused-imports/no-unused-vars": [
                    "warn",
                    {
                        vars: "all",
                        varsIgnorePattern: "^_",
                        args: "after-used",
                        argsIgnorePattern: "^_",
                    },
                ],
            },
        },
    ],
}
