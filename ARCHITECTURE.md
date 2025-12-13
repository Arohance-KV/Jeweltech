# Redux Integration - Visual Architecture

## 📐 Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                         REDUX STORE                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  userSlice   │  │ productSlice │  │  cartSlice   │               │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤               │
│  │ • user       │  │ • products   │  │ • items      │               │
│  │ • token      │  │ • selected   │  │ • cartId     │               │
│  │ • status     │  │ • loading    │  │ • loading    │               │
│  │ • error      │  │ • error      │  │ • error      │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │ dispatch           │ dispatch          │ dispatch
         │ (actions)          │ (actions)         │ (actions)
         │                    │                   │
    ┌────┴─────┐         ┌────┴──────┐      ┌────┴──────┐
    │ Component │         │ Component  │      │ Component │
    │ with      │         │ with       │      │ with      │
    │ useDispatch        │ useDispatch        │ useDispatch
    │ & useSelector      │ & useSelector      │ & useSelector
    └───────────┘        └────────────┘      └───────────┘
```

---

## 🔀 Complete User Journey Flow

```
START: Home Page
│
├─ User clicks "See Products"
│
└─▶ STEP 1: OTP Verification Flow
    │
    ├─ OTPModal opens
    ├─ User enters: ISD Code + Phone Number
    │
    ├─ DISPATCH requestOTP
    │  └─ POST /auth/request-otp
    │  └─ Redux State: status = 'loading'
    │  └─ Response: OTP sent to phone
    │
    ├─ User enters: 6-digit OTP
    │
    ├─ DISPATCH verifyOTP
    │  └─ POST /auth/verify-otp
    │  └─ Redux State: status = 'loading'
    │  └─ Response: {
    │     ├─ accessToken: "JWT...",
    │     └─ status: 'pending_details'
    │  }
    │
    └─ OTPModal closes, UserFormModal opens
       └─ Verified phone displayed (read-only)
       └─ User data passed to next component

STEP 2: Profile Completion Flow
│
├─ UserFormModal open
├─ User fills:
│  ├─ firstName
│  ├─ lastName
│  ├─ businessName
│  ├─ email
│  ├─ city
│  └─ state
│
├─ DISPATCH updateProfile(formData)
│  ├─ PATCH /auth/profile
│  ├─ Headers: Authorization: Bearer {accessToken}
│  ├─ Redux State: status = 'loading'
│  └─ Response: {
│     ├─ user: {...profileData},
│     ├─ status: 'pending_details',
│     └─ ...
│  }
│
├─ UserFormModal closes
│
└─▶ Show "Approval Pending" Modal
   ├─ Message: "⏳ Your profile is pending admin approval"
   ├─ Options:
   │  ├─ Go to Profile
   │  └─ Return Home
   │
   └─ ADMIN APPROVES IN BACKEND
      └─ userStatus changes: 'pending_details' → 'active'

STEP 3: Browse Products Flow
│
├─ User navigates to /product
│
├─ DISPATCH fetchProducts()
│  ├─ GET /product
│  ├─ Redux State: loading = true
│  └─ Response: [ {product1}, {product2}, ... ]
│
├─ ProductPage renders:
│  └─ 4-column grid of products
│     └─ Each card: image, name, price, "View Details"
│
├─ User clicks "View Details"
│
└─ Navigate to /product/{id}

STEP 4: View Product Details Flow
│
├─ ProductDetailsPage mounts
├─ Extract productId from URL params
│
├─ DISPATCH fetchProductById(id)
│  ├─ GET /product/{id}
│  ├─ Redux State: loading = true
│  └─ Response: {
│     ├─ _id: "...",
│     ├─ name: "...",
│     ├─ price: 25999,
│     ├─ description: "...",
│     ├─ image: "...",
│     └─ ...
│  }
│
├─ ProductDetailsPage renders:
│  ├─ Large product image
│  ├─ Product name & price
│  ├─ Description
│  └─ "Add to Cart" button
│
└─ User clicks "Add to Cart"

