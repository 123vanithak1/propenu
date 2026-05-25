---
name: payments and subscription integration skill
description: payments and subscription integration skill for propenu to manage premium plans and razorpay gateways.
---

# Payments & Subscription Integration Guide (Propenu Expo App)

This document provides a comprehensive guide for the Expo LLM / developer to understand, manage, and implement the payments and subscription system in the Propenu mobile app, aligning with the backend microservice architecture.

---

## 1. System Architecture & Models

The payments system uses **Razorpay** as the payment gateway. The backend is designed around three main database models in `payment-service`:

### A. Plan Model (`Plan`)
Defines the available tiers, duration, pricing, and features.
* **Tiers**: `free`, `tier1`, `tier2`, `tier3` (ranked for upgrades/downgrades).
* **Categories**: `sell`, `rent`, `both` (for owners/builders), or `buy`, `rent_view` (for buyers).
* **Features**: Dynamic map including limitations like `PROPERTY_LISTING_LIMIT`, `CONTACT_OWNER_LIMIT`, etc.

### B. Subscription Model (`Subscription`)
Represents a user's active premium membership.
* **Fields**: `userId`, `planCode`, `tier`, `category`, `invoiceUrl`, `status` (`active`, `expired`, `upgraded`, `cancelled`), `startDate`, `endDate`.
* **Usage Limits**: Tracks remaining features/contacts.

### C. Payment Model (`Payment`)
Logs transactional attempts and signatures.
* **Fields**: `userId`, `orderId`, `amount`, `paymentType` (`new`, `upgrade`, `renewal`), `creditAdjusted`, `status` (`created`, `paid`, `failed`).

---

## 2. Dynamic Pro-Rated Upgrades & Logic

When a user upgrades to a higher tier plan before their current plan expires:
1. **Tier Rank Comparison**: The backend maps tiers to ranks: `free (0)`, `tier1 (1)`, `tier2 (2)`, `tier3 (3)`.
2. **Upgrade**: If the new plan tier rank is higher than the current active rank:
   - Calculates remaining days of active subscription.
   - Calculates pro-rated credit of the old plan: `(oldPlan.price / durationDays) * remainingDays`.
   - Calculates pro-rated cost of the new plan: `(newPlan.price / durationDays) * remainingDays`.
   - Deducts credit from new cost: `finalPayable = Max(newDailyCost - oldDailyCredit, 0)`.
3. **Downgrade**: If rank is lower, the backend throws an error: `"Downgrade will activate after current plan expiry"`.
4. **Renewal**: Same rank, charges full plan price.

---

## 3. Endpoints Map

The app interacts with the following endpoints:

| Endpoint | Method | Headers | Description |
| :--- | :--- | :--- | :--- |
| `/api/payments/plans` | `GET` | None | Fetch plans filtered by `userType` and `category`. |
| `/api/payments/subscriptions/me` | `GET` | `Bearer <JWT>` | Get active plan status, remaining listings, and duration. |
| `/api/payments/subscriptions/history` | `GET` | `Bearer <JWT>` | Get subscription logs and S3 invoice links. |
| `/api/payments/create` | `POST` | `Bearer <JWT>` | Initiate a plan subscription. Returns order parameters. |
| `/api/payments/verify` | `POST` | `Bearer <JWT>` | Verify Razorpay SHA256 signature and activate plan. |

---

## 4. Expo Integration & Client Implementation

### A. API Request Setup (`agentServices.js` & `userServices.js`)
These calls are already registered under:
- `agentServices.getMyPlans({ userType, category })`
- `agentServices.getMySubscription()`
- `agentServices.createPaymentOrder({ planId, userType })`
- `agentServices.verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature })`
- `userServices.getMembershipHistory()`

### B. Payment Hook & Checkout (`react-native-razorpay`)

For paid plans, use `react-native-razorpay`. Below is the standard controller flow to handle free/paid subscriptions and verify signatures:

```typescript
import RazorpayCheckout from "react-native-razorpay";
import { agentServices } from "../../services/agentServices";
import { ToastError, ToastSuccess } from "../../utils/Toast";

interface PlanItem {
  _id: string;
  name: string;
  price: number;
}

export async function handleSubscribe(plan: PlanItem, userDetails: any, navigation: any) {
  try {
    // 1. Create order on the backend
    const order = await agentServices.createPaymentOrder({
      planId: plan._id,
      userType: userDetails?.roleName === "agent" ? "agent" : "owner",
    });

    // 2. Direct activation for Free plans (No Razorpay checkout required)
    if (order?.free) {
      if (order?.alreadyActive) {
        ToastSuccess("Plan is already active 👍");
        return;
      }
      ToastSuccess("Free plan activated successfully 🎉");
      navigation.navigate("Membership");
      return;
    }

    // 3. Setup Razorpay Checkout options for paid plans
    const options = {
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "Propenu",
      description: `${plan.name} Subscription`,
      prefill: {
        name: userDetails?.name || "",
        email: userDetails?.email || "",
        contact: userDetails?.phone || "",
      },
      theme: { color: "#27AE60" },
    };

    // 4. Launch Razorpay Native SDK
    RazorpayCheckout.open(options)
      .then(async (response) => {
        // 5. Send transaction details back to backend for verification & S3 Invoice generation
        await agentServices.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        ToastSuccess("Payment verified & subscription activated!");
        navigation.navigate("Membership");
      })
      .catch((error) => {
        console.error("Payment SDK error: ", error);
        ToastError(error?.description || "Payment cancelled or failed");
      });

  } catch (err: any) {
    const errorMsg = err?.message || "Verification failed";
    ToastError(errorMsg);
    console.error("Subscription Error:", err);
  }
}
```

---

## 5. Fetching Active Subscription and Limits

To retrieve details about the user's active plans and display progress bars (e.g. on [Membership.jsx](file:///Users/mbair15/propenu/src/screens/UserAccount/Membership.jsx)):

```typescript
const { data: mySubscription, isLoading } = useQuery({
  queryKey: ["my-subscription"],
  queryFn: agentServices.getMySubscription,
});
```

### Mapping Response Fields to UI:
* **Active Status**: `mySubscription?.active` (if `false`, show pricing promotional banners).
* **Plan Details Array**: `mySubscription?.plans`
* **Used / Remaining calculations**:
  - `plan.planName`: Name of the subscription plan.
  - `plan.total`: Total allowed limit.
  - `plan.used`: Total count consumed by the user (backend counts active property listings automatically).
  - `plan.remaining`: `plan.total - plan.used` (remaining credits).
  - `plan.unit`: `properties` (listings limit) or `contacts` (owner contact unlock limit).
  - `plan.startDate` / `plan.endDate`: Use these timestamps to calculate the active progress percentage bar and expiring-soon states.
