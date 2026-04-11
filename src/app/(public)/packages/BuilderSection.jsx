'use client';

import { useEffect, useMemo, useState } from "react";
import "./BuilderSection.css";
import AddToQuoteButton from "@/components/common/AddToQuoteButton";
import { fetchBuilderOptions } from "@/lib/boemApi";
import { builderOptions as fallbackBuilderOptions } from "@/data/pricingBuilder";

const defaultCategoryState = {
  web: false,
  app: false,
  ai: false,
};

const defaultSelectionState = {
  webBase: "",
  appBase: "",
  aiBase: "",
  webExtras: [],
  appExtras: [],
  aiExtras: [],
  priority: "speed",
};

function findOption(options = [], value) {
  return options.find((option) => option.value === value) || null;
}

export default function BuilderSection({ onDashboardNavigate }) {
  const [builderOptions, setBuilderOptions] = useState(fallbackBuilderOptions);
  const [builderCategories, setBuilderCategories] = useState(defaultCategoryState);
  const [builderSelections, setBuilderSelections] = useState(defaultSelectionState);
  const [notification, setNotification] = useState({ visible: false, message: "" });
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBuilderOptions = async () => {
      try {
        const groupedOptions = await fetchBuilderOptions();
        if (!isMounted) {
          return;
        }

        setBuilderOptions(groupedOptions);
        setDataError("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setBuilderOptions(fallbackBuilderOptions);
        setDataError("Live builder options could not be loaded, so local pricing logic is being used.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBuilderOptions();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setBuilderSelections((previousSelections) => ({
      ...previousSelections,
      priority: builderOptions.priority?.[0]?.value || previousSelections.priority,
    }));
  }, [builderOptions.priority]);

  const handleBuilderCategoryToggle = (category) => {
    setBuilderCategories((previousCategories) => {
      const isActive = !previousCategories[category];

      if (!isActive) {
        setBuilderSelections((previousSelections) => ({
          ...previousSelections,
          [`${category}Base`]: "",
          [`${category}Extras`]: [],
        }));
      }

      return {
        ...previousCategories,
        [category]: isActive,
      };
    });
  };

  const handleBuilderBaseSelect = (category, value) => {
    setBuilderSelections((previousSelections) => ({
      ...previousSelections,
      [`${category}Base`]: value,
    }));
  };

  const handleBuilderExtraToggle = (category, value) => {
    setBuilderSelections((previousSelections) => {
      const extrasKey = `${category}Extras`;
      const currentExtras = previousSelections[extrasKey];

      if (currentExtras.includes(value)) {
        return {
          ...previousSelections,
          [extrasKey]: currentExtras.filter((item) => item !== value),
        };
      }

      return {
        ...previousSelections,
        [extrasKey]: [...currentExtras, value],
      };
    });
  };

  const handlePrioritySelect = (value) => {
    setBuilderSelections((previousSelections) => ({
      ...previousSelections,
      priority: value,
    }));
  };

  const builderSummary = useMemo(() => {
    const breakdown = [];
    let subtotal = 0;

    ["web", "app", "ai"].forEach((category) => {
      if (!builderCategories[category]) {
        return;
      }

      const base = findOption(
        builderOptions[category]?.base,
        builderSelections[`${category}Base`],
      );

      if (base) {
        subtotal += Number(base.price || 0);
        breakdown.push({
          label: `${category.toUpperCase()} base: ${base.label}`,
          price: Number(base.price || 0),
        });
      }

      builderSelections[`${category}Extras`].forEach((extraValue) => {
        const extra = findOption(builderOptions[category]?.extras, extraValue);
        if (!extra) {
          return;
        }

        subtotal += Number(extra.price || 0);
        breakdown.push({
          label: `${category.toUpperCase()} extra: ${extra.label}`,
          price: Number(extra.price || 0),
        });
      });
    });

    const priority = findOption(builderOptions.priority, builderSelections.priority);
    const multiplier = Number(priority?.multiplier || 1);
    const total = Math.round(subtotal * multiplier * 100) / 100;
    const selectedTypes = Object.entries(builderCategories)
      .filter(([, selected]) => selected)
      .map(([category]) => category);

    const selectionId = [
      ...selectedTypes,
      builderSelections.webBase,
      builderSelections.appBase,
      builderSelections.aiBase,
      ...builderSelections.webExtras,
      ...builderSelections.appExtras,
      ...builderSelections.aiExtras,
      builderSelections.priority,
    ]
      .filter(Boolean)
      .join("-");

    return {
      subtotal,
      multiplier,
      total,
      breakdown,
      selectedTypes,
      priority,
      item: {
        id: selectionId ? `custom-package-${selectionId}` : "custom-package-empty",
        title: "Custom Package Request",
        description: `Custom DevMasters package covering ${selectedTypes.join(", ") || "multiple services"}.`,
        price: total,
        priority: priority?.label || builderSelections.priority,
        types: selectedTypes,
        breakdown,
        deliveryTime: "Custom schedule",
      },
    };
  }, [builderCategories, builderOptions, builderSelections]);

  const canAddToQuote = builderSummary.breakdown.length > 0;

  const handlePackageAdded = () => {
    setNotification({
      visible: true,
      message: "Your custom package has been added to your quote request.",
    });

    window.setTimeout(() => {
      setNotification({ visible: false, message: "" });
    }, 5000);
  };

  return (
    <section className="builder-section">
      {notification.visible && (
        <div className="builder-notification builder-notification--visible">
          <span>{notification.message}</span>
          <br />
          <span>
            Continue to your <a href="/Checkout">quote checkout</a> whenever you&apos;re ready.
          </span>
        </div>
      )}

      <header className="builder-header">
        <div>
          <h2>Build your own package</h2>
          <p>
            Choose exactly what you need across websites, apps and AI automation.
            See your estimated cost update in real time before you request the package.
          </p>
          {dataError && <p className="builder-hint">{dataError}</p>}
        </div>
        <div className="builder-badge">Live estimate calculator</div>
      </header>

      <div className="builder-card">
        <div className="builder-column builder-options">
          <h3>1. What do you need?</h3>
          <h4>One-time payment for development</h4>
          <p className="builder-hint">
            Pick one or more categories and then customize the options below.
          </p>

          <div className="builder-category-group">
            {Object.entries(builderCategories).map(([category, isChecked]) => (
              <label key={category} className={`builder-category ${isChecked ? "active" : ""}`}>
                <input
                  type="checkbox"
                  className="builder-cat-input"
                  checked={isChecked}
                  onChange={() => handleBuilderCategoryToggle(category)}
                />
                <span>
                  <i
                    className={`fas fa-${
                      category === "web" ? "globe" : category === "app" ? "mobile-alt" : "robot"
                    }`}
                  ></i>
                  {category === "web"
                    ? " Website / Landing page"
                    : category === "app"
                      ? " Web or mobile app"
                      : " AI automation & workflows"}
                </span>
              </label>
            ))}
          </div>

          {["web", "app", "ai"].map((category) => (
            <div
              key={category}
              className={`builder-options-group ${builderCategories[category] ? "visible" : ""}`}
              data-group={category}
            >
              <h4>
                {category === "web"
                  ? "Website options"
                  : category === "app"
                    ? "Web & mobile app options"
                    : "AI automation options"}
              </h4>
              <p className="builder-hint">
                {category === "web"
                  ? "Choose how advanced your website should be."
                  : category === "app"
                    ? "Choose how complex your app should be."
                    : "Decide how much you want to automate with AI."}
              </p>

              <div className="builder-options-grid">
                {(builderOptions[category]?.base || []).map((option) => (
                  <label
                    key={option.value}
                    className={`builder-option-pill ${
                      builderSelections[`${category}Base`] === option.value ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${category}Base`}
                      value={option.value}
                      checked={builderSelections[`${category}Base`] === option.value}
                      onChange={() => handleBuilderBaseSelect(category, option.value)}
                    />
                    <span>{option.label}</span>
                    <span className="builder-option-price">
                      {Number(option.price || 0) === 0 ? "Included" : `+ $${option.price}`}
                    </span>
                  </label>
                ))}
              </div>

              <h5>Extras</h5>
              <div className="builder-options-grid">
                {(builderOptions[category]?.extras || []).map((extra) => (
                  <label
                    key={extra.value}
                    className={`builder-option-pill ${
                      builderSelections[`${category}Extras`].includes(extra.value) ? "active" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="builder-extra-input"
                      checked={builderSelections[`${category}Extras`].includes(extra.value)}
                      onChange={() => handleBuilderExtraToggle(category, extra.value)}
                    />
                    <span>{extra.label}</span>
                    <span className="builder-option-price">+ ${extra.price}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <h3>2. What&apos;s your priority?</h3>
          <div className="builder-options-grid">
            {(builderOptions.priority || []).map((option) => (
              <label
                key={option.value}
                className={`builder-option-pill ${
                  builderSelections.priority === option.value ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="builderPriority"
                  value={option.value}
                  checked={builderSelections.priority === option.value}
                  onChange={() => handlePrioritySelect(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="builder-column builder-summary">
          <h3>3. Your package summary</h3>
          <p className="builder-hint">
            This is an estimated one-time setup price. Final pricing is confirmed after we review your request.
          </p>

          <div className="builder-total-box">
            <div className="builder-total-label">Estimated total</div>
            <div className="builder-total-value">
              <span className="builder-total-currency">$</span>
              <span className="builder-total-number">{builderSummary.total.toLocaleString()}</span>
            </div>
            <div className="builder-total-note">
              Priority multiplier: x{builderSummary.multiplier.toFixed(2)}
            </div>
          </div>

          <div className="builder-breakdown">
            <h4>Breakdown</h4>
            <ul className="builder-breakdown-list">
              {builderSummary.breakdown.length === 0 ? (
                <li>
                  <span>No paid options selected yet.</span>
                  <span>$0</span>
                </li>
              ) : (
                builderSummary.breakdown.map((item, index) => (
                  <li key={index}>
                    <span>{item.label}</span>
                    <span>${item.price}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {canAddToQuote ? (
            <AddToQuoteButton
              item={builderSummary.item}
              source="builderPackage"
              className="wc-btn-ghost wc-btn-customize"
              onAdded={handlePackageAdded}
            />
          ) : (
            <button type="button" className="wc-btn-ghost wc-btn-customize" disabled>
              Select options to add this package
            </button>
          )}

          <p className="builder-footnote">
            When you add this package, it goes straight into your  quote cart for checkout.
          </p>

          {onDashboardNavigate && (
            <button type="button" className="wc-btn-ghost wc-btn-customize" onClick={onDashboardNavigate}>
              Go to Quote Checkout
            </button>
          )}

          {loading && <p className="builder-hint">Loading live builder options...</p>}
        </div>
      </div>
    </section>
  );
}