STEP 5: Add to Cart Flow
│
├─ DISPATCH addToCart({productId, quantity: 1})
│  ├─ POST /cart/add
│  ├─ Credentials: include
│  ├─ Redux State: loading = true
│  └─ Response: {
│     ├─ items: [{...cartItem}],
│     ├─ _id: "cartId",
│     └─ ...
│  }
│
├─ Alert: "Added to cart!"
│
└─ User can:
   ├─ Continue shopping
   ├─ View cart
   └─ Generate enquiry

STEP 6: View Cart Flow
│
├─ User clicks cart icon / navigates to /cart
│
├─ DISPATCH fetchCart()
│  ├─ GET /cart
│  ├─ Credentials: include
│  ├─ Redux State: loading = true
│  └─ Response: {
│     ├─ items: [ {item1}, {item2}, ... ],
│     ├─ _id: "cartId",
│     ├─ userId: "...",
│     └─ ...
│  }
│
├─ CartPage renders:
│  ├─ List of cart items
│  ├─ For each item:
│  │  ├─ Image, name, price
│  │  ├─ Quantity display
│  │  └─ "Remove" button
│  ├─ Total price
│  └─ "Send Enquiry" button
│
└─ User can:
   ├─ Remove items
   └─ Generate enquiry

STEP 7: Remove from Cart Flow
│
├─ User clicks "Remove" on item
│
├─ DISPATCH removeFromCart({productId})
│  ├─ POST /admin/remove
│  ├─ Credentials: include
│  ├─ Redux State: loading = true
│  └─ Response: {
│     ├─ items: [ ...updatedItems ],
│     └─ ...
│  }
│
└─ Cart updated in Redux

STEP 8: Generate Enquiry Flow
│
├─ User clicks "Send Enquiry"
│
├─ DISPATCH generateEnquiry()
│  ├─ POST /cart/generate-enquiry
│  ├─ Credentials: include
│  ├─ Redux State: loading = true
│  └─ Response: {
│     ├─ message: "Enquiry submitted successfully",
│     └─ ...
│  }
│
├─ Success message displayed
│
└─ Admin receives enquiry notification

STEP 9: View Profile Flow
│
├─ User navigates to /profile
│
├─ DISPATCH fetchProfile()
│  ├─ GET /auth/profile
│  ├─ Headers: Authorization: Bearer {accessToken}
│  ├─ Redux State: loading = true
│  └─ Response: {
│     ├─ firstName: "...",
│     ├─ lastName: "...",
│     ├─ businessName: "...",
│     ├─ email: "...",
│     ├─ city: "...",
│     ├─ state: "...",
│     ├─ status: "pending_details" OR "active",
│     └─ ...
│  }
│
├─ ProfilePage renders:
│  ├─ All user details
│  ├─ Approval status banner:
│  │  ├─ If 'pending_details': 🟡 "Pending Approval"
│  │  └─ If 'active': 🟢 "Profile Approved"
│  └─ "Logout" button
│
└─ User can:
   ├─ View information
   └─ Logout

STEP 10: Logout Flow
│
├─ User clicks "Logout"
│
├─ DISPATCH logout()
│  ├─ Clears Redux state:
│  │  ├─ user = null
│  │  ├─ accessToken = null
│  │  ├─ userStatus = null
│  │  ├─ phoneNumber = null
│  │  └─ isdCode = null
│  ├─ Clears localStorage:
│  │  └─ accessToken removed
│  │
│  └─ Redirect to HomePage
│
└─ END: Back to start
   └─ Must verify OTP again to access features
```

---

## 🎯 Redux Dispatch -> API -> State Update

```
Component
   │
   ├─ DISPATCH requestOTP({ isdCode, phoneNumber })
   │
   ▼
userSlice (thunk)
   │
   ├─ PENDING: status = 'loading'
   │
   ├─ API Call: POST /auth/request-otp
   │         └─ Body: { isdCode, phoneNumber }
   │
   ├─ Response received ✓
   │
   ├─ FULFILLED:
   │  ├─ status = 'succeeded'
   │  ├─ error = null
   │  └─ Stored in Redux state
   │
   └─ Component Re-renders
      └─ Uses useSelector to get new state
         └─ status = 'succeeded' → Show next step
