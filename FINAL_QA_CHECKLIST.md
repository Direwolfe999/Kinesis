# KINESIS - FINAL SUBMISSION CHECKLIST

## Phase 1: Code Verification (BEFORE Recording Videos)

### Backend
- [ ] `backend/main_production.py` exists and has quota fallback logic
- [ ] `backend/requirements.txt` includes: fastapi, uvicorn, google-genai, python-dotenv
- [ ] `.env` has GOOGLE_API_KEY (no hardcoded keys in source)
- [ ] Backend starts without errors: `uvicorn backend/main_production:app --host 0.0.0.0 --port 8000`
- [ ] Health check works: `curl http://localhost:8000/healthz`
- [ ] WebSocket connects: `curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:8000/ws`

### Frontend
- [ ] `frontend/package.json` has React 19+, Next.js 14+
- [ ] Frontend builds: `npm run build` (no errors)
- [ ] Frontend starts: `npm run dev` → http://localhost:3000 loads
- [ ] Mic permission prompt shows
- [ ] Orb animation displays
- [ ] Controls visible (Mic, Camera, Fallback badge)
- [ ] No console errors (check browser DevTools → Console tab)

### Configuration
- [ ] `.env.example` exists (template for reproducibility)
- [ ] `.env` NOT in git (check `.gitignore`)
- [ ] `docker-compose.yml` is valid: `docker-compose config` (if using Docker)
- [ ] `Dockerfile` exists and builds: `docker build -t kinesis .`
- [ ] `requirements.txt` has no git links (use == versioning)

---

## Phase 2: Documentation

### README
- [ ] `README.md` or `README_COMPLETE.md` exists
- [ ] Quick Start section (copy-paste ready)
- [ ] System requirements listed
- [ ] Troubleshooting section present
- [ ] Architecture diagram embedded or linked
- [ ] Feature matrix table present
- [ ] Deployment section (Cloud Run + Cloud Shell)
- [ ] Links are active (test them)
- [ ] No hardcoded API keys in examples

### Other Docs
- [ ] `DEVPOST_DESCRIPTION_FINAL.md` exists (500-800 words)
- [ ] `DEMO_VIDEO_SCRIPT.md` exists (3-4 min script)
- [ ] `.env.example` exists (shows all required vars)
- [ ] Architecture diagram PNG/SVG is readable
- [ ] Deployment proof document ready

### Code Comments
- [ ] Critical functions have docstrings
- [ ] Async handlers commented
- [ ] Fallback logic explained
- [ ] Error handling commented
- [ ] At least 50% of lines have comments/docs

---

## Phase 3: Security & Secrets

### No Hardcoded Secrets
- [ ] No API keys in `.py` files
- [ ] No API keys in `.md` files
- [ ] No API keys in `.ts`/`.tsx` files
- [ ] No API keys in `.env` committed to git
- [ ] `.env` is in `.gitignore`
- [ ] All secrets loaded from environment variables
- [ ] Verify: `git log --all --diff-filter=D --summary | grep "delete mode" | grep -i key`

### Environment Variables
- [ ] `GOOGLE_API_KEY` set correctly
- [ ] `BACKEND_PORT` defaults to 8000
- [ ] `FRONTEND_PORT` defaults to 3000
- [ ] Optional vars have sensible defaults
- [ ] `.env.example` shows all required vars (values blanked)

---

## Phase 4: Git History

### Repository Cleanliness
- [ ] No `node_modules/` in git (`check .gitignore`)
- [ ] No `.env` file in git
- [ ] No `.venv/` or `__pycache__/` in git
- [ ] No build artifacts (`.next/`, `dist/`, `build/`)
- [ ] No `.DS_Store` or IDE files
- [ ] At least 10 meaningful commits (show development progress)
- [ ] Commit messages are clear ("Add quota fallback" not "update")

### Sensitive Info Check
- [ ] Run: `git log -p | grep -i "api_key\|password\|secret"` → Should be empty
- [ ] Run: `git ls-files | xargs grep -l "AKIA\|AIza" 2>/dev/null` → Should be empty
- [ ] Review last 5 commits for accidental commits

---

## Phase 5: Devpost Submission Form

### Required Fields
- [ ] Project Title: "Kinesis: The Living Multimodal Agent"
- [ ] Tagline (max 100 chars): "Real-time multimodal AI agent with barge-in interruption and graceful quota fallback"
- [ ] Category: "Live Agents"
- [ ] Team Members: All names + GitHub handles
- [ ] Description: Copied from `DEVPOST_DESCRIPTION_FINAL.md` (500-800 words)
- [ ] GitHub Repository: Link (must be public)
- [ ] Deployment Proof: Cloud Run or Cloud Shell URL (if applicable)

### Media
- [ ] Demo Video uploaded (MP4, <4 min, <200MB)
- [ ] Architecture Diagram uploaded (PNG/SVG, readable)
- [ ] At least 1 screenshot of running app
- [ ] Optional: Deployment proof screenshot

### Links
- [ ] GitHub repo link is correct
- [ ] Demo video plays
- [ ] Diagram is readable
- [ ] All external links work

---

## Phase 6: Videos (Record These)

### Demo Video (3-4 min)
- [ ] Problem statement clear (first 40 sec)
- [ ] Live interaction shown (not mockups)
- [ ] Barge-in works on camera
- [ ] Fallback cascade visible (terminal + UI)
- [ ] Architecture explained
- [ ] Audio clear (no background noise)
- [ ] No API keys visible
- [ ] Timing: ≤4 min, ≥3 min

