import globalEventListener from "./globalEvenListener.js";

const DEFAULT_SPACING = 5;

const POSITION_ORDER = [
  "top",
  "bottom",
  "left",
  "right",
  "topLeft",
  "bottomLeft",
  "topRight",
  "bottomRight",
];
const POSITION_TO_FUNCTION_MAP = {
  top: positionTooltipTop,
  bottom: positionTooltipBottom,
  right: positionTooltipRight,
  left: positionTooltipLeft,
  topLeft: positionTooltipTopLeft,
  bottomLeft: positionTooltipBottomLeft,
  topRight: positionTooltipTopRight,
  bottomRight: positionTooltipBottomLRight,
};

const spacingSelector = document.querySelector("[data-spacing]");
const spacingValue =
  parseInt(spacingSelector.dataset.spacing) || DEFAULT_SPACING;

const tooltipContainer = document.createElement("div");
tooltipContainer.classList.add("tooltip-container");
document.body.append(tooltipContainer);

globalEventListener("mouseover", "[data-tooltip]", (e) => {
  const toolTip = createTooltipElement(e.target.dataset.tooltip);
  tooltipContainer.append(toolTip);
  positionTooltip(toolTip, e.target);

  e.target.addEventListener(
    "mouseleave",
    () => {
      toolTip.remove();
    },
    { once: true }
  );
});

function createTooltipElement(text) {
  const toolTip = document.createElement("div");
  toolTip.classList.add("tooltip");
  toolTip.innerText = text;
  return toolTip;
}

function positionTooltip(tooltip, element) {
  const elementRect = element.getBoundingClientRect();

  const preferedPosition = (element.dataset.position || "").split("|");
  const position = preferedPosition.concat(POSITION_ORDER);

  for (let i = 0; i < position.length; i++) {
    let func = POSITION_TO_FUNCTION_MAP[position[i]];
    if (func && func(tooltip, elementRect)) return;
  }
}

function positionTooltipTop(tooltip, elementRect) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${
    elementRect.top - tooltipRect.height - spacingValue
  }px`;
  tooltip.style.left = `${
    elementRect.left + elementRect.width / 2 - tooltipRect.width / 2
  }px`;

  const bounds = isOutBounds(tooltip, spacingValue);

  tooltip.classList.add("bottomMiddle");

  if (bounds.top) {
    resetTooltipPosition(tooltip);
    removeArrows(tooltip);
    return false;
  }

  if (bounds.right) {
    tooltip.style.right = `${spacingValue}px`;
    tooltip.style.left = "initial";
    tooltip.classList.add("bottomRight");
  }

  if (bounds.left) {
    tooltip.style.left = `${spacingValue}px`;
    tooltip.classList.add("bottomLeft");
  }

  return true;
}

function positionTooltipBottom(tooltip, elementRect) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${elementRect.bottom + spacingValue}px`;
  tooltip.style.left = `${
    elementRect.left + elementRect.width / 2 - tooltipRect.width / 2
  }px`;

  const bounds = isOutBounds(tooltip, spacingValue);

  tooltip.classList.add("topMiddle");

  if (bounds.bottom) {
    resetTooltipPosition(tooltip);
    removeArrows(tooltip);
    return false;
  }

  if (bounds.right) {
    tooltip.style.right = `${spacingValue}px`;
    tooltip.style.left = "initial";
    tooltip.classList.add("topRight");
  }

  if (bounds.left) {
    tooltip.style.left = `${spacingValue}px`;
    tooltip.classList.add("topLeft");
  }
  return true;
}

function positionTooltipRight(tooltip, elementRect) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${
    elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
  }px`;
  tooltip.style.left = `${elementRect.right + spacingValue}px`;

  const bounds = isOutBounds(tooltip, spacingValue);

  tooltip.classList.add("sideRight");

  if (bounds.right) {
    resetTooltipPosition(tooltip);
    removeArrows(tooltip);
    return false;
  }

  if (bounds.bottom) {
    tooltip.style.bottom = `${spacingValue}px`;
    tooltip.style.top = "initial";
  }

  if (bounds.top) {
    tooltip.style.top = `${spacingValue}px`;
  }
  return true;
}

function positionTooltipLeft(tooltip, elementRect) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${
    elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
  }px`;
  tooltip.style.left = `${
    elementRect.left - tooltipRect.width - spacingValue
  }px`;

  const bounds = isOutBounds(tooltip, spacingValue);

  tooltip.classList.add("sideLeft");

  if (bounds.left) {
    resetTooltipPosition(tooltip);
    removeArrows(tooltip);
    return false;
  }

  if (bounds.bottom) {
    tooltip.style.bottom = `${spacingValue}px`;
    tooltip.style.top = "initial";
  }

  if (bounds.top) {
    tooltip.style.top = `${spacingValue}px`;
  }
  return true;
}

