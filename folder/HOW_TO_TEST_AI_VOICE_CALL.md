# 🧪 How to Test AI Voice Call Feature

## 🚀 Quick Start

### Step 1: Start the Application
```bash
npm run dev
```

### Step 2: Open the Chatbot
1. Go to: `http://localhost:3000`
2. Look for the **chat icon** in the bottom-right corner
3. Click it to open the chatbot

## 📞 How to Trigger AI Voice Call

### Method 1: Click the AI Call Button
1. Open the chatbot
2. Look at the **header** (top of chatbot)
3. Click the **purple phone icon** (📞) - This is the AI Call button
4. Enter your phone number when prompted
5. Watch the call widget appear!

### Method 2: Type Your Phone Number
1. In the chatbot, type: `"My number is +919876543210"` (use your real number)
2. The chatbot will detect the phone number
3. It will suggest using AI verification
4. Click the purple phone icon to start

### Method 3: Ask for Verification
1. Type in chatbot: `"I want verification"` or `"Call me for verification"`
2. The chatbot will explain the process
3. Click the purple phone icon or provide your number

### Method 4: Use the Link
1. Scroll down in the chatbot
2. Look for **"AI Call"** link below the input field
3. Click it to start

## 👀 What You'll See

### During the Call:
1. **Call Widget** appears (full-screen overlay)
2. Status shows: "Initiating call..." → "Ringing..." → "Connected" → "In progress..."
3. Real-time progress updates
4. Verification questions being asked (simulated)

### After the Call:
1. **Verification Score** (0-100)
2. **Status**: ✅ Verified or ⚠️ Needs Review
3. **Call Transcript** (click to view)
4. Results added to chat conversation

## 📊 Where to Check Results

### 1. In the Chatbot
- After call completes, verification result appears in chat
- Shows score and status

### 2. Via API
Open browser console and run:
```javascript
// Get all call sessions
fetch('/api/voice-call')
  .then(r => r.json())
  .then(data => console.log('All Calls:', data))

// Get specific call by phone number
fetch('/api/voice-call?phoneNumber=+919876543210')
  .then(r => r.json())
  .then(data => console.log('My Calls:', data))
```

### 3. In Browser Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Trigger AI call
4. Look for `/api/voice-call` request
5. Check response for call session data

## 🎯 Step-by-Step Test

### Test 1: Basic Call
1. ✅ Open chatbot
2. ✅ Click purple phone icon
3. ✅ Enter phone: `+919876543210`
4. ✅ Watch call widget appear
5. ✅ Wait for call to complete (~20 seconds)
6. ✅ See verification result

### Test 2: Phone Number Detection
1. ✅ Type: `"My phone is 9876543210"`
2. ✅ Chatbot detects number
3. ✅ Suggests AI verification
4. ✅ Click AI call button
5. ✅ Call starts automatically

### Test 3: Verification Request
1. ✅ Type: `"I want to get verified"`
2. ✅ Chatbot explains process
3. ✅ Click AI call button
4. ✅ Enter phone number
5. ✅ Complete verification

### Test 4: Check Call History
1. ✅ Make a call
2. ✅ Open browser console
3. ✅ Run: `fetch('/api/voice-call').then(r => r.json()).then(console.log)`
4. ✅ See all call sessions

## 🔍 What to Look For

### ✅ Success Indicators:
- Call widget appears
- Status changes: initiating → ringing → connected → in progress → completed
- Verification score displayed (0-100)
- Status shows: ✅ Verified or ⚠️ Needs Review
- Transcript available
- Result message in chat

### ⚠️ If Something Goes Wrong:
- Check browser console for errors
- Verify API endpoint is working: `http://localhost:3000/api/voice-call`
- Check network tab for failed requests
- Make sure phone number format is correct

## 📱 Mobile Testing

1. Open on mobile device or use browser dev tools mobile view
2. Click chatbot icon
3. Click purple AI call button
4. Enter phone number
5. Watch call progress
6. View results

## 🎨 UI Elements to Check

### In Chatbot Header:
- 🔵 Blue phone icon = Call business
- 🟣 Purple phone icon = AI calls you (NEW!)
- 🟢 Green WhatsApp icon = Share via WhatsApp

### In Input Area:
- "AI Call" link (purple)
- "Call Us" link (blue)
- "WhatsApp" link (green, appears after conversation)

### Call Widget:
- Phone icon animation
- Status text
- Progress indicators
- Verification score
- Transcript button
- Close/Retry buttons

## 🔧 Troubleshooting

### Call Widget Not Appearing?
- Check browser console for errors
- Verify phone number is entered
- Make sure chatbot is open

### Call Stuck on "Initiating"?
- Check API endpoint: `http://localhost:3000/api/voice-call`
- Look for errors in network tab
- Try refreshing the page

### No Verification Score?
- Wait for call to complete (~20 seconds)
- Check call session in API response
- Verify all questions were answered

## 📝 Expected Behavior

1. **Click AI Call** → Widget appears immediately
2. **Status Updates** → Every 2-3 seconds
3. **Questions Asked** → 7 questions total
4. **Call Duration** → ~20-25 seconds (simulated)
5. **Results** → Score and status displayed
6. **Chat Update** → Verification message added

## 🎉 Success!

If you see:
- ✅ Call widget appears
- ✅ Status updates correctly
- ✅ Verification score (0-100)
- ✅ Status: Verified or Needs Review
- ✅ Transcript available
- ✅ Result in chat

**Then the feature is working perfectly!** 🎊

---

**Note**: Currently using simulated calls. For real phone calls, integrate with Twilio (see code comments in `app/api/voice-call/route.ts`).

