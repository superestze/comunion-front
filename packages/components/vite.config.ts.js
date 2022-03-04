// vite.config.ts
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueTSX from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import windiCSS from 'vite-plugin-windicss'
var vite_config_default = defineConfig({
  plugins: [vue(), vueTSX(), windiCSS()],
  resolve: {
    alias: {
      '@/ex': path.resolve(
        '/Users/erguotou/workspace/comunion/front-next/packages/components',
        'demo'
      ),
      '@/comps': path.resolve(
        '/Users/erguotou/workspace/comunion/front-next/packages/components',
        'src'
      )
    },
    extensions: ['.ts', '.tsx', '.js', '.css', '.json']
  },
  server: {
    host: '0.0.0.0',
    port: 3001
  }
})
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZVRTWCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgd2luZGlDU1MgZnJvbSAndml0ZS1wbHVnaW4td2luZGljc3MnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdnVlKCksIHZ1ZVRTWCgpLCB3aW5kaUNTUygpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQC9leCc6IHBhdGgucmVzb2x2ZShcIi9Vc2Vycy9lcmd1b3RvdS93b3Jrc3BhY2UvY29tdW5pb24vZnJvbnQtbmV4dC9wYWNrYWdlcy9jb21wb25lbnRzXCIsICdkZW1vJyksXG4gICAgICAnQC9jb21wcyc6IHBhdGgucmVzb2x2ZShcIi9Vc2Vycy9lcmd1b3RvdS93b3Jrc3BhY2UvY29tdW5pb24vZnJvbnQtbmV4dC9wYWNrYWdlcy9jb21wb25lbnRzXCIsICdzcmMnKVxuICAgIH0sXG4gICAgZXh0ZW5zaW9uczogWycudHMnLCAnLnRzeCcsICcuanMnLCAnLmNzcycsICcuanNvbiddXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBwb3J0OiAzMDAxXG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxPQUFPLFVBQVU7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxRQUFRLEtBQUssUUFBUSxxRUFBcUU7QUFBQSxNQUMxRixXQUFXLEtBQUssUUFBUSxxRUFBcUU7QUFBQTtBQUFBLElBRS9GLFlBQVksQ0FBQyxPQUFPLFFBQVEsT0FBTyxRQUFRO0FBQUE7QUFBQSxFQUU3QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
