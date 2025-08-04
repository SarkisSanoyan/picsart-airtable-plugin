# 🎨 Picsart BG Remover & Upscale

A powerful Airtable block that integrates with the Picsart API to automatically remove backgrounds from images and upscale them directly within your Airtable bases.

## ✨ Features

- **🖼️ Background Removal**: Automatically remove backgrounds from images using Picsart's AI-powered API
- **🔍 Image Upscaling**: Enhance image quality with multiple upscaling factors (2x, 4x, 6x, 8x)
- **📊 Airtable Integration**: Works seamlessly with Airtable records and attachment fields
- **🔄 Batch Processing**: Process multiple images at once with progress tracking
- **⚡ Smart Retry Logic**: Robust error handling with progressive timeouts and rate limit management
- **📱 Modern UI**: Clean, responsive interface built with Airtable's design system
- **🔒 Type-Safe**: Built with TypeScript for enhanced reliability and developer experience

## 🚀 Quick Start

### Prerequisites

- **Airtable Account**: You need an Airtable workspace
- **Picsart API Key**: Get your API key from [Picsart Developers](https://picsart.io/api)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/picsart_bg_remover_upscale.git
   cd picsart_bg_remover_upscale
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your Picsart API Key**:
   - Open the block in Airtable
   - Navigate to the Configuration section
   - Enter your Picsart API key

### Development

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## 📋 Setup Guide

### 1. Airtable Configuration

1. **Create or open an Airtable base** with image attachments
2. **Install the block** in your workspace
3. **Select your table** that contains images
4. **Choose fields**:
   - **Image Field**: The attachment field containing your source images
   - **Output Field**: The attachment field where processed images will be saved

### 2. API Configuration

1. **Get your Picsart API key**:
   - Visit [Picsart API Documentation](https://picsart.io/api)
   - Sign up for an account
   - Generate your API key

2. **Configure in the block**:
   - Enter your API key in the configuration panel
   - The key is stored securely in your Airtable workspace

## 🎯 Usage

### Processing Options

**Background Removal**:
- Removes backgrounds from images
- Outputs transparent PNG files
- Ideal for product photos, portraits

**Image Upscaling**:
- Enhances image resolution
- Choose from 2x, 4x, 6x, or 8x scaling factors
- Maintains image quality during enlargement

**Combined Processing**:
- Remove background AND upscale in one operation
- Efficient for creating high-quality transparent images

### Batch Processing

1. **Select records** to process (or process all)
2. **Choose processing action** (remove background, upscale, or both)
3. **Set upscaling factor** (if applicable)
4. **Click "Process Selected"** to start batch processing

### Monitoring Progress

- **Real-time status updates** for each image
- **Progress indicators** with detailed messaging
- **Error handling** with automatic retry attempts
- **Success confirmation** with processing results

## 🛠️ Development

### Project Structure

```
frontend/
├── components/           # React components
│   ├── common/          # Shared components
│   ├── forms/           # Form components
│   ├── image/           # Image-related components
│   └── record/          # Record management components
├── containers/          # Container components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── services/            # API and external services
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript compiler

### TypeScript

This project is fully typed with TypeScript, providing:
- **Type safety** for all components and functions
- **Enhanced IDE support** with IntelliSense
- **Compile-time error detection**
- **Better refactoring capabilities**

## 🔧 Configuration Options

### API Settings

```typescript
// Constants can be customized in frontend/utils/constants.ts
export const API_CONFIG = {
  MAX_RETRIES: 3,
  ENDPOINTS: {
    REMOVE_BG: 'https://api.picsart.io/tools/1.0/removebg',
    UPSCALE: 'https://api.picsart.io/tools/1.0/upscale'
  }
};
```

### Processing Options

- **Output Types**: PNG (background removal), JPG (upscaling)
- **Upscaling Factors**: 2x, 4x, 6x, 8x
- **Format Options**: Configurable output formats
- **Quality Settings**: Optimized for different use cases

## 📖 API Reference

### Picsart API Integration

The block integrates with two main Picsart API endpoints:

**Background Removal**:
- Endpoint: `/tools/1.0/removebg`
- Input: Image file (PNG, JPG, JPEG)
- Output: PNG with transparent background

**Image Upscaling**:
- Endpoint: `/tools/1.0/upscale`
- Input: Image file + upscale factor
- Output: Enhanced resolution image

### Rate Limiting

The block includes sophisticated rate limiting handling:
- **Progressive timeouts** for retries
- **Exponential backoff** for server errors
- **Smart retry logic** for network issues
- **User-friendly status messages**

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- **Follow TypeScript best practices**
- **Add tests for new functionality**
- **Update documentation for changes**
- **Use conventional commit messages**
- **Ensure ESLint passes**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

### Common Issues

**API Key Issues**:
- Verify your Picsart API key is valid
- Check API quota and billing status
- Ensure proper permissions

**Processing Failures**:
- Check image file formats (PNG, JPG supported)
- Verify file sizes are within API limits
- Review network connectivity

**Airtable Integration**:
- Ensure proper field types (attachment fields)
- Check workspace permissions
- Verify block installation

### Getting Help

- **Issues**: Open a GitHub issue for bugs or feature requests
- **Documentation**: Check the [Airtable Blocks SDK](https://airtable.com/developers/blocks)
- **API Documentation**: Visit [Picsart API Docs](https://picsart.io/api)

## 🙏 Acknowledgments

- **Picsart** for providing the powerful image processing API
- **Airtable** for the excellent Blocks SDK and platform
- **React** and **TypeScript** communities for great tools and resources

---

**Built with ❤️ using React, TypeScript, and the Airtable Blocks SDK**