### Deployment Proof (30-60 sec)
- [ ] Shows GCP console OR Cloud Shell
- [ ] Backend running (logs visible)
- [ ] Health check shows "ok"
- [ ] Timestamp visible (proves date)
- [ ] URL shown (proves it's live)
- [ ] Upload as separate file

### Recording Quality
- [ ] Resolution: 1080p or higher
- [ ] Format: MP4 (H.264 codec)
- [ ] Frame rate: 30fps
- [ ] Audio: Clear, not distorted
- [ ] File size: <200MB

---

## Phase 7: Final QA

### Functional Tests
- [ ] Backend starts without `.env` errors
- [ ] Frontend loads without CORS errors
- [ ] WebSocket connects
- [ ] Can send text message
- [ ] Receives response back
- [ ] Barge-in signal received
- [ ] Fallback detection works (simulate by changing model)
- [ ] Health endpoints respond

### User Experience
- [ ] No console errors (DevTools → Console)
- [ ] No network errors (DevTools → Network)
- [ ] Orb animation smooth
- [ ] Mic capture shows waveform
- [ ] Response streaming visible (text appears gradually)
- [ ] Timestamps in logs

### Edge Cases
- [ ] Empty message → error handling works
- [ ] Very long message → doesn't crash
- [ ] No API key → shows clear error
- [ ] Quota error → fallback triggers (or graceful error)
- [ ] WebSocket disconnect → auto-reconnect or clear message
- [ ] Page refresh → frontend resets cleanly

---

## Phase 8: Documentation Review

### README Completeness
- [ ] Installation: Copy-paste works
- [ ] Usage: Clear for someone unfamiliar
- [ ] Architecture: Understandable even for non-ML
- [ ] Troubleshooting: Covers 5+ common issues
- [ ] Deployment: Two options (Cloud Run + Cloud Shell)
- [ ] API Reference: Shows request/response examples

### Code Documentation
- [ ] Docstrings on public functions
- [ ] Comments on complex logic
- [ ] Inline comments for non-obvious code
- [ ] No TODO comments (or all listed)
- [ ] Type hints on function signatures

---

## Phase 9: Submission Readiness

### Before Clicking "Submit"
- [ ] README is final (no TODOs)
- [ ] All links tested
- [ ] Videos uploaded
- [ ] No typos in description
- [ ] Images optimized (small file sizes)
- [ ] Tagline matches project
- [ ] Team names correct
- [ ] Category correct ("Live Agents")

### Post-Submission
- [ ] Submission confirmed (check email)
- [ ] Can view submission page as guest
- [ ] Videos play
- [ ] Text displays correctly
- [ ] Links are clickable
- [ ] Save submission URL for reference

---

## Scoring Rubric Alignment (40/30/30)

### Innovation & Multimodal UX (40% = Must Score Here)
- ✅ Real-time audio + video + text (multimodal)
- ✅ Barge-in interruption protocol
- ✅ Graceful quota degradation (unique feature!)
- ✅ System transparency (logs + telemetry)
- ✅ Siri-like orb UI with state changes
- **Expected Score**: 35-40 points

### Technical Implementation & Agent Architecture (30%)
- ✅ Google GenAI SDK integration
- ✅ FastAPI + WebSocket async architecture
- ✅ Robust quota error handling + fallback cascade
- ✅ Model selection logic (3-model cascade)
- ✅ Browser Speech API fallback
- **Expected Score**: 25-30 points

### Demo & Presentation (30%)
- ✅ Real live demo (no mockups)
- ✅ Clear problem statement
- ✅ Shows multimodal + barge-in + fallback
- ✅ Professional video quality
- ✅ Architecture diagram explains innovation
- **Expected Score**: 25-30 points

**Total Expected**: 85-100 points (competitive for top 3)

---

## Day-of-Submission Checklist

### Final Hour
- [ ] Test backend one more time
- [ ] Test frontend one more time
- [ ] Verify .env is NOT in git
- [ ] Run `git status` → should be clean
- [ ] Double-check DEVPOST form for typos
- [ ] Check video file is <4 min

### Submit
- [ ] Click "Submit"
- [ ] Wait for confirmation email
- [ ] Share submission link in team chat
- [ ] Celebrate! 🎉

---

## Post-Submission (If Time)

### Optional Bonus Work (Improves Chances)
- [ ] Write blog post about quota resilience
- [ ] Create 60-sec GIF of barge-in working
- [ ] Post on Twitter/LinkedIn with #GeminiLiveAgentChallenge
- [ ] Join Google Developer Group
- [ ] Record detailed architecture deep-dive (bonus points)

---

## Success Criteria

You've succeeded if:

1. ✅ Submission is live on Devpost
2. ✅ GitHub repo is public + complete
3. ✅ Demo video shows real interaction
4. ✅ Fallback cascade is visible
5. ✅ README is reproducible
6. ✅ No hardcoded secrets
7. ✅ Judges can run locally without errors

**If all above are true, you're competitive for "Best of Live Agents" ($10k) or higher.**

---

**Need Help?** Check [README_COMPLETE.md](./README_COMPLETE.md) or [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

**Last Updated**: March 16, 2026  
**Deadline**: March 31, 2026 (15 days)  
**Status**: Ready for submission ✅
