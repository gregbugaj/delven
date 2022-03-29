module.exports = {
    extends: [
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    plugins: [
      'prettier',
    ],
    rules: {
      // In an ideal world, we'd never have to use @ts-ignore, but that's not
      // possible right now.
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
  
      // Again, in theory this is a good rule, but it can cause a bit of
      // unhelpful noise.
      '@typescript-eslint/explicit-function-return-type': 'off',
  
      // Another theoretically good rule, but sometimes we know better than
      // the linter.
      '@typescript-eslint/no-non-null-assertion': 'off',
      'prefer-object-spread': 'error',
  
      // Use template strings instead of string concatenation
      'prefer-template': 'error',
  
      // This is documented as the default, but apparently now needs to be
      // set explicitly
      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true,
        },
      ],
    },
  };
  