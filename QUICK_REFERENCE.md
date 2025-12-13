# Redux Integration - Quick Reference Card

## 🎯 The Flow at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│ HOME PAGE → OTP → PROFILE → [ADMIN] → PRODUCTS → CART → PROFILE │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📍 Location Map

| Feature | File | Redux Slice |
|---------|------|-------------|
| OTP Send | `OTPModal.jsx` | `userSlice.requestOTP` |
| OTP Verify | `OTPModal.jsx` | `userSlice.verifyOTP` |
| Profile Form | `UserFormModal.jsx` | `userSlice.updateProfile` |
| Products List | `ProductPage.jsx` | `productSlice.fetchProducts` |
| Product Detail | `ProductDetailsPage.jsx` | `productSlice.fetchProductById` |
| Add to Cart | `ProductDetailsPage.jsx` | `cartSlice.addToCart` |
| View Cart | `CartPage.jsx` | `cartSlice.fetchCart` |
| Remove Item | `CartPage.jsx` | `cartSlice.removeFromCart` |
| Enquiry | `CartPage.jsx` | `cartSlice.generateEnquiry` |
| View Profile | `ProfilePage.jsx` | `userSlice.fetchProfile` |
| Logout | `ProfilePage.jsx` | `userSlice.logout` |

---

## 🔧 Common Hooks Usage

### Get Data from Redux
```javascript
const { user, accessToken, userStatus, loading, error } = 
  useSelector(state => state.user)
```

### Dispatch Action
```javascript
const dispatch = useDispatch()
dispatch(fetchProducts())
```

### Handle Async
```javascript
const result = await dispatch(updateProfile(data))
if (result.payload) {
  // Success
} else {
  // Error
}
```

---

## 📊 User Status States

```
BEFORE OTP
├─ user: null
├─ accessToken: null
└─ Can only see HomePage

AFTER OTP (pending_details)
├─ user: null
├─ accessToken: "JWT..."
├─ userStatus: 'pending_details'
└─ ✓ Can browse products

AFTER PROFILE (pending_details)
├─ user: { filled data }
├─ accessToken: "JWT..."
├─ userStatus: 'pending_details'
└─ ⏳ Show "Pending Approval"

AFTER ADMIN APPROVAL (active)
├─ user: { filled data }
├─ accessToken: "JWT..."
├─ userStatus: 'active'
└─ ✓ Full access
```

---

## 🚀 API Calls Timeline

```
Step 1: requestOTP → POST /auth/request-otp
Step 2: verifyOTP → POST /auth/verify-otp (get token)
Step 3: updateProfile → PATCH /auth/profile (with token)
Step 4: [Wait for admin approval]
Step 5: fetchProducts → GET /product
Step 6: fetchProductById → GET /product/{id}
Step 7: addToCart → POST /cart/add
Step 8: fetchCart → GET /cart
Step 9: generateEnquiry → POST /cart/generate-enquiry
Step 10: fetchProfile → GET /auth/profile
Step 11: logout → Clear state
```

---

## 💡 Key Rules

### ✅ DO
- ✅ Use `useDispatch()` to trigger actions
- ✅ Use `useSelector()` to read state
- ✅ Show loading state while async
- ✅ Handle errors gracefully
- ✅ Clear state on logout
- ✅ Use Redux DevTools to debug

### ❌ DON'T
- ❌ Directly modify Redux state
- ❌ Use localStorage for all data
- ❌ Ignore loading states
- ❌ Make duplicate API calls
- ❌ Store sensitive data in state
- ❌ Dispatch in infinite loops

---

## 🔍 Redux DevTools Commands

```
F12 → Redux Tab → 
├─ See all actions
├─ Time-travel to any state
├─ Inspect state at each step
├─ Replay actions
└─ Export/Import state
```

---

## ⚡ Quick Debugging

### Check State
```javascript
const state = useSelector(state => state)
console.log(state) // See entire Redux state
```

### Check Dispatch
```javascript
const dispatch = useDispatch()
console.log(await dispatch(fetchProducts()))
```

### Check localStorage
```javascript
console.log(localStorage.getItem('accessToken'))
```

---

