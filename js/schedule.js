/**
 * Week grid schedule editor - Figma design implementation
 */

const DEFAULT_START_HOUR = 7;
const DEFAULT_END_HOUR = 17; // 5 PM
const HOUR_HEIGHT = 25; // Height of each hour row in px
const MAX_WEEKS_FUTURE = 4; // Maximum weeks into the future

export function createScheduleEditor(container, sessions = [], onChange, options = {}) {
  // Ensure all sessions have recurring property
  let currentSessions = sessions.map(s => ({ ...s, recurring: s.recurring ?? false }));
  let isDragging = false;
  let dragStart = null;
  let dragCurrent = null;
  let weekOffset = 0; // 0 = current week

  // Options for locked sessions (ongoing blocks)
  const { lockedSessionId = null } = options;

  // Calendar preferences (defaults)
  let preferences = {
    show24Hours: false,
    firstDayOfWeek: 1, // 0=Sun, 1=Mon, etc.
  };

  // Get effective hour range based on preferences
  function getHourRange() {
    if (preferences.show24Hours) {
      return { start: 0, end: 23 };
    }
    return { start: DEFAULT_START_HOUR, end: DEFAULT_END_HOUR };
  }

  // Get the dates for the current week view
  function getWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday
    const firstDay = preferences.firstDayOfWeek;

    // Calculate days to subtract to get to the first day of week
    let daysToSubtract = currentDay - firstDay;
    if (daysToSubtract < 0) daysToSubtract += 7;

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - daysToSubtract + (weekOffset * 7));

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  // Format hour for display
  function formatHour(hour) {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  }

  // Format time range for session display (e.g., "9:00–11:30")
  function formatTimeRange(startHour, startMinute, endHour, endMinute) {
    const formatPart = (h, m) => `${h}:${m.toString().padStart(2, '0')}`;
    return `${formatPart(startHour, startMinute)}–${formatPart(endHour, endMinute)}`;
  }

  // Format day header (e.g., "Mon 12")
  function formatDayNumber(date) {
    return date.getDate();
  }

  // Get short day name
  function getDayName(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }

  // Get short month name
  function getMonthName(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
  }

  // Convert date's day of week to our 0-6 index (Mon=0, Sun=6)
  function getDayIndex(date) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1; // Convert Sun=0 to Sun=6, Mon=1 to Mon=0
  }

  // Calculate position for a time within the grid
  function getTimePosition(hour, minute = 0) {
    const { start } = getHourRange();
    const hourOffset = hour - start;
    const minuteOffset = minute / 60;
    return (hourOffset + minuteOffset) * HOUR_HEIGHT;
  }

  // Get current time position (for "now" line)
  function getNowPosition() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const { start, end } = getHourRange();

    if (hour < start || hour > end) return null;
    return getTimePosition(hour, minute);
  }

  // Check if today is in current week view
  function isTodayInView() {
    const weekDates = getWeekDates();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return weekDates.some(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });
  }

  // Get today's column index (0-6) if in view
  function getTodayColumnIndex() {
    const weekDates = getWeekDates();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < weekDates.length; i++) {
      const date = new Date(weekDates[i]);
      date.setHours(0, 0, 0, 0);
      if (date.getTime() === today.getTime()) {
        return i;
      }
    }
    return -1;
  }

  function render() {
    container.innerHTML = "";
    container.className = "schedule-editor";

    const weekDates = getWeekDates();

    // Create the card container
    const card = document.createElement("div");
    card.className = "schedule-card";

    // Info bar at top
    const infoBar = document.createElement("div");
    infoBar.className = "schedule-info-bar";

    // Left side: next session text
    const infoLeft = document.createElement("div");
    infoLeft.className = "schedule-info-left";

    const nextSessionText = document.createElement("span");
    nextSessionText.className = "schedule-next-session";
    nextSessionText.id = "schedule-next-session-text";
    nextSessionText.textContent = currentSessions.length > 0 ? "Next session begins..." : "No sessions scheduled";

    infoLeft.appendChild(nextSessionText);

    // Right side: navigation arrows
    const infoRight = document.createElement("div");
    infoRight.className = "schedule-info-right";

    const prevBtn = document.createElement("button");
    prevBtn.className = "schedule-nav-btn";
    prevBtn.innerHTML = "‹";
    prevBtn.setAttribute("aria-label", "Previous week");
    // Disable if at current week (can't go to past)
    if (weekOffset <= 0) {
      prevBtn.disabled = true;
      prevBtn.classList.add("schedule-nav-btn-disabled");
    }
    prevBtn.addEventListener("click", () => {
      if (weekOffset > 0) {
        weekOffset--;
        render();
      }
    });

    const nextBtn = document.createElement("button");
    nextBtn.className = "schedule-nav-btn";
    nextBtn.innerHTML = "›";
    nextBtn.setAttribute("aria-label", "Next week");
    // Disable if at max future weeks
    if (weekOffset >= MAX_WEEKS_FUTURE) {
      nextBtn.disabled = true;
      nextBtn.classList.add("schedule-nav-btn-disabled");
    }
    nextBtn.addEventListener("click", () => {
      if (weekOffset < MAX_WEEKS_FUTURE) {
        weekOffset++;
        render();
      }
    });

    infoRight.appendChild(prevBtn);
    infoRight.appendChild(nextBtn);

    infoBar.appendChild(infoLeft);
    infoBar.appendChild(infoRight);
    card.appendChild(infoBar);

    // Create grid container
    const gridContainer = document.createElement("div");
    gridContainer.className = "schedule-grid-container";

    // Time labels column
    const timeColumn = document.createElement("div");
    timeColumn.className = "schedule-time-column";

    // Empty cell for header alignment
    const timeHeader = document.createElement("div");
    timeHeader.className = "schedule-time-header";
    timeColumn.appendChild(timeHeader);

    // Time labels
    const { start: startHour, end: endHour } = getHourRange();
    for (let hour = startHour; hour <= endHour; hour++) {
      const timeLabel = document.createElement("div");
      timeLabel.className = "schedule-time-label";
      timeLabel.textContent = formatHour(hour);
      timeColumn.appendChild(timeLabel);
    }
    gridContainer.appendChild(timeColumn);

    // Day columns
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const date = weekDates[dayIdx];
      const dayColumn = document.createElement("div");
      dayColumn.className = "schedule-day-column";

      // Day header with "Mon 12 Jan" format
      const dayHeader = document.createElement("div");
      dayHeader.className = "schedule-day-header";

      const dayText = document.createElement("span");
      dayText.textContent = `${getDayName(date)} ${formatDayNumber(date)} `;

      const monthText = document.createElement("span");
      monthText.className = "schedule-month";
      monthText.textContent = getMonthName(date);

      dayHeader.appendChild(dayText);
      dayHeader.appendChild(monthText);
      dayColumn.appendChild(dayHeader);

      // Grid cells container (for relative positioning of blocks)
      const cellsContainer = document.createElement("div");
      cellsContainer.className = "schedule-cells-container";
      cellsContainer.dataset.day = dayIdx;

      // Hour cells
      for (let hour = startHour; hour <= endHour; hour++) {
        const cell = document.createElement("div");
        cell.className = "schedule-cell";
        cell.dataset.day = dayIdx;
        cell.dataset.hour = hour;
        cellsContainer.appendChild(cell);
      }

      // Add session blocks as overlays
      // Use the actual date's day of week (0=Sun, 1=Mon, etc.)
      const standardDay = date.getDay();
      const daySessions = currentSessions.filter(s => s.day === standardDay);

      daySessions.forEach(session => {
        // Only show if session overlaps with visible hours
        if (session.endHour <= startHour || session.startHour > endHour) return;

        const blockTop = getTimePosition(
          Math.max(session.startHour, startHour),
          session.startHour >= startHour ? session.startMinute : 0
        );
        const blockBottom = getTimePosition(
          Math.min(session.endHour, endHour + 1),
          session.endHour <= endHour ? session.endMinute : 0
        );
        const blockHeight = blockBottom - blockTop;

        if (blockHeight <= 0) return;

        const block = document.createElement("div");
        block.className = "schedule-block";
        if (session.recurring) {
          block.classList.add("schedule-block-recurring");
        }
        if (session.id === lockedSessionId) {
          block.classList.add("schedule-block-locked");
        }
        block.dataset.sessionId = session.id;
        block.style.top = `${blockTop}px`;
        block.style.height = `${blockHeight}px`;

        // Block content
        const blockContent = document.createElement("div");
        blockContent.className = "schedule-block-content";

        const blockHeader = document.createElement("div");
        blockHeader.className = "schedule-block-header";

        const blockTitle = document.createElement("span");
        blockTitle.className = "schedule-block-title";
        blockTitle.textContent = session.title || "Blocked";

        blockHeader.appendChild(blockTitle);

        // Recurring icon
        if (session.recurring) {
          const repeatIcon = document.createElement("span");
          repeatIcon.className = "schedule-block-repeat";
          repeatIcon.textContent = "↻";
          blockHeader.appendChild(repeatIcon);
        }

        const blockTime = document.createElement("span");
        blockTime.className = "schedule-block-time";
        blockTime.textContent = formatTimeRange(
          session.startHour, session.startMinute,
          session.endHour, session.endMinute
        );

        blockContent.appendChild(blockHeader);
        blockContent.appendChild(blockTime);
        block.appendChild(blockContent);

        // Click to toggle recurring
        block.addEventListener("click", (e) => {
          e.stopPropagation();
          if (session.id === lockedSessionId) return;
          session.recurring = !session.recurring;
          onChange(currentSessions);
          render();
        });

        // Right-click to delete
        block.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (session.id === lockedSessionId) return;
          currentSessions = currentSessions.filter(s => s.id !== session.id);
          onChange(currentSessions);
          render();
        });

        cellsContainer.appendChild(block);
      });

      // Add "now" line if this is today's column
      const todayIdx = getTodayColumnIndex();
      if (dayIdx === todayIdx && isTodayInView()) {
        const nowPos = getNowPosition();
        if (nowPos !== null) {
          const nowLine = document.createElement("div");
          nowLine.className = "schedule-now-line";
          nowLine.style.top = `${nowPos}px`;
          cellsContainer.appendChild(nowLine);
        }
      }

      dayColumn.appendChild(cellsContainer);
      gridContainer.appendChild(dayColumn);
    }

    card.appendChild(gridContainer);
    container.appendChild(card);

    // Add event listeners to grid container
    gridContainer.addEventListener("mousedown", handleMouseDown);
    gridContainer.addEventListener("mousemove", handleMouseMove);
    gridContainer.addEventListener("mouseup", handleMouseUp);
    gridContainer.addEventListener("mouseleave", handleMouseUp);

    // Touch support
    gridContainer.addEventListener("touchstart", handleTouchStart, { passive: false });
    gridContainer.addEventListener("touchmove", handleTouchMove, { passive: false });
    gridContainer.addEventListener("touchend", handleTouchEnd);
  }

  function getCellFromEvent(e) {
    const cell = e.target.closest(".schedule-cell");
    if (!cell) return null;
    return {
      day: parseInt(cell.dataset.day),
      hour: parseInt(cell.dataset.hour),
    };
  }

  function handleMouseDown(e) {
    if (e.button !== 0) return; // Left click only

    // Ignore clicks on blocks (handled by block click handlers)
    if (e.target.closest(".schedule-block")) return;

    const cell = getCellFromEvent(e);
    if (!cell) return;

    isDragging = true;
    dragStart = cell;
    dragCurrent = cell;

    // Add dragging visual
    updateDragVisual();
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;

    // Only allow single column drag
    if (cell.day !== dragStart.day) return;

    dragCurrent = cell;
    updateDragVisual();
  }

  function updateDragVisual() {
    // Remove existing drag visual
    document.querySelectorAll(".schedule-cell-dragging").forEach(el => {
      el.classList.remove("schedule-cell-dragging");
    });

    if (!isDragging || !dragStart || !dragCurrent) return;

    const minHour = Math.min(dragStart.hour, dragCurrent.hour);
    const maxHour = Math.max(dragStart.hour, dragCurrent.hour);

    document.querySelectorAll(`.schedule-cell[data-day="${dragStart.day}"]`).forEach(cell => {
      const hour = parseInt(cell.dataset.hour);
      if (hour >= minHour && hour <= maxHour) {
        cell.classList.add("schedule-cell-dragging");
      }
    });
  }

  function handleMouseUp(e) {
    if (!isDragging) return;

    // Remove drag visual
    document.querySelectorAll(".schedule-cell-dragging").forEach(el => {
      el.classList.remove("schedule-cell-dragging");
    });

    if (dragStart && dragCurrent && dragStart.day === dragCurrent.day) {
      const minHour = Math.min(dragStart.hour, dragCurrent.hour);
      const maxHour = Math.max(dragStart.hour, dragCurrent.hour);

      // Get the standard day from the actual date
      const weekDates = getWeekDates();
      const standardDay = weekDates[dragStart.day].getDay();

      // Check for overlaps
      const overlaps = currentSessions.some(
        (s) =>
          s.day === standardDay &&
          !(maxHour < s.startHour || minHour >= s.endHour)
      );

      if (!overlaps && maxHour >= minHour) {
        const newSession = {
          id: crypto.randomUUID(),
          day: standardDay,
          startHour: minHour,
          startMinute: 0,
          endHour: maxHour + 1,
          endMinute: 0,
          recurring: false,
          title: "Blocked",
        };

        currentSessions.push(newSession);
        onChange(currentSessions);
        render();
      }
    }

    isDragging = false;
    dragStart = null;
    dragCurrent = null;
  }

  // Touch handlers
  let longPressTimer = null;
  let touchedBlock = null;

  function handleTouchStart(e) {
    const block = e.target.closest(".schedule-block");
    if (block) {
      e.preventDefault();
      touchedBlock = block;
      const sessionId = block.dataset.sessionId;

      if (sessionId === lockedSessionId) return;

      // Long press to delete
      longPressTimer = setTimeout(() => {
        currentSessions = currentSessions.filter(s => s.id !== sessionId);
        onChange(currentSessions);
        render();
        touchedBlock = null;
      }, 500);
      return;
    }

    e.preventDefault();
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!cell?.classList.contains("schedule-cell")) return;

    const cellData = {
      day: parseInt(cell.dataset.day),
      hour: parseInt(cell.dataset.hour),
    };

    isDragging = true;
    dragStart = cellData;
    dragCurrent = cellData;
    updateDragVisual();
  }

  function handleTouchMove(e) {
    // Cancel long press if moving
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    e.preventDefault();
    if (!isDragging) return;

    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!cell?.classList.contains("schedule-cell")) return;

    const cellData = {
      day: parseInt(cell.dataset.day),
      hour: parseInt(cell.dataset.hour),
    };

    if (cellData.day !== dragStart.day) return;

    dragCurrent = cellData;
    updateDragVisual();
  }

  function handleTouchEnd(e) {
    // Handle short tap on block to toggle recurring
    if (touchedBlock && longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;

      const sessionId = touchedBlock.dataset.sessionId;
      if (sessionId && sessionId !== lockedSessionId) {
        const session = currentSessions.find(s => s.id === sessionId);
        if (session) {
          session.recurring = !session.recurring;
          onChange(currentSessions);
          render();
        }
      }
      touchedBlock = null;
      return;
    }

    touchedBlock = null;
    handleMouseUp(e);
  }

  // Public methods
  function setSessions(sessions) {
    currentSessions = sessions.map(s => ({ ...s, recurring: s.recurring ?? false }));
    render();
  }

  function getSessions() {
    return [...currentSessions];
  }

  function setNextSessionText(text) {
    const el = document.getElementById("schedule-next-session-text");
    if (el) el.textContent = text;
  }

  function setPreferences(newPrefs) {
    preferences = { ...preferences, ...newPrefs };
    render();
  }

  // Initial render
  render();

  return { setSessions, getSessions, render, setNextSessionText, setPreferences };
}

