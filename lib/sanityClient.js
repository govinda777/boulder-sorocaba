import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'lzd8ynvi',
  dataset: 'production',
  apiVersion: '2021-03-25',
  token:
    'skqfXTpjuiLjBTFZPgFfyj1kr4obAxECt1nxtG8qoU0eKKtjNhbUROrAEjycXOew1pCw3jWf5A1A2c3L5ttptUIIBSNAUaY8zaI0ZIg0rdwoRWUfwgRFaBCHWaz4iqUp4qX1LKoxZGZWdBFmTOpj2E1aRzB3fzPWcVfzbFtjsdLLoQuxC5lf',
  useCdn: false,
})