## 🎯 Common Tasks

### Add to Cart
```javascript
dispatch(addToCart({ productId: "123", quantity: 1 }))
```

### Show User Info
```javascript
const { user, userStatus } = useSelector(state => state.user)
console.log(user) // firstName, lastName, email, etc.
console.log(userStatus) // 'pending_details' or 'active'
```

### Check if Approved
```javascript
if (userStatus === 'active') {
  // Show full content
} else {
  // Show "Pending Approval" message
}
```

### Calculate Cart Total
```javascript
const total = items.reduce((sum, item) => 
  sum + (item.price * item.quantity), 0)
```

---

## 📋 Testing Commands

```bash
# Start dev server
npm run dev

# Test OTP flow
1. Click "See Products"
2. Enter phone number
3. Click "Send OTP"
4. Enter any 6 digits
5. Click "Verify OTP"

# Test products
Navigate to /product
Should see products grid

# Test cart
Click "Add to Cart"
Navigate to /cart
Should see item

# Test profile
Navigate to /profile
Should see approval status

# Test logout
Click "Logout"
Redirects to home
Redux state clears
```

---

## 🎨 Loading State Pattern

```javascript
{loading && <div>Loading...</div>}
{error && <div className="error">{error}</div>}
{data && <div className="content">{data}</div>}
{!loading && !data && <div>No data</div>}
```

---

## 🔐 Token Management

```javascript
// After verification, token stored in:
1. Redux state: state.user.accessToken
2. localStorage: localStorage.getItem('accessToken')

// Used in headers:
headers: {
  'Authorization': `Bearer ${accessToken}`
}

// Cleared on logout:
logout() clears both Redux + localStorage
```

---

## 📊 Files to Know

| File | Purpose |
|------|---------|
| `store.js` | Redux store configuration |
| `userSlice.js` | Auth & profile actions |
| `productSlice.js` | Product actions |
| `cartSlice.js` | Cart actions |
| `OTPModal.jsx` | OTP verification UI |
| `UserFormModal.jsx` | Profile registration UI |
| `ProductPage.jsx` | Products list UI |
| `CartPage.jsx` | Shopping cart UI |
| `ProfilePage.jsx` | User profile UI |

---

## 🚨 Errors & Solutions

| Error | Fix |
|-------|-----|
| "Cannot read property 'products' of undefined" | Check productSlice import in store |
| "useSelector is not a function" | Import from 'react-redux' |
| "Token not persisting" | Check localStorage.setItem in verifyOTP |
| "Products not loading" | Check API endpoint in productSlice |
| "Cart not updating" | Verify addToCart dispatch in component |

---

## 💾 State Persistence

```
Redux State (Memory)
    ↓ (on verifyOTP)
localStorage (accessToken only)
    ↓ (on page refresh)
Restore from localStorage
    ↓
Set Redux state with token
    ↓
Can make authenticated calls
```

---

## 🎯 Next Action Items

- [ ] Read `REDUX_INTEGRATION_WORKFLOW.md`
- [ ] Follow `TESTING_CHECKLIST.md`
- [ ] Review `ARCHITECTURE.md` diagrams
- [ ] Test complete flow
- [ ] Check Redux DevTools
- [ ] Deploy to production

---

## 📱 Mobile Responsive

All components are mobile-responsive using Tailwind CSS:
- ✅ Responsive grid layouts
- ✅ Mobile-friendly modals
- ✅ Touch-friendly buttons
- ✅ Optimized images
- ✅ Proper spacing on mobile

---

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## 🔄 Workflow in 30 Seconds

```
User clicks "See Products"
    ↓
Verify phone with OTP
    ↓
Fill profile form
    ↓
Wait for admin approval
    ↓
Browse products
    ↓
Add to cart
    ↓
Generate enquiry
    ↓
View profile & logout
```

---

## ✨ You're All Set!

Redux integration is **complete and production-ready**. 

Start by:
1. Reading the documentation
2. Testing the complete flow
3. Deploying to production
4. Monitoring with Redux DevTools

---

**Need Help?** → Check [README_REDUX_INTEGRATION.md](README_REDUX_INTEGRATION.md)

