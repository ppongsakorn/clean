export default defineEventHandler(() => {
  return {
    status: 'ok',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  }
})
