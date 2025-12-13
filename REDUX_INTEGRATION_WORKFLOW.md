# Redux Integration Workflow

## Overview
This document outlines the complete Redux integration workflow for the RoopJewelers e-commerce application.

---

## 🔄 Complete User Journey Workflow

### **1. HOME PAGE → OTP VERIFICATION**
**File:** [HomePage.jsx](src/Pages/HomePage.jsx)

Flow:
- User clicks "See Products" button
- `OTPModal` opens
- User enters phone number with ISD code

**Redux Action Triggered:**
```javascript
dispatch(requestOTP({ isdCode, phoneNumber }))
```
- Status: `'loading'` → Request sent to API
- Endpoint: `POST /auth/request-otp`
- Response: OTP sent to user's phone

---

### **2. OTP VERIFICATION**
**File:** [OTPModal.jsx](src/Components/OTPModal.jsx)

Flow:
- User enters 6-digit OTP
- Clicks "Verify OTP"

**Redux Action Triggered:**
```javascript
dispatch(verifyOTP({ isdCode, phoneNumber, otp }))
```
- Status: `'loading'` → Verifying OTP
- Endpoint: `POST /auth/verify-otp`
- Response: 
  - ✅ `accessToken` received
  - `userStatus: 'pending_details'` → User needs to complete profile
  - Returns verified phone data to next modal

**Data Passed to UserFormModal:**
```javascript
{
  isdCode: "+91",
  phone: "9876543210",
  accessToken: "token_string",
  userStatus: "pending_details"
}
```

---

### **3. PROFILE COMPLETION & REGISTRATION**
**File:** [UserFormModal.jsx](src/Components/UserFormModal.jsx)

Flow:
- User fills in profile form (firstName, lastName, businessName, email, city, state)
- Clicks "Save & Continue"

**Redux Action Triggered:**
```javascript
dispatch(updateProfile({
  firstName: "John",
  lastName: "Doe",
  businessName: "Jewelry Store",
  email: "john@example.com",
  city: "Delhi",
  state: "Delhi"
}))
```
- Endpoint: `PATCH /auth/profile`
- Headers: `Authorization: Bearer ${accessToken}`
- Response:
  - ✅ Profile saved
  - `userStatus: 'pending_details'` → Shows approval message
  - User data stored in Redux state

**Display:**
- ⏳ "Your profile is pending admin approval" message
- Suggest user to check Profile page for status

---

### **4. APPROVAL PENDING**
**File:** [HomePage.jsx](src/Pages/HomePage.jsx)

After profile submission:
- Show "Approval Pending" modal
- User can:
  - Go to Profile page to check approval status
  - Return to home page

**What happens when admin approves:**
- Backend updates `userStatus: 'active'`
- Next time user logs in, they get full access
- ProductPage & ProductDetailsPage become accessible

---

## 📦 PRODUCT PAGE INTEGRATION

### **5. FETCH ALL PRODUCTS**
**File:** [ProductPage.jsx](src/Pages/ProductPage.jsx)

Flow:
- Component mounts
- Redux hook: `useEffect(() => { dispatch(fetchProducts()) }, [dispatch])`

**Redux Action Triggered:**
```javascript
dispatch(fetchProducts())
```
- Endpoint: `GET /product`
- Returns: Array of all products
- State: `state.product.products[]`

**Display:**
- Grid layout of all products (4 columns)
- Each card shows: image, name, price, "View Details" button

---

### **6. FETCH PRODUCT DETAILS**
**File:** [ProductDetailsPage.jsx](src/Pages/ProductDetailsPage.jsx)

Flow:
- User clicks "View Details" on any product
- Component mounts with productId from URL params
- Redux hook: `useEffect(() => { dispatch(fetchProductById(id)) }, [id])`

**Redux Action Triggered:**
```javascript
dispatch(fetchProductById(productId))
```
- Endpoint: `GET /product/{productId}`
- Returns: Single product object
- State: `state.product.selectedProduct`

**Display:**
- Product image
- Product name, price, description
- "Add to Cart" button

---

## 🛒 CART INTEGRATION

### **7. ADD TO CART**
**File:** [ProductDetailsPage.jsx](src/Pages/ProductDetailsPage.jsx)

Flow:
- User clicks "Add to Cart" button on product details page

**Redux Action Triggered:**
```javascript
dispatch(addToCart({
  productId: selectedProduct._id,
  quantity: 1
}))
```
- Endpoint: `POST /cart/add`
- Credentials: Included
- Response: Updated cart data
- State: `state.cart.items[]`

---

### **8. VIEW CART**
**File:** [CartPage.jsx](src/Pages/CartPage.jsx)

Flow:
- Component mounts
- Redux hook: `useEffect(() => { dispatch(fetchCart()) }, [dispatch])`

**Redux Action Triggered:**
```javascript
dispatch(fetchCart())
```
- Endpoint: `GET /cart`
- Returns: All cart items
- State: `state.cart.items[]`

**Display:**
- List of cart items with images
- Price, quantity for each item
- Total price calculation
- "Remove" button for each item
- "Send Enquiry" button

---

### **9. REMOVE FROM CART**
**File:** [CartPage.jsx](src/Pages/CartPage.jsx)

Flow:
- User clicks "Remove" button on cart item

**Redux Action Triggered:**
```javascript
dispatch(removeFromCart({ productId }))
```
- Endpoint: `POST /admin/remove`
- Response: Updated cart
- State: `state.cart.items[]` updated

