# Redux Integration Setup Guide

## 🎯 What Was Integrated

All Redux slices have been successfully integrated into your JSX files. Here's what changed:

---

## 📁 Files Modified

### Components
1. **[OTPModal.jsx](src/Components/OTPModal.jsx)**
   - ✅ Integrated `requestOTP` dispatch
   - ✅ Integrated `verifyOTP` dispatch
   - ✅ Loading states & error handling
   - ✅ Returns verified data to parent

2. **[UserFormModal.jsx](src/Components/UserFormModal.jsx)**
   - ✅ Integrated `updateProfile` dispatch
   - ✅ Shows pending approval message
   - ✅ Stores user data in Redux state
   - ✅ Loading states & error handling

### Pages
3. **[HomePage.jsx](src/Pages/HomePage.jsx)**
   - ✅ Manages OTP & UserForm modal flow
   - ✅ Shows approval pending modal after registration
   - ✅ Passes verified data between modals
   - ✅ Reads `userStatus` from Redux

4. **[ProductPage.jsx](src/Pages/ProductPage.jsx)**
   - ✅ Integrated `fetchProducts` dispatch
   - ✅ Displays products from Redux state
   - ✅ Loading & error states
   - ✅ Navigation to product details

5. **[ProductDetailsPage.jsx](src/Pages/ProductDetailsPage.jsx)**
   - ✅ Integrated `fetchProductById` dispatch
   - ✅ Integrated `addToCart` dispatch
   - ✅ Displays selected product details
   - ✅ Loading & error states

6. **[CartPage.jsx](src/Pages/CartPage.jsx)**
   - ✅ Integrated `fetchCart` dispatch
   - ✅ Integrated `removeFromCart` dispatch
   - ✅ Integrated `generateEnquiry` dispatch
   - ✅ Shows cart items & total
   - ✅ Loading & error states

7. **[ProfilePage.jsx](src/Pages/ProfilePage.jsx)**
   - ✅ Integrated `fetchProfile` dispatch
   - ✅ Integrated `logout` dispatch
   - ✅ Shows user info & approval status
   - ✅ Loading & error states
   - ✅ Approval status banner (Pending/Active)

### Utilities
8. **[cart.js](src/utils/cart.js)**
   - ✅ Marked deprecated functions
   - ✅ Added comments for Redux integration
   - ✅ Kept for backward compatibility

---

## 🚀 Complete Workflow

### Step 1: User Starts Journey
```
1. User visits HomePage
2. Clicks "See Products" button
3. OTPModal opens
```

### Step 2: Phone Verification
```
1. User enters phone number + ISD code
2. Clicks "Send OTP"
3. Redux dispatches: requestOTP({ isdCode, phoneNumber })
   └─ API: POST /auth/request-otp
   └─ Status shows: "Sending..."
4. OTP sent to phone, form moves to step 2
```

### Step 3: OTP Verification
```
1. User enters 6-digit OTP
2. Clicks "Verify OTP"
3. Redux dispatches: verifyOTP({ isdCode, phoneNumber, otp })
   └─ API: POST /auth/verify-otp
   └─ Status shows: "Verifying..."
4. Returns:
   ├─ accessToken (stored in Redux & localStorage)
   ├─ userStatus: 'pending_details'
   └─ phone data
5. OTPModal closes, UserFormModal opens
```

### Step 4: Profile Completion
```
1. User fills form:
   ├─ firstName
   ├─ lastName
   ├─ businessName
   ├─ email
   ├─ city
   └─ state
2. Verified phone displays (read-only)
3. Clicks "Save & Continue"
4. Redux dispatches: updateProfile(profileData)
   └─ API: PATCH /auth/profile
   └─ Headers: Authorization: Bearer ${accessToken}
   └─ Status shows: "Saving..."
5. Returns:
   ├─ User data stored in Redux
   └─ userStatus: 'pending_details'
6. UserFormModal closes
7. "Approval Pending" modal shows
```

