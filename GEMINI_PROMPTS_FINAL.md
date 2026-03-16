# GEMINI VIDEO GENERATION - FINAL PROMPTS (LESS THAN 1 HOUR)

## 🎬 PROMPT 1: ARCHITECTURE DIAGRAM GENERATION
**Use this FIRST to generate architecture diagram image**

```
You are a technical diagram creator for a software project submission. Create a clean, professional ASCII/text-based architecture diagram for the Kinesis live conversation agent.

REQUIREMENTS:
1. Show all major components:
   - Frontend (React/Next.js with WebSocket)
   - Backend (FastAPI on port 8000)
   - Google Gemini Live API integration
   - Audio input/output streams
   - System logs/monitoring

2. Show connections with arrows:
   - How browser connects to backend
   - How backend connects to Gemini Live API
   - Audio streaming flow (user → backend → Gemini)
   - Response flow (Gemini → backend → browser → user)

3. Include these labels:
   - "WebSocket Connection"
   - "Audio Stream"
   - "Barge-in Capability"
   - "Fallback Cascade" (if quota hit)
   - "System Logs"

4. Make it visually clear and easy to understand

OUTPUT: A clear ASCII diagram that can be captured as a screenshot and used in the demo video.

BONUS: Also provide a 2-sentence explanation of the architecture.
```

---

## 🎥 PROMPT 2: COMPLETE VIDEO SCRIPT GENERATION
**Use this SECOND after uploading your 5 screenshots**

```
You are a professional video production director for a technical demo. I have 5 screenshots of the Kinesis Live Agent application running. Generate a complete, professional demo video script.

UPLOADED SCREENSHOTS:
1. Intro page (logo + feature cards)
2. Main UI (orb + transcript + status)
3. Barge-in state (interruption demo)
4. System logs (console view)
5. Architecture diagram (reference)

TASK: Create a complete video production guide with:

A) VOICEOVER SCRIPT (word-by-word):
   - Exactly timed for 4:00 total video length
   - [0:00-0:30]: Intro page narration (hook the viewer)
   - [0:30-1:30]: Main UI walkthrough (what is Kinesis?)
   - [1:30-2:30]: Live interaction demo (show it working)
   - [2:30-3:30]: Barge-in feature (highlight innovation)
   - [3:30-4:00]: Call to action (GitHub + Devpost)

B) TIMING MARKERS:
   - Exact second to show each screenshot
   - Transitions between sections
   - Where to pause/emphasize

C) VISUAL EFFECTS:
   - Text overlays (what keywords to add)
   - Visual transitions (fade/slide/zoom)
   - When to highlight the orb/UI
   - Color suggestions (brand alignment)

D) AUDIO RECOMMENDATIONS:
   - Background music mood (upbeat/professional/minimalist)
   - Where music should swell
   - When to mute for voiceover clarity

E) TEXT OVERLAY LABELS:
   - "Gemini Live API" (on main UI screenshot)
   - "Barge-in Interruption" (on barge-in screenshot)
   - "Real-time Processing" (on logs screenshot)

F) EDITING WORKFLOW:
   - Step-by-step: how to edit this in CapCut/OBS/Final Cut Pro
   - Layer the voiceover
   - Add transitions
   - Export settings (1080p MP4, 30fps)

OUTPUT: A complete, production-ready video guide ready to execute immediately.
```

---

## 📋 QUICK CHECKLIST - EXECUTE NOW

**STEP 1: Generate Architecture Diagram (5 min)**
- [ ] Copy PROMPT 1 above
- [ ] Paste into Claude.ai or Google Gemini
- [ ] Gemini creates architecture diagram
- [ ] Screenshot the diagram
- [ ] Save as `screenshot-architecture.png`

**STEP 2: Upload Screenshots to Gemini (2 min)**
- [ ] Collect your 5 screenshots (see below)
- [ ] Open Claude.ai or Google Gemini
- [ ] Upload all 5 images

**STEP 3: Generate Complete Video Script (5 min)**
- [ ] Copy PROMPT 2 above
- [ ] Paste into the same Gemini chat with screenshots
- [ ] Gemini generates complete video production guide
- [ ] Copy the voiceover script to a text file