```

---

## 🔐 Authentication State Machine

```
    ┌─────────────────────────────────────────────┐
    │        NOT AUTHENTICATED                    │
    │  • user = null                              │
    │  • accessToken = null                       │
    │  • userStatus = null                        │
    └─────────┬───────────────────────────────────┘
              │
              │ dispatch(verifyOTP) ✓
              │ Get accessToken
              │
              ▼
    ┌─────────────────────────────────────────────┐
    │    PENDING APPROVAL                         │
    │  • accessToken = "JWT..."                   │
    │  • userStatus = 'pending_details'           │
    │  ✗ Cannot access full features              │
    └─────────┬───────────────────────────────────┘
              │
              │ dispatch(updateProfile) ✓
              │ Form submitted to backend
              │
              │ Admin approves in backend
              │ userStatus: pending_details → active
              │
              ├─ Next login: dispatch(fetchProfile)
              │
              ▼
    ┌─────────────────────────────────────────────┐
    │    FULLY AUTHENTICATED                      │
    │  • accessToken = "JWT..."                   │
    │  • userStatus = 'active'                    │
    │  ✓ Full access to all features              │
    └─────────┬───────────────────────────────────┘
              │
              │ dispatch(logout)
              │ Clear everything
              │
              ▼
    ┌─────────────────────────────────────────────┐
    │        NOT AUTHENTICATED (again)             │
    │  • user = null                              │
    │  • accessToken = null                       │
    │  • userStatus = null                        │
    │  Redirected to HomePage                     │
    └─────────────────────────────────────────────┘
```

---

## 📊 Component Tree with Redux Integration

```
App
├── Provider (Redux)
│   │
│   ├── Navbar
│   │   ├── useSelector(cartItems)
│   │   └── useSelector(userStatus)
│   │
│   ├── Routes
│   │   │
│   │   ├── HomePage "/"
│   │   │   ├── OTPModal
│   │   │   │   ├── useDispatch(requestOTP)
│   │   │   │   ├── useDispatch(verifyOTP)
│   │   │   │   ├── useSelector(status)
│   │   │   │   └── useSelector(error)
│   │   │   │
│   │   │   ├── UserFormModal
│   │   │   │   ├── useDispatch(updateProfile)
│   │   │   │   ├── useSelector(status)
│   │   │   │   └── useSelector(userStatus)
│   │   │   │
│   │   │   └── Approval Modal (conditional)
│   │   │
│   │   ├── ProductPage "/product"
│   │   │   ├── useDispatch(fetchProducts) [useEffect]
│   │   │   ├── useSelector(products)
│   │   │   ├── useSelector(loading)
│   │   │   └── useSelector(error)
│   │   │
│   │   ├── ProductDetailsPage "/product/:id"
│   │   │   ├── useDispatch(fetchProductById) [useEffect]
│   │   │   ├── useDispatch(addToCart)
│   │   │   ├── useSelector(selectedProduct)
│   │   │   ├── useSelector(loading)
│   │   │   └── useSelector(error)
│   │   │
│   │   ├── CartPage "/cart"
│   │   │   ├── useDispatch(fetchCart) [useEffect]
│   │   │   ├── useDispatch(removeFromCart)
│   │   │   ├── useDispatch(generateEnquiry)
│   │   │   ├── useSelector(items)
│   │   │   ├── useSelector(loading)
│   │   │   ├── useSelector(error)
│   │   │   └── useSelector(enquiryMessage)
│   │   │
│   │   └── ProfilePage "/profile"
│   │       ├── useDispatch(fetchProfile) [useEffect]
│   │       ├── useDispatch(logout)
│   │       ├── useSelector(user)
│   │       ├── useSelector(userStatus)
│   │       ├── useSelector(loading)
│   │       └── useSelector(error)
│   │
│   └── Footer
│
└── Redux Store (global state)
    ├── user (userSlice)
    ├── product (productSlice)
    ├── cart (cartSlice)
    └── category (categorySlice)
```

---

## 🔄 Async Thunk Lifecycle

```
Component calls: dispatch(asyncThunk(payload))
                    │
                    ▼
            Thunk pending action
                    │
        ┌───────────┴───────────┐
        │                       │
   Auto error              Auto loading
   handling               state = 'loading'
        │                       │
        ▼                       ▼
    API Call (fetch)      Component can show
                          loading spinner
        │
        ├─ Success: status 200
        │   │
        │   └─ fulfilled action
        │       ├─ status = 'succeeded'
        │       ├─ payload = response data
        │       └─ error = null
        │       └─ Component re-renders
        │
        └─ Error: status 4xx/5xx
            │
            └─ rejected action
                ├─ status = 'failed'
                ├─ payload = null
                └─ error = error message
                └─ Component shows error