---

### **10. GENERATE ENQUIRY**
**File:** [CartPage.jsx](src/Pages/CartPage.jsx)

Flow:
- User clicks "Send Enquiry" button
- All cart items compiled

**Redux Action Triggered:**
```javascript
dispatch(generateEnquiry())
```
- Endpoint: `POST /cart/generate-enquiry`
- Returns: Enquiry confirmation message
- State: `state.cart.enquiryMessage`

**Display:**
- Success message: "Enquiry submitted successfully"
- Admin gets notified

---

## 👤 PROFILE PAGE INTEGRATION

### **11. FETCH USER PROFILE**
**File:** [ProfilePage.jsx](src/Pages/ProfilePage.jsx)

Flow:
- Component mounts
- Redux hook: `useEffect(() => { dispatch(fetchProfile()) }, [dispatch])`

**Redux Action Triggered:**
```javascript
dispatch(fetchProfile())
```
- Endpoint: `GET /auth/profile`
- Headers: `Authorization: Bearer ${accessToken}`
- Returns: User profile data
- State: `state.user.user` & `state.user.userStatus`

**Display:**
- All user details (firstName, lastName, businessName, phone, email, city, state)
- **Approval Status Banner:**
  - 🟡 Pending: "⏳ Your profile is pending admin approval"
  - 🟢 Approved: "✓ Your profile is approved. You have full access"
- "Logout" button

---

### **12. LOGOUT**
**File:** [ProfilePage.jsx](src/Pages/ProfilePage.jsx)

Flow:
- User clicks "Logout" button

**Redux Action Triggered:**
```javascript
dispatch(logout())
```
- Clears all user state
- Removes `accessToken` from localStorage
- Removes `phoneNumber` & `isdCode`
- Redirects to HomePage

---

## 🔐 STATE STRUCTURE

### Redux Store Shape:
```javascript
{
  user: {
    user: {
      firstName: string,
      lastName: string,
      businessName: string,
      phoneNumber: string,
      email: string,
      city: string,
      state: string,
      status: string // 'pending_details' | 'pending' | 'active'
    },
    accessToken: string | null,
    userStatus: 'pending_details' | 'pending' | 'active' | null,
    phoneNumber: string,
    isdCode: string,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
  },
  
  product: {
    products: Array<Product>,
    selectedProduct: Product | null,
    loading: boolean,
    error: string | null,
    success: boolean
  },
  
  cart: {
    items: Array<CartItem>,
    cartId: string | null,
    userId: string | null,
    loading: boolean,
    error: string | null,
    success: boolean,
    enquiryMessage: string | null
  },
  
  category: {
    categories: Array<Category>,
    selectedCategory: Category | null,
    loading: boolean,
    error: string | null,
    success: boolean
  }
}
```

---

## 🚀 IMPORTANT NOTES

### 1. **AccessToken Management**
- Token is stored in Redux state & localStorage
- Token used in all authenticated requests
- Auto-refreshed on profile fetch

### 2. **User Status Handling**
- `pending_details`: User filled form, awaiting admin approval
- `pending`: User approved, can access products
- `active`: Full access

### 3. **Error Handling**
- All async thunks have error handling
- Errors displayed to user
- Status indicator: `state.*.error`

### 4. **Loading States**
- All async operations show loading indicators
- Buttons disabled during loading
- Prevents duplicate submissions

### 5. **Backward Compatibility**
- `cart.js` utility kept for reference
- All new code uses Redux dispatches
- localStorage as backup only

---

## 📋 WORKFLOW SUMMARY

```
HomePage (See Products)
    ↓
OTPModal (Send OTP) → dispatch(requestOTP)
    ↓
OTPModal (Verify OTP) → dispatch(verifyOTP)
    ↓
UserFormModal (Complete Profile) → dispatch(updateProfile)
    ↓
HomePage (Show Approval Pending)
    ↓
[Admin Approves in Backend]
    ↓
ProductPage → dispatch(fetchProducts)
    ↓
ProductDetailsPage → dispatch(fetchProductById)
    ↓
dispatch(addToCart)
    ↓
CartPage → dispatch(fetchCart)
    ↓
dispatch(generateEnquiry)
    ↓
ProfilePage → dispatch(fetchProfile) & shows approval status
```

---

## 🔧 SETUP CHECKLIST

- ✅ Redux store configured in [store.js](src/Slices/store.js)
- ✅ All slices (userSlice, productSlice, cartSlice, categorySlice) imported
- ✅ OTPModal integrated with requestOTP & verifyOTP
- ✅ UserFormModal integrated with updateProfile
- ✅ HomePage shows approval pending modal
- ✅ ProductPage integrated with fetchProducts
- ✅ ProductDetailsPage integrated with fetchProductById & addToCart
- ✅ CartPage integrated with fetchCart, removeFromCart, generateEnquiry
- ✅ ProfilePage integrated with fetchProfile & logout
- ✅ Error handling in all components
- ✅ Loading states displayed

---

## 📝 NEXT STEPS

1. **Test the complete flow** - Go through the entire journey from OTP to enquiry
2. **Verify API endpoints** - Ensure all endpoints match backend
3. **Add navbar integration** - Update Navbar to show approval status
4. **Add protected routes** - Redirect unapproved users
5. **Implement refresh token logic** - Handle token expiration
6. **Add notifications** - Toast messages for success/errors

