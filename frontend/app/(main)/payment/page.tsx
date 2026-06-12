"use client";

import { useState } from "react";
import CheckoutStepper, {
  CheckoutStep,
} from "@/components/checkout/CheckoutStepper";
import OrderSummary from "@/components/checkout/OrderSummary";
import InfoBox from "@/components/checkout/InfoBox";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const EMPTY_FORM: FormData = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

export default function PaymentPage() {
  const [step, setStep] = useState<CheckoutStep>("details");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saved, setSaved] = useState<FormData | null>(null);
  const [shippingMethod] = useState("standard");

  const stepperMap: Record<CheckoutStep, CheckoutStep> = {
    details: "details",
    shipping: "shipping",
    payment: "payment",
    cart: "cart",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => setSaved({ ...form });

  if (step === "details") {
    return (
      <PageShell activeStep="details">
        <div className="two-col">
          {/* LEFT */}
          <section className="form-section">
            {/* Contact */}
            <div className="form-group">
              <h3 className="section-heading">Contact</h3>
              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            {/* Shipping Address */}
            <div className="form-group">
              <h3 className="section-heading">Shipping Address</h3>
              <div className="field-row">
                <FormField
                  label="First name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Joe"
                />
                <FormField
                  label="Last name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                />
              </div>
              <FormField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Forest Lane"
              />
              <div className="field-row">
                <FormField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Bangkok"
                />
                <FormField
                  label="Postal code"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="10400"
                />
              </div>
              <FormField
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Thailand"
              />
            </div>

            {/* Save */}
            <button className="btn-save" onClick={handleSave}>
              {saved ? "✓ Saved" : "Save"}
            </button>

            {/* Nav */}
            <div className="nav-row">
              <button
                className="btn-ghost"
                onClick={() => window.history.back()}
              >
                ← Back to cart
              </button>
              <button
                className="btn-primary"
                onClick={() => setStep("shipping")}
              >
                Go Shipping →
              </button>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="summary-col">
            <OrderSummary />
          </aside>
        </div>

        <StepStyles />
      </PageShell>
    );
  }

  if (step === "shipping") {
    const displayName = saved
      ? `${saved.firstName} ${saved.lastName}`.trim()
      : "—";
    const displayAddr = saved
      ? [saved.address, saved.city, saved.postalCode, saved.country]
          .filter(Boolean)
          .join(", ")
      : "—";

    return (
      <PageShell activeStep="shipping">
        <div className="two-col">
          {/* LEFT */}
          <section className="form-section">
            <InfoBox
              title="Contact · Ship to"
              fields={[
                { label: "Email", value: saved?.email || "—" },
                { label: "Name", value: displayName },
                { label: "Address", value: displayAddr },
              ]}
              onEdit={() => setStep("details")}
            />

            <div className="form-group" style={{ marginTop: 24 }}>
              <h3 className="section-heading">Shipping Method</h3>
              <label className="shipping-option selected">
                <span className="radio-dot" />
                <div className="option-text">
                  <span className="option-title">Standard Shipping</span>
                  <span className="option-sub">5–7 business days</span>
                </div>
                <span className="option-price">$5.00</span>
              </label>
            </div>

            <div className="nav-row" style={{ marginTop: 32 }}>
              <button className="btn-ghost" onClick={() => setStep("details")}>
                ← Back to details
              </button>
              <button
                className="btn-primary"
                onClick={() => setStep("payment")}
              >
                Go Payment →
              </button>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="summary-col">
            <OrderSummary />
          </aside>
        </div>

        <StepStyles />
      </PageShell>
    );
  }

  if (step === "payment") {
    const displayName = saved
      ? `${saved.firstName} ${saved.lastName}`.trim()
      : "—";
    const displayAddr = saved
      ? [saved.address, saved.city, saved.postalCode, saved.country]
          .filter(Boolean)
          .join(", ")
      : "—";

    return (
      <PageShell activeStep="payment">
        <div className="two-col">
          {/* LEFT */}
          <section className="form-section">
            <InfoBox
              title="Contact · Ship to"
              fields={[
                { label: "Email", value: saved?.email || "—" },
                { label: "Name", value: displayName },
                { label: "Address", value: displayAddr },
              ]}
              onEdit={() => setStep("details")}
            />

            <InfoBox
              title="Shipping Method"
              fields={[
                {
                  label: "Method",
                  value:
                    shippingMethod === "standard"
                      ? "Standard Shipping — $5.00"
                      : shippingMethod,
                },
              ]}
              onEdit={() => setStep("shipping")}
            />

            {/* QR Payment */}
            <div className="form-group" style={{ marginTop: 24 }}>
              <h3 className="section-heading">Payment</h3>
              <div className="qr-card">
                <p className="qr-label">Scan to pay</p>
                <QRCode />
                <p className="qr-sub">
                  Use any banking app · Amount: <strong>$34.99</strong>
                </p>
              </div>
            </div>

            <div className="nav-row" style={{ marginTop: 32 }}>
              <button className="btn-ghost" onClick={() => setStep("shipping")}>
                ← Back to shipping
              </button>
              <button className="btn-primary" onClick={() => setStep("cart")}>
                Pay & Confirm →
              </button>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="summary-col">
            <OrderSummary />
          </aside>
        </div>

        <StepStyles />
      </PageShell>
    );
  }

  return (
    <PageShell activeStep="cart">
      <div className="two-col">
        {/* LEFT — success */}
        <section className="form-section">
          <div className="success-card">
            <div className="success-icon">
              <svg
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="26"
                  cy="26"
                  r="25"
                  stroke="#b4915b"
                  strokeWidth="2"
                />
                <path
                  d="M14 27l8 8 16-16"
                  stroke="#b4915b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="success-eyebrow">Payment Confirmed</p>
            <h2 className="success-order">ORDER #2039</h2>
            <p className="success-body">
              Thank you <strong>{saved?.firstName || "Joe"}</strong> for buying
              Candleaf. The nature is grateful to you.
            </p>
            <p className="success-body">
              Now that your order is confirmed it will be ready to ship in{" "}
              <strong>2 days</strong>. Please check your inbox in the future for
              your order updates.
            </p>

            <button
              className="btn-primary"
              style={{ marginTop: 28 }}
              onClick={() => {
                setStep("details");
                setForm(EMPTY_FORM);
                setSaved(null);
              }}
            >
              Back to shopping
            </button>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="summary-col">
          <OrderSummary isPaid />
        </aside>
      </div>

      <StepStyles />
    </PageShell>
  );
}

