# ClipTap AI ✨
> **1-Tap AI Studio - No Login**  
> A mobile-first, high-converting AI media studio that generates **Videos, Images, and Music** with a two-step Prompt Approval workflow, Locked Concept Retake guarantee, and a built-in Credit System.

---

## 🚀 Key Features

1. **3-in-1 Generative Studio:**
   - 🎬 **Video:** 480p / 720p / 1080p generation (Wan-T2V / Wan-I2V) with Image-to-Video and side-by-side photo stitching.
   - 🖼️ **Image:** High-resolution 8K photorealistic generations via Flux.
   - 🎵 **Music:** Custom 30-second studio audio tracks and riffs via Stable Audio.

2. **2-Step Prompt Approval Workflow:**
   - **Step 1 ($0 Cost):** User idea is automatically upgraded by Gemini into 3 distinct artistic styles (Realistic & Cinematic, Dramatic & Artistic, Vintage / Dynamic).
   - **Step 2 (Credit Check):** User reviews, tweaks, and approves the English prompt before spending 1 credit.

3. **🛠️ Locked Concept Retake (1/1 Free Fix):**
   - Free retake guarantee per generation.
   - The core subject and reference photo remain **strictly locked** while Gemini refines technical parameters (lighting, face preservation, motion smoothness).

4. **💎 Monetization & Unit Economics:**
   - RevenueCat-style paywall modal ($0.99 for 1 credit, $2.99 for 5 credits, $2.99/mo subscription).
   - Live Developer Profit Tracker calculating gross revenue, App Store fees (15%), and net profit (~83% margin).

5. **🛡️ App Store & Play Store Compliance:**
   - Built-in content report modal (`🚩 דווח על תוכן פוגעני`).
   - One-click history & local data deletion.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file (see `.env.example`):
```env
GEMINI_API_KEY="your_gemini_api_key"
FAL_API_KEY="your_fal_key" # Optional: without this, zero-cost simulation is used
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📄 License
Apache-2.0