### Step 5: Approval Status
```
1. After form submission, show modal:
   "⏳ Your profile is pending admin approval"
   "You'll be able to access products once approved"
2. User can:
   ├─ Click "Go to Profile" → ProfilePage
   └─ Click outside modal → HomePage
3. Profile page shows:
   - All user details
   - "⏳ Pending Approval" banner
   - "Logout" button
```

### Step 6: Admin Approval (Backend)
```
1. Admin approves user in backend dashboard
2. userStatus changes from 'pending_details' to 'active'
3. Next login shows "✓ Profile Approved" banner
4. User gets full access to products
```

### Step 7: Browse Products
```
1. User navigates to /product
2. ProductPage mounts
3. Redux dispatches: fetchProducts()
   └─ API: GET /product
4. Shows 4-column grid of all products
5. User clicks "View Details" on a product
6. Navigates to /product/{id}
```

### Step 8: View Product Details
```
1. ProductDetailsPage mounts with productId from URL
2. Redux dispatches: fetchProductById(productId)
   └─ API: GET /product/{productId}
3. Shows:
   ├─ Product image
   ├─ Name, price, description
   └─ "Add to Cart" button
```

### Step 9: Add to Cart
```
1. User clicks "Add to Cart"
2. Redux dispatches: addToCart({ productId, quantity: 1 })
   └─ API: POST /cart/add
   └─ Status shows: "Adding..."
3. Item added to Redux cart state
4. Shows: "Added to cart!" alert
```

### Step 10: View Cart
```
1. User clicks cart icon in Navbar
2. Navigates to /cart
3. CartPage mounts
4. Redux dispatches: fetchCart()
   └─ API: GET /cart
5. Shows:
   ├─ List of all cart items
   ├─ Price & quantity for each
   ├─ Total price
   └─ "Remove" button for each item
```

### Step 11: Remove Item from Cart
```
1. User clicks "Remove" button
2. Redux dispatches: removeFromCart({ productId })
   └─ API: POST /admin/remove
3. Item removed from cart
4. Cart state updated in Redux
```

### Step 12: Generate Enquiry
```
1. User clicks "Send Enquiry"
2. Redux dispatches: generateEnquiry()
   └─ API: POST /cart/generate-enquiry
   └─ Status shows: "Generating..."
3. Success message: "Enquiry submitted successfully"
4. Admin gets notified of enquiry
```

### Step 13: View Profile
```
1. User navigates to /profile
2. ProfilePage mounts
3. Redux dispatches: fetchProfile()
   └─ API: GET /auth/profile
   └─ Headers: Authorization: Bearer ${accessToken}
4. Shows:
   ├─ All user details
   ├─ Approval status banner:
   │  ├─ 🟡 "⏳ Pending Approval" (if pending_details)
   │  └─ 🟢 "✓ Profile Approved" (if active)
   └─ "Logout" button
```

### Step 14: Logout
```
1. User clicks "Logout" button
2. Redux dispatches: logout()
3. Clears:
   ├─ user data
   ├─ accessToken (from Redux & localStorage)
   ├─ userStatus
   └─ phoneNumber & isdCode
4. Redirects to HomePage
```

---

## 🔒 Redux State During Journey

### Before OTP
```javascript
{
  user: {
    user: null,
    accessToken: null,
    status: 'idle',
    error: null
  }
}
```

### After OTP Verification
```javascript
{
  user: {
    user: null, // Not fetched yet
    accessToken: "jwt_token_here",
    userStatus: 'pending_details',
    status: 'succeeded'
  }
}
```

### After Profile Update
```javascript
{
  user: {
    user: {
      firstName: "John",
      lastName: "Doe",
      businessName: "Jewelry Store",
      email: "john@example.com",
      city: "Delhi",
      state: "Delhi",
      status: 'pending_details'
    },
    accessToken: "jwt_token_here",
    userStatus: 'pending_details',
    status: 'succeeded'
  }
}
```

