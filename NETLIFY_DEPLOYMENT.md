# Netlify Deployment Guide

This guide will help you deploy the Knowly quiz app to Netlify.

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account (recommended for automatic deployments)
2. A Netlify account (free tier works great)
3. Your code repository pushed to your Git provider

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended for first-time setup)

1. **Connect to Netlify:**
   - Go to [netlify.com](https://www.netlify.com)
   - Sign up or log in
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

2. **Configure Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** `20` (automatically set via `netlify.toml`)

3. **Environment Variables (if needed):**
   - Click "Show advanced" → "New variable"
   - Add any required environment variables
   - For this app, no environment variables are required

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically detect Next.js and use the `@netlify/plugin-nextjs`
   - Wait for the build to complete

5. **Configure Domain (Optional):**
   - Netlify provides a random subdomain (e.g., `your-site.netlify.app`)
   - You can customize it in Site settings → Domain management
   - Add your custom domain if you have one

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize the site:**
   ```bash
   netlify init
   ```
   - Follow the prompts to link your site
   - Choose "Create & configure a new site" or "Link this directory to an existing site"

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

## Configuration Files

The project includes the following Netlify configuration:

### `netlify.toml`
- Build settings and environment variables
- Redirects for static assets and PWA files
- Security headers
- Caching headers for optimal performance

### `.netlify/plugins/nextjs.js`
- Configures Netlify's Next.js plugin
- Enables automatic Next.js function generation

### `next.config.js`
- Optimized for Netlify deployment
- PWA configuration with service worker
- Image optimization settings

## Post-Deployment Checklist

1. **Test the deployment:**
   - Visit your Netlify URL
   - Test all quiz features
   - Verify PWA functionality (install prompt, offline mode)

2. **Enable HTTPS:**
   - Netlify automatically enables HTTPS for all sites
   - Custom domains get free SSL certificates

3. **Configure Custom Domain (Optional):**
   - Go to Site settings → Domain management
   - Add your custom domain
   - Update DNS records as instructed

4. **Set up Continuous Deployment:**
   - Automatic deployments happen on push to your main branch
   - Configure branch deployments for previews
   - Set up deploy contexts in Site settings → Build & deploy

## Performance Optimizations

The app is already optimized with:
- ✅ Static asset caching (1 year)
- ✅ Service worker for offline support
- ✅ Security headers
- ✅ Image optimization
- ✅ Code compression

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure Node.js version is 20 (configured in `netlify.toml`)
- Verify all dependencies are in `package.json`

### PWA Not Working
- Clear browser cache
- Check if service worker is registered (DevTools → Application → Service Workers)
- Verify `manifest.json` is accessible

### Routing Issues
- Netlify's Next.js plugin handles routing automatically
- If issues persist, check `netlify.toml` redirects

### CSV Files Not Loading
- Ensure CSV files are in `public/assets/` directory
- Check file paths in code match the deployed structure

## Support

For issues specific to:
- **Netlify:** Check [Netlify Documentation](https://docs.netlify.com)
- **Next.js on Netlify:** Check [Next.js on Netlify Guide](https://docs.netlify.com/integrations/frameworks/next-js/)
- **PWA:** Check [PWA Documentation](https://web.dev/progressive-web-apps/)

