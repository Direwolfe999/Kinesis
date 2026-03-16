# KINESIS - DEMO VIDEO SCRIPT (3-4 min)

## Timing & Segments

**Total**: 3 minutes 40 seconds  
**Format**: Screen capture + Live interaction  
**Background Audio**: Soft tech background music (optional)

---

## SEGMENT 1: THE PROBLEM (0:00-0:40)

**Visual**: Fade in on Kinesis logo / intro animation

**Script:**

> "Most AI agents are chatbots. You type, they respond. Then you wait and type again. It feels dead.
>
> **But what if AI could be alive?**
>
> What if it could perceive your voice and respond in real-time? What if you could interrupt mid-sentence and it would pivot instantly? What if when the API fails, it didn't break—it adapted?
>
> That's Kinesis. Not a chatbot. A living multimodal agent built on Gemini Live."

**Visuals during segment:**
- Show generic chatbot interface (fade)
- Transition to Kinesis orb animation (bright, pulsing)
- Show architecture diagram briefly

---

## SEGMENT 2: LIVE INTERACTION (0:40-2:00)

**Visual**: Kinesis UI with mic enabled, orb visible

**Script:**

> "Let me show you what alive looks like."

**ACTION 1: Simple Question (0:40-1:00)**

- User (you): "Hey Kinesis. What's your role?"
- Kinesis responds: "I am Kinesis. I perceive your voice and your surroundings in real-time. I don't wait for turns. I listen and respond. Right now I'm detecting your audio input..."

**ACTION 2: Barge-In Protocol (1:00-1:40)**

- User: "Give me technical—" (INTERRUPT before Kinesis finishes by clicking "Stop" or pressing spacebar)
- Kinesis: "Listening" (immediate response)
- User: "How does the fallback cascade work?"
- Kinesis responds with technical details about model switching

**ACTION 3: Quota Fallback Trigger (1:40-2:00) [Optional but impactful]**

- Show terminal in background showing: "`Quota exhausted on gemini-2.5-flash-native-audio-latest`"
- Show Kinesis UI: "⚠️ Fallback mode: Switching to gemini-2.5-flash..."
- User: "Can you still understand me?"
- Kinesis: "Yes. I'm now operating on a secondary model. No change in experience."
- Show UI smoothly transitions, continues responding

**Visuals during segment:**
- Orb pulses with user speech
- Text appears as Kinesis responds
- Show WebSocket connection status
- Brief glimpse of backend logs (shows quota handling)

---

## SEGMENT 3: ARCHITECTURE WALKTHROUGH (2:00-3:00)

**Visual**: Full-screen architecture diagram

**Script:**

> "Here's why Kinesis is different. We didn't build another turn-based chatbot. We built a **cascade**."
>
> "When you speak, audio flows to the Gemini Live API—real-time streaming, not buffering.
>
> If quota is hit, we don't show an error. We switch to a secondary model instantly.
>
> If that's exhausted, we fall back to a lightweight model.
>
> If all cloud models fail, we degrade to local browser speech—the user's experience never breaks.
>
> This is production-grade thinking."

**Walk through diagram:**
1. Point to User Device → Next.js (frontend)
2. Point to FastAPI WebSocket
3. Point to Gemini Live API with three models stacked
4. Show the quota detection arrows
5. Show fallback path to Browser Speech API

**Visuals during segment:**
- Animated arrows showing data flow
- Highlight each model as mentioned
- Show quota error → fallback transition animation
- Display metrics: "Barge-in latency: <500ms" | "Fallback switch: <200ms"

---

## SEGMENT 4: WHY IT WINS (3:00-3:40)

**Visual**: Fade back to Kinesis orb + key features overlay

**Script:**

> "Why does Kinesis win?
>
> **One**: Multimodal. Real audio + video + text simultaneously—not sequential.
>
> **Two**: Graceful degradation. Judges won't see quota handling elsewhere. Most entries break on failure.
>
> **Three**: Natural UX. Barge-in interruption feels human. The agent responds like a person listening.
>
> **Four**: Free-tier friendly. No billing account required. Any developer can reproduce this.
>
> **Five**: Transparent. Every event is logged. Judges can see exactly what's happening—connection → processing → response.
>
> This is what the future of AI interaction looks like."