### After Admin Approval (from fetch profile)
```javascript
{
  user: {
    user: {
      // ... all user data
      status: 'active'
    },
    userStatus: 'active',
    status: 'succeeded'
  }
}
```

### Products Loaded
```javascript
{
  product: {
    products: [
      { _id: "1", name: "Gold Necklace", price: 25999, image: "url", ... },
      { _id: "2", name: "Diamond Ring", price: 39499, image: "url", ... },
      // ... more products
    ],
    loading: false,
    success: true
  }
}
```

### Cart Items
```javascript
{
  cart: {
    items: [
      { _id: "item1", productId: "1", name: "Gold Necklace", quantity: 1, price: 25999, ... },
      { _id: "item2", productId: "2", name: "Diamond Ring", quantity: 2, price: 39499, ... }
    ],
    loading: false,
    success: true
  }
}
```

---

## ⚠️ Important Points

### 1. **Access Token**
- Automatically stored in localStorage after OTP verification
- Used in all authenticated requests (updateProfile, fetchProfile, fetchCart, etc.)
- Include in headers: `Authorization: Bearer ${token}`

### 2. **User Status Stages**
```
pending_details → User filled form, awaiting admin approval
    ↓
pending → [No longer used in current API]
    ↓
active → User approved, has full access
```

### 3. **Approval Pending Flow**
- After updateProfile, show modal: "⏳ Your profile is pending admin approval"
- ProfilePage shows yellow banner while pending
- Once admin approves (backend), banner turns green on next login
- No need to refresh manually; Redux state updates on fetch

### 4. **Error Handling**
- All async thunks have error handling
- Errors stored in `state.*.error`
- Display errors to user
- Clear errors when retrying

### 5. **Loading States**
- All buttons disabled during loading
- Show "Loading..." or "Sending..." text
- Prevent duplicate submissions
- Clear on success or error

---

## 🛠️ Troubleshooting

### Issue: "Cannot read property 'user' of undefined"
**Solution:** Make sure Redux is connected to App.jsx with Provider
```javascript
// main.jsx should have:
import { Provider } from 'react-redux';
import store from './Slices/store';

<Provider store={store}>
  <App />
</Provider>
```

### Issue: Token not persisting
**Solution:** Token is auto-saved in localStorage in verifyOTP
Check: `localStorage.getItem('accessToken')`

### Issue: Products not loading on ProductPage
**Solution:** 
1. Check if fetchProducts is dispatched on mount
2. Verify API endpoint: `GET /product`
3. Check Redux state: `useSelector(state => state.product.products)`

### Issue: Cart items not updating
**Solution:**
1. Verify cart endpoints in backend
2. Check Redux state updates after dispatch
3. Ensure user is authenticated (has accessToken)

### Issue: Approval status not showing
**Solution:**
1. After updateProfile, userStatus should be 'pending_details'
2. Check Redux state: `userStatus` field
3. ProfilePage reads from: `state.user.userStatus`

---

## ✅ Testing Checklist

- [ ] OTP request works (requestOTP dispatch)
- [ ] OTP verification works (verifyOTP dispatch)
- [ ] Token received and stored (localStorage check)
- [ ] Profile form submission works (updateProfile dispatch)
- [ ] Approval pending modal shows
- [ ] Products load on /product (fetchProducts dispatch)
- [ ] Product details load (fetchProductById dispatch)
- [ ] Add to cart works (addToCart dispatch)
- [ ] Cart displays items (fetchCart dispatch)
- [ ] Remove from cart works (removeFromCart dispatch)
- [ ] Enquiry generation works (generateEnquiry dispatch)
- [ ] Profile page shows user info (fetchProfile dispatch)
- [ ] Approval status banner shows correct status
- [ ] Logout clears all data and redirects

---

## 📞 Need Help?

Refer to:
- [REDUX_INTEGRATION_WORKFLOW.md](REDUX_INTEGRATION_WORKFLOW.md) - Detailed workflow
- [Redux Documentation](https://redux.js.org/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