// CSS for the schedule editor (injected once)
if (!document.getElementById("schedule-editor-styles")) {
  const style = document.createElement("style");
  style.id = "schedule-editor-styles";
  style.textContent = `
    .schedule-editor {
      width: 100%;
    }

    .schedule-card {
      background: #f6f6f6;
      border-radius: 5px;
      padding: 20px 15px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    @media (prefers-color-scheme: dark) {
      .schedule-card {
        background: var(--slate-dark, #2a2a2a);
      }
    }

    .schedule-info-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .schedule-info-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .schedule-info-right {
      display: flex;
      align-items: center;
      gap: 15px;
      padding-right: 5px;
    }

    .schedule-next-session {
      font-size: 14px;
      color: var(--text-color, #000);
    }

    .schedule-nav-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: 16px;
      color: var(--text-color, #000);
      line-height: 1;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .schedule-nav-btn:hover:not(:disabled) {
      opacity: 0.7;
    }

    .schedule-nav-btn-disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .schedule-grid-container {
      display: flex;
      width: 100%;
      user-select: none;
    }

    .schedule-time-column {
      display: flex;
      flex-direction: column;
      width: 46px;
      flex-shrink: 0;
      margin-left: -10px;
    }

    .schedule-time-header {
      height: 17px;
    }

    .schedule-time-label {
      height: ${HOUR_HEIGHT}px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
      font-size: 10px;
      color: var(--text-color, #000);
    }

    .schedule-day-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .schedule-day-header {
      height: 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--text-color, #000);
      white-space: nowrap;
    }

    .schedule-month {
      color: #868686;
    }

    .schedule-cells-container {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .schedule-cell {
      height: ${HOUR_HEIGHT}px;
      border: 0.2px solid #424242;
      cursor: pointer;
      transition: background-color 0.1s;
    }

    .schedule-cell:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    @media (prefers-color-scheme: dark) {
      .schedule-cell {
        border-color: #555;
      }
      .schedule-cell:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }

    .schedule-cell-dragging {
      background: rgba(153, 255, 115, 0.3) !important;
    }

    /* Session blocks */
    .schedule-block {
      position: absolute;
      left: 0;
      right: 0;
      background: #fff;
      border: 0.2px solid #000;
      border-radius: 5px;
      padding: 4px;
      cursor: pointer;
      overflow: hidden;
      z-index: 10;
    }

    .schedule-block:hover {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .schedule-block-recurring {
      background: linear-gradient(
        90deg,
        rgba(153, 255, 115, 0.15) 0%,
        rgba(153, 255, 115, 0.15) 100%
      ), #fff;
    }

    .schedule-block-locked {
      background: rgba(239, 68, 68, 0.15);
      border-color: #ef4444;
      cursor: not-allowed;
    }

    @media (prefers-color-scheme: dark) {
      .schedule-block {
        background: var(--slate-dark, #2a2a2a);
        border-color: #555;
      }
      .schedule-block-recurring {
        background: linear-gradient(
          90deg,
          rgba(153, 255, 115, 0.2) 0%,
          rgba(153, 255, 115, 0.2) 100%
        ), var(--slate-dark, #2a2a2a);
      }
    }

    .schedule-block-content {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .schedule-block-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .schedule-block-title {
      font-size: 10px;
      color: var(--text-color, #000);
      font-weight: 400;
    }

    .schedule-block-repeat {
      font-size: 8px;
      color: var(--text-color, #000);
      opacity: 0.7;
    }

    .schedule-block-time {
      font-size: 6px;
      color: #565656;
    }

    /* Now line */
    .schedule-now-line {
      position: absolute;
      left: 0;
      right: 0;
      height: 0;
      border-top: 1px solid #ef4444;
      z-index: 5;
      pointer-events: none;
    }

    .schedule-now-line::before {
      content: '';
      position: absolute;
      left: -4px;
      top: -4px;
      width: 7px;
      height: 7px;
      background: #ef4444;
      border-radius: 50%;
    }
  `;
  document.head.appendChild(style);
}
