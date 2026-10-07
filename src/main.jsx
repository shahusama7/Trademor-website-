import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  Menu,
  X,
  Globe2,
  Package,
  ChartNoAxesCombined,
  MoveUpRight,
  Layers3,
  LoaderCircle,
} from "lucide-react";
import "@fontsource-variable/sora";
import "./styles.css";
import { submitEnquiry } from "./enquiries.js";

const goals = [
  "Sell more",
  "Find more buyers",
  "Enter new markets",
  "Get paid globally",
  "Not sure yet",
];
const stages = ["Just starting", "Growing", "Selling globally"];
const steps = [
  ["Know the numbers", "Know your sales, costs, and stock."],
  ["Find the demand", "See where your product can sell."],
  ["Look ready", "Build trust before the first call."],
  ["Get better leads", "Reach serious buyers, not random traffic."],
  ["Win more orders", "Turn the right leads into real business."],
  ["Stay in control", "Keep sales, stock, payments, and your team on track."],
];
const plans = [
  {
    name: "Basic",
    price: "1,399",
    text: "For businesses starting their export journey.",
    number: "01",
  },
  {
    name: "Basic Plus",
    price: "2,999",
    text: "For businesses ready to grow.",
    number: "02",
  },
  {
    name: "GGS Pro",
    price: "3,999",
    text: "For established exporters.",
    number: "03",
  },
  {
    name: "Verified Supplier",
    price: "9,999",
    text: "For businesses ready to build a stronger global presence.",
    number: "04",
  },
];

function Button({ children, href, className = "", ...props }) {
  const Tag = href ? "a" : "button";
  const [pulse, setPulse] = useState(0);
  const { onClick, ...rest } = props;
  return (
    <Tag href={href} className={`button ${className}`} {...rest}
      onClick={(event) => { setPulse((value) => value + 1); onClick?.(event); }}>
      {pulse > 0 && <i key={pulse} className="click-wave" aria-hidden="true" />}
      <span>{children}</span>
      <ArrowUpRight size={20} strokeWidth={1.8} />
    </Tag>
  );
}