function PageShell({
  activeStep,
  children,
}: {
  activeStep: CheckoutStep;
  children: React.ReactNode;
}) {
  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <div className="header-inner">
          <span className="brand">🕯 Candleaf</span>
          <CheckoutStepper activeStep={activeStep} />
        </div>
      </header>

      <main className="checkout-main">{children}</main>

      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: "Helvetica Neue", Arial, sans-serif;
          background: #f7f5f2;
          color: #2c2c2c;
        }

        .checkout-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .checkout-header {
          background: #fff;
          border-bottom: 1px solid #ede9e0;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-inner {
          max-width: 1080px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          font-size: 17px;
          font-weight: 700;
          color: #2c2c2c;
          letter-spacing: -0.02em;
        }

        .checkout-main {
          flex: 1;
          max-width: 1080px;
          margin: 0 auto;
          width: 100%;
          padding: 40px 24px 80px;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
          align-items: start;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .summary-col {
          position: sticky;
          top: 80px;
        }

        @media (max-width: 768px) {
          .two-col {
            grid-template-columns: 1fr;
          }
          .summary-col {
            position: static;
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}

function StepStyles() {
  return (
    <style jsx global>{`
      .section-heading {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #999;
        margin: 0 0 14px;
      }

      .form-group {
        margin-bottom: 28px;
      }

      .field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .field-wrap {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 12px;
      }

      .field-wrap label {
        font-size: 12px;
        color: #888;
        font-weight: 500;
      }

      .field-wrap input {
        height: 42px;
        border: 1.5px solid #e2ddd6;
        border-radius: 8px;
        padding: 0 12px;
        font-size: 14px;
        color: #2c2c2c;
        background: #fff;
        outline: none;
        transition: border-color 0.15s;
      }

      .field-wrap input:focus {
        border-color: #b4915b;
      }

      .field-wrap input::placeholder {
        color: #ccc;
      }

      .btn-save {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #f0ebe3;
        border: 1.5px solid #d4c4a8;
        border-radius: 8px;
        padding: 9px 20px;
        font-size: 13px;
        font-weight: 600;
        color: #7a6040;
        cursor: pointer;
        margin-bottom: 28px;
        transition: background 0.15s;
      }

      .btn-save:hover {
        background: #e8dfd2;
      }

      .nav-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      .btn-ghost {
        background: none;
        border: none;
        font-size: 13px;
        color: #999;
        cursor: pointer;
        padding: 0;
        font-weight: 500;
        transition: color 0.15s;
      }

      .btn-ghost:hover {
        color: #555;
      }

      .btn-primary {
        background: #b4915b;
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 13px 28px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        letter-spacing: 0.02em;
        transition:
          background 0.15s,
          transform 0.1s;
      }

      .btn-primary:hover {
        background: #9f7d4a;
      }

      .btn-primary:active {
        transform: scale(0.98);
      }

      /* Shipping option */
      .shipping-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border: 2px solid #b4915b;
        border-radius: 10px;
        cursor: pointer;
        background: #fffdf9;
      }

      .radio-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid #b4915b;
        flex-shrink: 0;
        position: relative;
      }

      .radio-dot::after {
        content: "";
        position: absolute;
        inset: 3px;
        background: #b4915b;
        border-radius: 50%;
      }

      .option-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .option-title {
        font-size: 13px;
        font-weight: 600;
        color: #2c2c2c;
      }

      .option-sub {
        font-size: 12px;
        color: #999;
      }

      .option-price {
        font-size: 13px;
        font-weight: 600;
        color: #b4915b;
      }

      /* QR card */
      .qr-card {
        border: 1.5px solid #ede9e0;
        border-radius: 12px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        background: #fff;
      }

      .qr-label {
        font-size: 13px;
        color: #888;
        margin: 0;
        font-weight: 500;
      }

      .qr-sub {
        font-size: 12px;
        color: #aaa;
        margin: 0;
        text-align: center;
      }

      .qr-sub strong {
        color: #b4915b;
      }

      /* Success */
      .success-card {
        background: #fff;
        border: 1.5px solid #ede9e0;
        border-radius: 16px;
        padding: 48px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 12px;
      }

      .success-icon svg {
        width: 64px;
        height: 64px;
      }

      .success-icon {
        margin-bottom: 8px;
      }

      .success-eyebrow {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #b4915b;
        margin: 0;
      }

      .success-order {
        font-size: 24px;
        font-weight: 800;
        color: #2c2c2c;
        margin: 0;
        letter-spacing: -0.02em;
      }

      .success-body {
        font-size: 14px;
        color: #666;
        line-height: 1.65;
        max-width: 380px;
        margin: 0;
      }
    `}</style>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="field-wrap">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}

function QRCode() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="160" height="160" rx="8" fill="#fafaf8" />
      {/* Corner squares */}
      <rect x="12" y="12" width="44" height="44" rx="4" fill="#2c2c2c" />
      <rect x="18" y="18" width="32" height="32" rx="2" fill="#fafaf8" />
      <rect x="24" y="24" width="20" height="20" rx="1" fill="#2c2c2c" />

      <rect x="104" y="12" width="44" height="44" rx="4" fill="#2c2c2c" />
      <rect x="110" y="18" width="32" height="32" rx="2" fill="#fafaf8" />
      <rect x="116" y="24" width="20" height="20" rx="1" fill="#2c2c2c" />

      <rect x="12" y="104" width="44" height="44" rx="4" fill="#2c2c2c" />
      <rect x="18" y="110" width="32" height="32" rx="2" fill="#fafaf8" />
      <rect x="24" y="116" width="20" height="20" rx="1" fill="#2c2c2c" />

      {/* Data dots */}
      {[
        [68, 12],
        [76, 12],
        [84, 12],
        [92, 12],
        [68, 20],
        [84, 20],
        [68, 28],
        [76, 28],
        [84, 28],
        [68, 36],
        [92, 36],
        [68, 44],
        [76, 44],
        [84, 44],
        [92, 44],
        [12, 68],
        [20, 68],
        [36, 68],
        [12, 76],
        [28, 76],
        [44, 76],
        [12, 84],
        [20, 84],
        [28, 84],
        [36, 84],
        [12, 92],
        [44, 92],
        [68, 68],
        [76, 68],
        [92, 68],
        [68, 76],
        [84, 76],
        [76, 84],
        [92, 84],
        [68, 92],
        [84, 92],
        [92, 92],
        [104, 68],
        [112, 68],
        [128, 68],
        [144, 68],
        [104, 76],
        [120, 76],
        [144, 76],
        [112, 84],
        [128, 84],
        [104, 92],
        [112, 92],
        [120, 92],
        [144, 92],
        [68, 104],
        [84, 104],
        [92, 104],
        [68, 112],
        [76, 112],
        [68, 120],
        [84, 120],
        [92, 120],
        [76, 128],
        [92, 128],
        [68, 136],
        [76, 136],
        [84, 136],
        [104, 104],
        [120, 104],
        [112, 112],
        [128, 112],
        [136, 112],
        [104, 120],
        [136, 120],
        [104, 128],
        [112, 128],
        [128, 128],
        [120, 136],
        [136, 136],
        [104, 144],
        [128, 144],
        [144, 144],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="6" height="6" rx="1" fill="#2c2c2c" />
      ))}
    </svg>
  );
}
