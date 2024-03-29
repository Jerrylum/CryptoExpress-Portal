
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log("Preparing to start gateway...");
    
    // import("./gateway/gateway").then(({ startGateway }) => { startGateway(); });
  } else {
    console.log("Gateway not started. NEXT_RUNTIME is not 'nodejs'.");
  }
}