function Header({ alibaba }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo-link" href="/" aria-label="Trademor home">
          <img
            src="/brand/logo-dark.svg"
            alt="Trademor"
            width="106"
            height="56"
          />
        </a>
        <nav
          className={`nav ${open ? "is-open" : ""}`}
          id="main-navigation"
          aria-label="Main navigation"
        >
          <a href="/#what-we-do" onClick={() => setOpen(false)}>
            What we do
          </a>
          <a
            href="/alibaba"
            className={alibaba ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            Alibaba.com
            <ArrowUpRight size={13} />
          </a>
          <a href="/#our-impact" onClick={() => setOpen(false)}>
            Our impact
          </a>
          <a href="/#how-we-work" onClick={() => setOpen(false)}>
            How we work
          </a>
          <a
            className="mobile-contact"
            href="#contact"
            onClick={() => setOpen(false)}
          >
            Let’s talk <ArrowUpRight size={16} />
          </a>
        </nav>
        <Button href="#contact" className="header-cta">
          Let’s talk
        </Button>
        <button
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function GrowthArtwork({ alibaba = false }) {
  const artRef = useRef(null);
  useEffect(() => {
    const art = artRef.current;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let visible = false;
    let pointerX = 0;
    let pointerY = 0;
    const reset = () => {
      art.style.setProperty("--motion-x", "0px");
      art.style.setProperty("--motion-y", "0px");
    };
    const draw = () => {
      frame = 0;
      if (motion.matches || !visible || document.hidden) return;
      const rect = art.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
      art.style.setProperty("--motion-x", `${pointerX * 10}px`);
      art.style.setProperty("--motion-y", `${progress * 28 + pointerY * 8}px`);
    };
    const schedule = () => { if (!frame && !motion.matches && visible) frame = requestAnimationFrame(draw); };
    const move = (event) => {
      if (!finePointer.matches) return;
      const rect = art.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
      schedule();
    };
    const leave = () => { pointerX = 0; pointerY = 0; schedule(); };
    const preference = () => { reset(); schedule(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    observer.observe(art);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    art.addEventListener("pointermove", move);
    art.addEventListener("pointerleave", leave);
    motion.addEventListener("change", preference);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      art.removeEventListener("pointermove", move);
      art.removeEventListener("pointerleave", leave);
      motion.removeEventListener("change", preference);
    };
  }, []);
  return (
    <div
      ref={artRef}
      className={`growth-art ${alibaba ? "global-art" : ""}`}
      aria-label={
        alibaba
          ? "Taking your products from Pakistan to global markets"
          : "An illustration of your business growing beyond borders"
      }
      role="img"
    >
      <div className="art-grid" />
      <div className="art-topline">
        <span className="live-dot" />{" "}
        {alibaba
          ? "LOCAL PRODUCTS. GLOBAL POTENTIAL."
          : "A LITTLE AMBITION. A WORLD OF POSSIBILITY."}
        <ArrowUpRight size={18} />
      </div>
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="art-tag tag-one">
        <Globe2 size={17} /> New markets <ArrowUpRight size={18} />
      </div>
      <div className="art-tag tag-two">
        <Package size={17} /> Your next big order
      </div>
      <div className="art-brand">
        <span>made in</span>
        <strong>Pakistan.</strong>
        <span className="art-brand-bottom">ready for the world.</span>
      </div>
      <div className="art-arrow">
        <img src="/brand/arrow.svg" alt="" />
      </div>
      <div className="art-label">
        <span className="art-label-dot" />
        <span>GROWTH HAS NO BORDERS</span>
        <MoveUpRight size={20} />
      </div>
      <div className="art-coordinate">30.3753° N &nbsp; 69.3451° E</div>
    </div>
  );
}

function Partners() {
  return (
    <section className="partners container" aria-label="Our partnerships">
      <p>
        BIG PARTNERS.
        <br />
        <strong>BIGGER POSSIBILITIES.</strong>
      </p>
      <div className="partner-name partner-alibaba">
        <div>
          Alibaba.com<small>CHANNEL PARTNER</small>
        </div>
      </div>
      <span className="partner-name partner-odoo">Odoo</span>
      <span className="partner-name partner-blooming">Blooming</span>
      <span className="partner-name partner-payoneer">Payoneer</span>
    </section>
  );
}

function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <h1>
            Sell more.
            <br />
            Run smarter.
            <br />
            <span className="orange">Grow stronger.</span>
          </h1>
          <p className="hero-description">
            We help manufacturers, suppliers and business owners find buyers,
            enter new markets, sell globally and run better.
          </p>
          <Button href="#what-we-do">Explore what we do</Button>
          <div className="hero-proof">
            <span>
              <b>5,000+</b> businesses
            </span>
            <i />
            <span>
              <b>10+</b> years
            </span>
            <i />
            <span>
              <b>4</b> offices
            </span>
          </div>
        </div>
        <GrowthArtwork />
      </section>
      <Partners />
      <section id="what-we-do" className="services-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>
                One partner.
                <br />
                More ways to grow.
              </h2>
            </div>
            <p>
              From your first overseas buyer to a business that runs better. We
              help you take the next step.
            </p>
          </div>
          <div className="services-grid">
            <a href="/alibaba" className="service service-export">
              <div className="service-top">
                <ArrowUpRight />
              </div>
              <div className="service-art export-art">
                <Globe2 size={98} strokeWidth={0.65} />
                <span className="export-line" />
                <span className="destination destination-one">PAKISTAN</span>
                <span className="destination destination-two">THE WORLD</span>
              </div>
              <div className="service-bottom">
                <h3>
                  Your products.
                  <br />A world of buyers.
                </h3>
                <p>
                  Reach international buyers with Alibaba.com and a partner who
                  knows the way.
                </p>
                <span className="service-link">
                  Explore Alibaba.com <ArrowUpRight size={18} />
                </span>
              </div>
            </a>
            <a href="#contact" className="service service-operations">
              <div className="service-top">
                <ArrowUpRight />
              </div>
              <div className="service-art operations-art">
                <div className="operations-stack">
                  <span>
                    <Layers3 size={18} /> Your business
                  </span>
                  <span>
                    <Check size={15} /> Sales & inventory
                  </span>
                  <span>
                    <Check size={15} /> Team & operations
                  </span>
                  <span>
                    <Check size={15} /> One clearer picture
                  </span>
                </div>
              </div>
              <div className="service-bottom">
                <h3>
                  Less juggling.
                  <br />
                  More control.
                </h3>
                <p>
                  Bring sales, stock and your team together. Make everyday
                  business work better with Odoo.
                </p>
                <span className="service-link">
                  Let’s simplify things <ArrowUpRight size={18} />
                </span>
              </div>
            </a>
            <a href="#contact" className="service service-growth">
              <div className="service-top">
                <ArrowUpRight />
              </div>
              <div className="service-art growth-service-art">
                <div className="growth-bars">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <img src="/brand/arrow.svg" alt="" />
              </div>
              <div className="service-bottom">
                <h3>
                  More opportunity.
                  <br />
                  Fewer borders.
                </h3>
                <p>
                  Build your presence with Blooming and get paid globally with
                  Payoneer.
                </p>
                <span className="service-link">
                  Find your next move <ArrowUpRight size={18} />
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section id="how-we-work" className="process-section container">
        <div className="process-intro">
          <h2>
            We make
            <br />
            growth
            <br />
            <span className="orange">happen.</span>
          </h2>
          <p>
            As your growth and export partner, we help you find the right
            markets, reach buyers, sell globally, and manage your business.
          </p>
          <a className="text-link" href="#contact">
            Let’s find your next move <ArrowUpRight size={19} />
          </a>
        </div>
        <div className="steps">
          {steps.map(([title, description], i) => (
            <div className="step" key={title}>
              <span className="step-number">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <ArrowUpRight className="step-arrow" size={22} />
            </div>
          ))}
        </div>
      </section>
      <section id="our-impact" className="impact-section">
        <div className="container">
          <div className="impact-head"></div>
          <h2>
            10+ years opening doors.
            <br />
            <span>And we’re just getting started.</span>
          </h2>
          <div className="impact-grid">
            <div>
              <strong>
                5,000<span>+</span>
              </strong>
              <p>Businesses on their growth journey</p>
            </div>
            <div>
              <strong>
                100<span>s</span>
              </strong>
              <p>Successful storefronts</p>
            </div>
            <div>
              <strong>
                4<span>+</span>
              </strong>
              <p>Global partnerships</p>
            </div>
            <div>
              <strong>4</strong>
              <p>Offices across Pakistan</p>
            </div>
          </div>
          <div className="impact-bottom">
            <ChartNoAxesCombined size={21} />
            <p>Millions in client revenue enabled. More possibilities ahead.</p>
            <a href="#contact">
              Be part of what’s next <ArrowUpRight size={19} />
            </a>
          </div>
        </div>
      </section>
      <section className="world-section container">
        <div className="world-visual">
          <svg viewBox="0 0 520 390" fill="none" aria-hidden="true">
            <g stroke="#b8b9ab" strokeWidth="1">
              <ellipse cx="260" cy="205" rx="190" ry="155" />
              <ellipse cx="260" cy="205" rx="112" ry="155" />
              <ellipse cx="260" cy="205" rx="40" ry="155" />
              <ellipse cx="260" cy="205" rx="190" ry="60" />
              <ellipse cx="260" cy="205" rx="190" ry="112" />
              <path d="M70 205h380M260 50v310" />
            </g>
            <path
              d="M280 213Q365 90 443 116M280 213Q168 80 90 109M280 213Q183 305 111 281"
              stroke="#ff7300"
              strokeWidth="2"
              strokeDasharray="5 6"
            />
            <g fill="#ff7300">
              <circle cx="280" cy="213" r="7" />
              <circle cx="443" cy="116" r="4" />
              <circle cx="90" cy="109" r="4" />
              <circle cx="111" cy="281" r="4" />
            </g>
          </svg>
          <span className="world-caption">FROM PAKISTAN, WITH AMBITION.</span>
          <span className="world-product product-textile">Textiles</span>
          <span className="world-product product-sport">Sporting goods</span>
          <span className="world-product product-craft">Craftsmanship</span>
        </div>
        <div className="world-copy">
          <h2>
            Made in Pakistan.
            <br />
            <span className="orange">Sold worldwide.</span>
          </h2>
          <p>
            Your growth partner for taking Pakistani products to global markets.
          </p>
          <p className="world-emphasis">Your product could be next.</p>
          <Button href="/alibaba">Start selling globally</Button>
        </div>
      </section>
    </>
  );
}

function Alibaba() {
  const [compare, setCompare] = useState(false);
  const [ready, setReady] = useState([false, false, false]);
  return (
    <>
      <section className="hero alibaba-hero container">
        <div className="hero-copy">
          <h1>
            Your next
            <br />
            big order.
            <br />
            <span className="orange">From anywhere.</span>
          </h1>
          <p className="hero-description">
            Alibaba.com connects manufacturers and suppliers with buyers around
            the world. You make the product. Alibaba.com helps you find the
            buyer.
          </p>
          <Button href="#how-alibaba-works">See how it works</Button>
          <p className="official-partner">
            <Check size={15} /> Official Alibaba.com channel partner
          </p>
        </div>
        <GrowthArtwork alibaba />
      </section>
      <section id="how-alibaba-works" className="alibaba-how">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>
                Stop waiting for buyers
                <br />
                to find you.
              </h2>
            </div>
            <p>
              Take your products beyond your local market and put them in front
              of buyers from other countries.
            </p>
          </div>
          <div className="how-cards">
            {[
              [
                Package,
                "Make your product",
                "Bring what you do best. Manufacturing, quality and the products you’re proud of.",
              ],
              [
                Globe2,
                "Meet the world",
                "Put your products on Alibaba.com, where international buyers look for suppliers.",
              ],
              [
                ArrowUpRight,
                "Build your next chapter",
                "Connect with buyers and turn the right conversations into new opportunities.",
              ],
            ].map(([Icon, title, text], i) => (
              <div key={title}>
                <span className="how-number">0{i + 1}</span>
                <Icon size={36} strokeWidth={1.3} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="readiness-section container">
        <div>
          <h2>
            Big ambition.
            <br />
            The right next step?
          </h2>
          <p>
            You don’t need to have it all figured out.
            <br />
            Let’s start with three simple questions.
          </p>
        </div>
        <div className="readiness-checks">
          {[
            "Do you make your own products?",
            "Can you handle orders?",
            "Want buyers from other countries?",
          ].map((text, i) => (
            <button
              key={text}
              aria-pressed={ready[i]}
              onClick={() => setReady(ready.map((v, j) => (i === j ? !v : v)))}
            >
              <span className={`checkbox ${ready[i] ? "checked" : ""}`}>
                {ready[i] && <Check size={16} />}
              </span>
              <span>{text}</span>
              <span className="check-answer">
                {ready[i] ? "Yes" : "Select"}
              </span>
            </button>
          ))}
          <p className="readiness-result" aria-live="polite">
            {ready.every(Boolean)
              ? "You may be ready. Let’s talk about your business."
              : "Sounds like you? You may be ready to go global."}
          </p>
          <a href="#contact" className="text-link">
            See if you’re ready <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <section className="partner-support">
        <div className="container partner-support-inner">
          <div>
            <h2>
              Getting on Alibaba.com
              <br />
              is the easy part.
            </h2>
            <p>
              We help you set up your account, build your storefront, list your
              products, train your team and keep things running.
            </p>
            <Button href="#contact" className="orange-button">
              Talk to Trademor
            </Button>
          </div>
          <div className="support-list">
            {[
              "Account setup",
              "Your storefront",
              "Product listings",
              "Team training",
              "Ongoing support",
            ].map((item, i) => (
              <div key={item}>
                <span>0{i + 1}</span>
                <h3>{item}</h3>
                <Check size={21} />
              </div>
            ))}
            <p>OFFICIAL ALIBABA.COM CHANNEL PARTNER</p>
          </div>
        </div>
      </section>
      <section id="plans" className="plans-section container">
        <div className="section-heading">
          <div>
            <h2>
              A bigger world.
              <br />A plan that fits.
            </h2>
          </div>
          <p>
            Whether you’re starting your export journey or building a stronger
            global presence, find your next step.
          </p>
        </div>
        <div className="plans-grid">
          {plans.map((plan) => (
            <article
              className={`plan ${plan.name === "Basic Plus" ? "featured-plan" : ""}`}
              key={plan.name}
            >
              <h3>{plan.name}</h3>
              <p className="price">
                <span>$</span>
                {plan.price}
                <small>USD</small>
              </p>
              <p className="plan-description">{plan.text}</p>
              <Button
                href={`#contact`}
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("select-plan", { detail: plan.name }),
                  )
                }
              >
                Talk about this plan
              </Button>
            </article>
          ))}
        </div>
        <button
          className="compare-button"
          aria-expanded={compare}
          onClick={() => setCompare(!compare)}
        >
          Compare plans {compare ? <Minus size={18} /> : <Plus size={18} />}
        </button>
        {compare && (
          <div className="comparison">
            <table>
              <caption>Plans at a glance</caption>
              <thead>
                <tr>
                  <th scope="col">Plan</th>
                  <th scope="col">Listed price (USD)</th>
                  <th scope="col">Designed for</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.name}>
                    <th scope="row">{p.name}</th>
                    <td>${p.price}</td>
                    <td>{p.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Ask us for current inclusions, subscription terms and any
              applicable taxes. We’ll help you compare the details before you
              decide.
            </p>
          </div>
        )}
      </section>
      <section className="alibaba-final container">
        <h2>
          Not sure if you’re ready?
          <br />
          <span className="orange">Let’s talk about your business.</span>
        </h2>
        <Button href="#contact">Get a free export consultation</Button>
      </section>
    </>
  );
}

function Contact() {
  const [step, setStep] = useState(0);
  const panelRef = useRef(null);
  const firstRender = useRef(true);
  const [goal, setGoal] = useState("");
  const [stage, setStage] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    name: "",
    business: "",
    phone: "",
    email: "",
  });
  const [reference, setReference] = useState("");
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const heading = panelRef.current?.querySelector("h3");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }, [step, status === "success"]);
  useEffect(() => {
    const handler = (e) => {
      setPlan(e.detail);
      setGoal("Sell more");
      setStep(1);
      setStatus("idle");
    };
    window.addEventListener("select-plan", handler);
    return () => window.removeEventListener("select-plan", handler);
  }, []);
  async function submit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const result = await submitEnquiry(
        {
          ...values,
          goal,
          stage,
          plan,
          website: e.currentTarget.elements.website.value,
        },
        { provider: import.meta.env.VITE_ENQUIRY_PROVIDER },
      );
      setReference(result.reference);
      setStatus("success");
    } catch (e) {
      setStatus("idle");
      setError(
        e.message === "Failed to fetch"
          ? "We couldn’t connect. Please check your connection and try again."
          : e.message,
      );
    }
  }
  return (
    <section id="contact" className="contact-section">
      <div className="container contact-inner">
        <div className="contact-copy">
          <h2>
            Ready to
            <br />
            trade <span>more?</span>
          </h2>
          <p>
            Tell us where you want to go.
            <br />
            We’ll help you find the way.
          </p>
          <img src="/brand/arrow.svg" className="contact-arrow" alt="" />
          <span className="contact-tagline">Your Partner in Growth™</span>
        </div>
        <div className="contact-panel" ref={panelRef}>
          {status === "success" ? (
            <div className="form-success" role="status">
              <span className="success-icon">
                <Check size={32} />
              </span>
              <h3>
                Your next chapter
                <br />
                starts here.
              </h3>
              <p>
                Thanks, {values.name.split(" ")[0]}. Your enquiry has been
                received.
              </p>
              <p className="request-reference">Reference: {reference}</p>
              <button
                className="text-link"
                onClick={() => {
                  setStatus("idle");
                  setStep(0);
                  setGoal("");
                  setStage("");
                  setPlan("");
                  setValues({ name: "", business: "", phone: "", email: "" });
                }}
              >
                Send another enquiry <ArrowUpRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="form-topline">
                <span>0{step + 1} / 03</span>
              </div>
              <div className="form-progress">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={i <= step ? "complete" : ""} />
                ))}
              </div>
              {step === 0 && (
                <div className="form-step" key="goal">
                  <h3>
                    What do you want
                    <br />
                    to do more of?
                  </h3>
                  <p>Pick what matters most to your business.</p>
                  <div className="goal-options">
                    {goals.map((item, i) => (
                      <button
                        className={goal === item ? "selected" : ""}
                        key={item}
                        aria-pressed={goal === item}
                        onClick={() => setGoal(item)}
                      >
                        <span className="option-number">0{i + 1}</span>
                        {item}
                        <span className="option-check">
                          {goal === item ? (
                            <Check size={16} />
                          ) : (
                            <ArrowUpRight size={16} />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                  <Button
                    className="form-next"
                    disabled={!goal}
                    onClick={() => setStep(1)}
                  >
                    Next step
                  </Button>
                </div>
              )}
              {step === 1 && (
                <div className="form-step" key="stage">
                  <h3>
                    Where are
                    <br />
                    you today?
                  </h3>
                  <p>Every great business starts somewhere.</p>
                  {plan && <p className="chosen-plan">Interested in: {plan}</p>}
                  <div className="goal-options">
                    {stages.map((item, i) => (
                      <button
                        key={item}
                        className={stage === item ? "selected" : ""}
                        aria-pressed={stage === item}
                        onClick={() => setStage(item)}
                      >
                        <span className="option-number">0{i + 1}</span>
                        {item}
                        <span className="option-check">
                          {stage === item ? (
                            <Check size={16} />
                          ) : (
                            <ArrowUpRight size={16} />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="form-actions">
                    <button className="back-button" onClick={() => setStep(0)}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <Button disabled={!stage} onClick={() => setStep(2)}>
                      Next step
                    </Button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <form className="form-step" key="details" onSubmit={submit}>
                  <h3>
                    Tell us about
                    <br />
                    your business.
                  </h3>
                  <p>
                    A few details. A world of possibilities. All fields are
                    required.
                  </p>
                  <div className="form-fields">
                    {[
                      ["name", "Your name", "text", "name"],
                      ["business", "Business name", "text", "organization"],
                      ["phone", "Contact number", "tel", "tel"],
                      ["email", "Email address", "email", "email"],
                    ].map(([key, label, type, auto]) => (
                      <label key={key}>
                        {label}
                        <input
                          name={key}
                          type={type}
                          autoComplete={auto}
                          required
                          maxLength={key === "email" ? 254 : 160}
                          value={values[key]}
                          onChange={(e) =>
                            setValues({ ...values, [key]: e.target.value })
                          }
                          placeholder={
                            key === "phone"
                              ? "+92"
                              : key === "email"
                                ? "you@business.com"
                                : label
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <label className="honeypot" aria-hidden="true">
                    Leave blank
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                  <p className="form-privacy">
                    We’ll use these details to respond to your enquiry.
                  </p>
                  {error && (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="form-actions">
                    <button
                      className="back-button"
                      type="button"
                      disabled={status === "submitting"}
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <Button type="submit" disabled={status === "submitting"}>
                      {status === "submitting" ? (
                        <>
                          <LoaderCircle className="spinner" size={16} />{" "}
                          Sending…
                        </>
                      ) : (
                        "Let’s find your next move"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <a href="/" aria-label="Trademor home">
            <img
              src="/brand/logo-white-orange.svg"
              alt="Trademor"
              width="170"
              height="90"
            />
          </a>
          <p>
            Local ambition.
            <br />
            Global possibilities.
          </p>
          <div className="footer-links">
            <a href="/#what-we-do">What we do</a>
            <a href="/alibaba">
              Alibaba.com <ArrowUpRight size={14} />
            </a>
            <a href="/#our-impact">Our impact</a>
            <a href="#contact">
              Let’s talk <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Trademor. All rights reserved.
          </span>
          <span>
            MADE FOR WHAT’S NEXT. <ArrowUpRight size={15} />
          </span>
          <a href="#top">
            Back to top <MoveUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const alibaba = window.location.pathname.replace(/\/$/, "") === "/alibaba";
  useEffect(() => {
    document.title = alibaba
      ? "Alibaba.com × Trademor — Start Selling Globally"
      : "Trademor — Your Partner in Growth";
  }, [alibaba]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Header alibaba={alibaba} />
      <main id="main">
        {alibaba ? <Alibaba /> : <Home />}
        <Contact />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
