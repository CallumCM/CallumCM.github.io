document.addEventListener('DOMContentLoaded', () => {
  const tooltips = document.querySelectorAll('.tooltip');
  
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', () => {
      const after = window.getComputedStyle(tooltip, '::after');
      const rect = tooltip.getBoundingClientRect();
      
      const tooltipWidth = tooltip.offsetWidth;
      const afterWidth = Math.min(window.innerWidth * 0.33, 500);
      
      const idealLeft = rect.left + (tooltipWidth / 2) - (afterWidth / 2);
      const minLeft = 18;
      const maxLeft = window.innerWidth - afterWidth - 18;
      
      const clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));
      const offset = clampedLeft - idealLeft;
      
      tooltip.style.setProperty('--tooltip-offset', `${offset}px`);
    });
  });
});