**Visuals during segment:**
- Features slide: ✅ Real-time audio ✅ Barge-in ✅ Quota fallback ✅ Free-tier ✅ Logs
- Show deployment proof: Cloud Run or Cloud Shell running
- End with full Kinesis UI running in background

**Final frame**: 
- "Kinesis: The Living Multimodal Agent"
- "Built with Gemini Live API"
- GitHub repo link
- "Questions?"

---

## TECHNICAL NOTES FOR RECORDING

### Equipment & Setup
- **Screen Capture**: OBS Studio (free) or Screenflow (Mac)
- **Audio**: Use system audio + optional voiceover
- **Microphone**: USB headset (minimal background noise)
- **Lighting**: Well-lit room (for demo credibility)

### Recording Steps

1. **Before Recording:**
   - Restart backend: `uvicorn backend/main:app --host 0.0.0.0 --port 8000`
   - Verify .env has valid GOOGLE_API_KEY
   - Open Kinesis at http://localhost:3000
   - Test mic/audio works
   - Close unnecessary tabs (clean desktop)

2. **Start Recording:**
   - Open OBS / Screenflow
   - Select "System Audio + Mic" input
   - Screen capture: Browser window (1920x1080 recommended)
   - Start recording

3. **Do Multiple Takes:**
   - Segment 1 (intro): 3-4 takes
   - Segment 2 (live): 5-6 takes (barge-in timing is critical)
   - Segment 3 (architecture): 2-3 takes
   - Segment 4 (wrap): 2 takes

4. **Post-Production (DaVinci Resolve / iMovie / Adobe Premiere):**
   - Use best takes from each segment
   - Cut audio for timing
   - Add background music (optional, ~20% volume)
   - Color grade: Increase contrast slightly
   - Add subtitles at 0:00-0:40 and 3:00-3:40 (speech accessibility)
   - Export: MP4, H.264, 1080p, 30fps
   - File size: Should be <200MB

5. **Review Checklist:**
   - ✓ Audio is clear (no background hum)
   - ✓ Timing matches 3:40 target
   - ✓ Barge-in shown clearly
   - ✓ Fallback cascade visible
   - ✓ Architecture diagram readable
   - ✓ Text readable at 1080p
   - ✓ No sensitive keys visible in logs
   - ✓ No broken links mentioned

---

## VOICEOVER SCRIPT (Alternative: Use TTS)

If recording voiceover separately:

```
0:00 - "Most AI agents are chatbots..."
0:40 - "Let me show you what alive looks like."
1:00 - (Let Kinesis speak naturally)
2:00 - "Here's why Kinesis is different..."
3:00 - "Why does Kinesis win?"
3:40 - End
```

**Voiceover tone**: Confident, technical, energetic (not monotone)  
**Pace**: Normal (not rushed)  
**Pauses**: Between sentences (natural breath)

---

## UPLOAD TO DEVPOST

1. Log in to Devpost
2. Find your submission
3. Click "Media" section
4. Upload MP4 as "Demo Video"
5. Add description:
   ```
   Kinesis Live Agent - Full Feature Demo
   
   Demonstrates:
   - Real-time audio interaction
   - Barge-in interruption protocol
   - Automatic quota fallback cascade
   - Architecture overview
   ```
6. Set as primary video
7. Save

---

## SUCCESS METRICS

- ✅ Video <4 min (Devpost limit)
- ✅ Clear problem statement in first 40 seconds
- ✅ Live interaction shown (not mockups)
- ✅ Barge-in works on camera
- ✅ Fallback cascade visible
- ✅ Architecture explained
- ✅ Audio quality good (no background noise)
- ✅ No API keys visible
- ✅ Judges can understand tech without being ML experts
- ✅ Ending is memorable ("Questions?")

---

**Questions?** Check the full README or deployment guide.

Good luck! 🚀
