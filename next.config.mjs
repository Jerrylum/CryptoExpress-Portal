/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // See: https://github.com/vercel/next.js/discussions/58642
    // See: https://github.com/PeculiarVentures/pkcs11js/issues/39

    // Issue: pkcs11js is not working with webpack externals
  
    /*

    > next build

    ▲ Next.js 14.1.3
    - Environments: .env

    Creating an optimized production build ...
    Failed to compile.

    ./node_modules/pkcs11js/build/Release/pkcs11.node
    Module parse failed: Unexpected character '' (1:0)
    You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
    (Source code omitted for this binary file)

    Import trace for requested module:
    ./node_modules/pkcs11js/build/Release/pkcs11.node
    ./node_modules/pkcs11js/index.js
    ./node_modules/@hyperledger/fabric-gateway/dist/identity/hsmsigner.js
    ./node_modules/@hyperledger/fabric-gateway/dist/identity/signers.js
    ./node_modules/@hyperledger/fabric-gateway/dist/index.js
    ./gateway/Gateway.ts
    ./internal/AddressCollection.ts


    > Build failed because of webpack errors
    
    */

    // However, although the following code suppresses the error
  
    /*
    // Important: return the modified config
    return {
      ...config,
      externals: {
        'pkcs11js': 'require("pkcs11js")',
      }
    }

    */

    // It produces a build error:

    /*
    > next build

    ▲ Next.js 14.1.3
    - Environments: .env

      Creating an optimized production build ...
    ✓ Compiled successfully
    ✓ Linting and checking validity of types    
    ✓ Collecting page data    
      Generating static pages (0/5)  [    ]TypeError: Cannot read properties of null (reading 'useContext')
        at t.useContext (/home/ubuntu/CryptoExpress-Portal/.next/server/chunks/397.js:100:5556)
        at m (/home/ubuntu/CryptoExpress-Portal/.next/server/pages/_error.js:1:26227)
        at Wc (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:68:44)
        at Zc (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:70:253)
        at Z (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:76:89)
        at $c (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:78:98)
        at bd (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:77:404)
        at Z (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:76:217)
        at $c (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:78:98)
        at Zc (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:71:145)

    Error occurred prerendering page "/404". Read more: https://nextjs.org/docs/messages/prerender-error

    TypeError: Cannot read properties of null (reading 'useContext')
        at t.useContext (/home/ubuntu/CryptoExpress-Portal/.next/server/chunks/397.js:100:5556)
        at m (/home/ubuntu/CryptoExpress-Portal/.next/server/pages/_error.js:1:26227)
        at Wc (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:68:44)
        at Zc (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:70:253)
        at Z (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:76:89)
        at $c (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:78:98)
        at bd (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:77:404)
        at Z (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:76:217)
        at $c (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:78:98)
        at Zc (/home/ubuntu/CryptoExpress-Portal/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:71:145)
      Generating static pages (2/5)  [=   ]
    
    ...

    */

    // Only the following code works

    config.externals.push({'pkcs11js': 'require("pkcs11js")'})

    return config;
  }
};

export default nextConfig;