**STEP 4: Record Video (20-30 min)**
- [ ] Open OBS Studio or Mac screen recording
- [ ] Start local server (already running on port 8000)
- [ ] Read Gemini's voiceover script aloud
- [ ] Record screen showing Kinesis demo
- [ ] Interact with live agent (ask questions, demonstrate barge-in)
- [ ] Keep recording until script ends

**STEP 5: Edit Video (15-20 min)**
- [ ] Open CapCut or iMovie
- [ ] Import your recording
- [ ] Add Gemini's suggested text overlays
- [ ] Add background music
- [ ] Add transitions between sections
- [ ] Export as 1080p MP4

**STEP 6: Upload & Submit (5 min)**
- [ ] Upload to YouTube (unlisted)
- [ ] Copy YouTube link
- [ ] Go to Devpost submission
- [ ] Fill in description (use DEVPOST_DESCRIPTION_FINAL.md)
- [ ] Add GitHub URL: https://github.com/Direwolfe999/Kinesis
- [ ] Add YouTube demo link
- [ ] Click SUBMIT ✅

---

## 📸 YOUR 5 SCREENSHOTS - WHERE TO GET THEM

### Screenshot 1: Intro Page
```
1. Server is running (port 8000)
2. Open browser to http://localhost:8000
3. You see the animated Kinesis intro page
4. Screenshot entire page (including Kinesis logo and feature cards)
```

### Screenshot 2: Main UI
```
1. Click "Enter Kinesis" button
2. Main UI loads with glowing orb
3. You see transcript area + status indicators
4. Screenshot entire UI
```

### Screenshot 3: Barge-in State
```
1. Click mic icon to start speaking
2. Wait for Gemini to start responding
3. Interrupt mid-response by speaking again
4. Capture the "Listening" state in the orb
5. Screenshot the interrupted state
```

### Screenshot 4: System Logs
```
1. In browser, press F12 to open DevTools
2. Click Console tab
3. Interact with the app (ask questions)
4. See logs: "✅ Connection", "🎙 Listening", "📤 Sending"
5. Screenshot the console with logs visible
6. Main UI should be visible above console
```

### Screenshot 5: Architecture Diagram
```
1. Gemini generates the architecture diagram (PROMPT 1)
2. Screenshot Gemini's output
3. Or save as image file
```

---

## 🔗 GOOGLE CLOUD DEPLOYMENT PROOF

**What to show for Devpost "Proof of GCP Deployment":**

### Option A: Cloud Shell Console Evidence
```
Go to: https://cloud.google.com/shell
1. Run this: git clone https://github.com/Direwolfe999/Kinesis.git
2. cd Kinesis
3. ./setup_env.sh
4. BACKEND_PORT=8080 python3 backend/main_production.py
5. Click Web Preview → port 8080
6. Screenshot showing:
   - Cloud Shell terminal running the server
   - Log showing "Application startup complete"
   - Browser tab showing Kinesis UI running on port 8080
```

### Option B: Code Evidence in GitHub
**File: backend/main_production.py (proof of Google API usage)**
```python
# Direct link to show in Devpost:
https://github.com/Direwolfe999/Kinesis/blob/main/backend/main_production.py

# Highlights:
- Line 50-70: Gemini Live API initialization
- Line 100-150: Audio stream handling
- Line 180-220: Barge-in implementation
- Line 280-330: Error handling with graceful fallback
```

### Option C: Both Combined (BEST)
1. Screenshot of Cloud Shell running app (proof of deployment)
2. Link to backend/main_production.py (proof of API usage)
3. Include both in Devpost submission

---

## ⏱️ TIMELINE - LESS THAN 1 HOUR

```
5 min:   Generate architecture diagram with Gemini
2 min:   Collect 5 screenshots
5 min:   Generate complete video script with Gemini
25 min:  Record demo video (read script + demo app)
15 min:  Edit video in CapCut (add music + transitions)
5 min:   Upload to YouTube + submit to Devpost
─────────
57 min TOTAL
```

**TIME REMAINING: SUBMIT BEFORE DEADLINE!** ✅

---

## 🎯 SUCCESS INDICATORS

✅ Architecture diagram generated and screenshot
✅ 5 screenshots collected
✅ Video script word-by-word from Gemini
✅ Demo video recorded (4 min, clear audio)
✅ Video edited (music + transitions + overlays)
✅ YouTube link working
✅ Devpost form fully filled
✅ GitHub link verified
✅ SUBMITTED ✅

Go go go! 🚀