function positionTooltipTopLeft(tooltip, elementRect) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${
    elementRect.top -
    elementRect.height / 2 -
    tooltipRect.height / 2 -
    spacingValue
  }px`;
  tooltip.style.left = `${
    elementRect.left - tooltipRect.width - spacingValue
  }px`;

  const bounds = isOutBounds(tooltip, spacingValue);

  tooltip.classList.add("topLeftCorner");

  if (bounds.left) {
    resetTooltipPosition(tooltip);
    removeArrows(tooltip);
    return false;
  }

  if (bounds.bottom) {
    tooltip.style.bottom = `${spacingValue}px`;
    tooltip.style.top = "initial";
  }

  if (bounds.top) {
    tooltip.style.top = `${
      elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
    }px`;
    tooltip.classList.remove("topLeftCorner");
    tooltip.classList.add("sideLeft");
  }
  return true;
}

function positionTooltipBottomLeft(tooltip, elementRect) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${
    elementRect.top -
    elementRect.height / 2 +
    tooltipRect.height / 2 +
    spacingValue
  }px`;
  tooltip.style.left = `${
    elementRect.left - tooltipRect.width - spacingValue
  }px`;

  const bounds = isOutBounds(tooltip, spacingValue);

  tooltip.classList.add("bottomLeftCorner");

  if (bounds.left) {
    resetTooltipPosition(tooltip);
    removeArrows(tooltip);
    return false;
  }

  if (bounds.bottom) {
    tooltip.style.top = `${
      elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
    }px`;
    tooltip.classList.remove("bottomLeftCorner");
    tooltip.classList.add("sideLeft");
  }

  if (bounds.top) {
    tooltip.style.top = `${spacingValue}px`;
  }
  return true;
}

function positionTooltipTopRight(tooltip, elementRect) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${
    elementRect.top -
    elementRect.height / 2 -
    tooltipRect.height / 2 -
    spacingValue
  }px`;
  tooltip.style.left = `${elementRect.right + spacingValue}px`;

  const bounds = isOutBounds(tooltip, spacingValue);

  tooltip.classList.add("topRightCorner");

  if (bounds.right) {
    resetTooltipPosition(tooltip);
    removeArrows(tooltip);
    return false;
  }

  if (bounds.bottom) {
    tooltip.style.bottom = `${spacingValue}px`;
    tooltip.style.top = "initial";
  }

  if (bounds.top) {
    tooltip.style.top = `${
      elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
    }px`;
    tooltip.classList.remove("topRightCorner");
    tooltip.classList.add("sideRight");
  }
  return true;
}

function positionTooltipBottomLRight(tooltip, elementRect) {
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.top = `${
    elementRect.top +
    elementRect.height / 2 +
    tooltipRect.height / 2 +
    spacingValue
  }px`;
  tooltip.style.left = `${elementRect.right + spacingValue}px`;

  const bounds = isOutBounds(tooltip, spacingValue);

  tooltip.classList.add("bottomRightCorner");

  if (bounds.right) {
    resetTooltipPosition(tooltip);
    removeArrows(tooltip);
    return false;
  }

  if (bounds.bottom) {
    tooltip.style.top = `${
      elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
    }px`;
    tooltip.classList.remove("bottomRightCorner");
    tooltip.classList.add("sideRight");
  }

  if (bounds.top) {
    tooltip.style.top = `${spacingValue}px`;
  }
  return true;
}

function isOutBounds(element, spacing) {
  const rect = element.getBoundingClientRect();
  const containerRect = tooltipContainer.getBoundingClientRect();

  return {
    top: rect.top <= containerRect.top + spacing,
    bottom: rect.bottom >= containerRect.bottom - spacing,
    left: rect.left <= containerRect.left + spacing,
    right: rect.right >= containerRect.right - spacing,
  };
}

function resetTooltipPosition(tooltip) {
  tooltip.style.top = "initial";
  tooltip.style.bottom = "initial";
  tooltip.style.right = "initial";
  tooltip.style.left = "initial";
}

function removeArrows(tooltip) {
  tooltip.classList.remove("bottomMiddle");
  tooltip.classList.remove("bottomLeft");
  tooltip.classList.remove("bottomRight");
  tooltip.classList.remove("topMiddle");
  tooltip.classList.remove("topLeft");
  tooltip.classList.remove("topRight");
  tooltip.classList.remove("sideRight");
  tooltip.classList.remove("sideLeft");
  tooltip.classList.remove("topLeftCorner");
  tooltip.classList.remove("bottomLeftCorner");
  tooltip.classList.remove("topRightCorner");
  tooltip.classList.remove("bottomRightCorner");
}
