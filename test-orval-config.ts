import { config } from 'dotenv'
import { defineConfig } from 'orval'

config({ path: '.env.local' })

export default defineConfig({
  compliance: {
    input: {
      target: `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'https://test.compliance.dstax.com'}/api/schema/`,
    },
    output: {
      target: 'src/api/generated/',
    },
  },
})