```

---

## 💾 Data Persistence

```
Browser Storage Hierarchy:
│
├─ Redux Store (Memory)
│  ├─ Instantly available
│  ├─ Lost on refresh
│  └─ Source of truth for UI
│
├─ localStorage
│  ├─ Persistent across sessions
│  ├─ Limited size (~5-10MB)
│  └─ Only accessToken stored
│
└─ Backend Database
   ├─ Permanent storage
   ├─ Single source of truth
   └─ User data, cart items, etc.

Flow:
┌────────────────────────────────────────────┐
│ User Action                                │
│ (e.g., Add to Cart)                       │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Dispatch Redux Action │
        └──────────┬───────────┘
                   │
       ┌───────────┴─────────────┐
       │                         │
       ▼                         ▼
┌─────────────┐         ┌──────────────┐
│ Update      │         │ API Call to  │
│ Redux Store │         │ Backend      │
│ (immediate) │         │ (async)      │
└─────────────┘         └───────┬──────┘
       │                        │
       │                    ┌───┴───┐
       │                    │       │
       │                  Success Error
       │                    │       │
       │    ┌───────────────┘       │
       │    │                       │
       ▼    ▼                       ▼
   ┌─────────────────────┐  ┌──────────────┐
   │ Update localStorage │  │ Show error   │
   │ (for token only)    │  │ message      │
   └─────────────────────┘  └──────────────┘
       │
       ▼
   Component sees new
   state via useSelector,
   re-renders with updates
```

---

## 🎬 Action Timeline Example: Add to Cart

```
Time  │  User Action         Redux State              UI Update
──────┼──────────────────────────────────────────────────────────
  0ms │  Click "Add to Cart" status: 'idle'          Button disabled
      │                     error: null
      │
  5ms │  dispatch(addToCart) status: 'loading'       "Adding..." text
      │  (Thunk starts)      error: null              Button disabled
      │
 10ms │                      [API call in progress]   Loading spinner
      │
500ms │                      [Waiting for response]   Loading spinner
      │
600ms │  API Response ✓      status: 'succeeded'     Success alert
      │  items: [...]        items: [newItem]         Cart count +1
      │                      error: null              Button enabled
      │
 610ms│                                              Component
      │                                              re-renders
      │
      │  ✅ Add to Cart successful!
```

---

## 📡 API Endpoints Map

```
USER SLICE
├── requestOTP
│   └─ POST /auth/request-otp
│      Body: { isdCode, phoneNumber }
│
├── verifyOTP
│   └─ POST /auth/verify-otp
│      Body: { isdCode, phoneNumber, otp }
│      Response: { accessToken, status }
│
├── fetchProfile
│   └─ GET /auth/profile
│      Headers: Authorization: Bearer {token}
│      Response: { user object with status }
│
└── updateProfile
    └─ PATCH /auth/profile
       Headers: Authorization: Bearer {token}
       Body: { firstName, lastName, businessName, email, city, state }
       Response: { user object with status }

PRODUCT SLICE
├── fetchProducts
│   └─ GET /product
│      Response: [ { _id, name, price, image, ... }, ... ]
│
└── fetchProductById
    └─ GET /product/{productId}
       Response: { _id, name, price, image, description, ... }

CART SLICE
├── fetchCart
│   └─ GET /cart
│      Credentials: include
│      Response: { items: [...], _id, userId }
│
├── addToCart
│   └─ POST /cart/add
│      Credentials: include
│      Body: { productId, quantity }
│      Response: { items: [...], _id }
│
├── removeFromCart
│   └─ POST /admin/remove
│      Credentials: include
│      Body: { productId }
│      Response: { items: [...] }
│
├── clearCart
│   └─ POST /cart/clear
│      Credentials: include
│      Response: { items: [] }
│
└── generateEnquiry
    └─ POST /cart/generate-enquiry
       Credentials: include
       Response: { message: "..." }
```

---

This architecture provides a complete, scalable, and maintainable e-commerce application with Redux state management!
