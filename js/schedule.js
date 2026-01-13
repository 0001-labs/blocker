/**
 * Week grid schedule editor
 */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const START_HOUR = 6;
const END_HOUR = 23;

export function createScheduleEditor(container, sessions = [], onChange) {
  // Ensure all sessions have recurring property
  let currentSessions = sessions.map(s => ({ ...s, recurring: s.recurring ?? false }));
  let isDragging = false;
  let dragStart = null;
  let dragCurrent = null;

  function render() {
    container.innerHTML = "";
    container.className = "schedule-editor";

    // Create grid
    const grid = document.createElement("div");
    grid.className = "schedule-grid";

    // Header row (days)
    const headerRow = document.createElement("div");
    headerRow.className = "schedule-header";
    headerRow.innerHTML = '<div class="schedule-time-label"></div>';
    for (const day of DAYS) {
      headerRow.innerHTML += `<div class="schedule-day-label">${day}</div>`;
    }
    grid.appendChild(headerRow);

    // Hour rows
    for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
      const row = document.createElement("div");
      row.className = "schedule-row";

      // Time label
      const timeLabel = document.createElement("div");
      timeLabel.className = "schedule-time-label";
      timeLabel.textContent =
        hour === 0
          ? "12am"
          : hour < 12
            ? `${hour}am`
            : hour === 12
              ? "12pm"
              : `${hour - 12}pm`;
      row.appendChild(timeLabel);

      // Day cells
      for (let day = 0; day < 7; day++) {
        const cell = document.createElement("div");
        cell.className = "schedule-cell";
        cell.dataset.day = day;
        cell.dataset.hour = hour;

        // Check if this cell is in a session
        const session = currentSessions.find(
          (s) =>
            s.day === day &&
            hour >= s.startHour &&
            (hour < s.endHour || (hour === s.endHour && s.endMinute > 0))
        );

        if (session) {
          cell.classList.add("schedule-cell-active");
          if (session.recurring) {
            cell.classList.add("schedule-cell-recurring");
          }
          cell.dataset.sessionId = session.id;
        }

        // Check if this cell is in the current drag selection
        if (isDragging && dragStart && dragCurrent) {
          const minDay = Math.min(dragStart.day, dragCurrent.day);
          const maxDay = Math.max(dragStart.day, dragCurrent.day);
          const minHour = Math.min(dragStart.hour, dragCurrent.hour);
          const maxHour = Math.max(dragStart.hour, dragCurrent.hour);

          if (day >= minDay && day <= maxDay && hour >= minHour && hour <= maxHour) {
            cell.classList.add("schedule-cell-dragging");
          }
        }

        row.appendChild(cell);
      }

      grid.appendChild(row);
    }

    container.appendChild(grid);

    // Add event listeners
    grid.addEventListener("mousedown", handleMouseDown);
    grid.addEventListener("mousemove", handleMouseMove);
    grid.addEventListener("mouseup", handleMouseUp);
    grid.addEventListener("mouseleave", handleMouseUp);
    grid.addEventListener("contextmenu", handleContextMenu);

    // Touch support
    grid.addEventListener("touchstart", handleTouchStart, { passive: false });
    grid.addEventListener("touchmove", handleTouchMove, { passive: false });
    grid.addEventListener("touchend", handleTouchEnd);
  }

  function getCellFromEvent(e) {
    const cell = e.target.closest(".schedule-cell");
    if (!cell) return null;
    return {
      day: parseInt(cell.dataset.day),
      hour: parseInt(cell.dataset.hour),
      sessionId: cell.dataset.sessionId,
    };
  }

  function handleMouseDown(e) {
    if (e.button !== 0) return; // Left click only
    const cell = getCellFromEvent(e);
    if (!cell) return;

    // If clicking on an existing session, toggle recurring
    if (cell.sessionId) {
      const session = currentSessions.find(s => s.id === cell.sessionId);
      if (session) {
        session.recurring = !session.recurring;
        onChange(currentSessions);
        render();
      }
      return;
    }

    isDragging = true;
    dragStart = cell;
    dragCurrent = cell;
    render();
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;

    // Only allow single column drag
    if (cell.day !== dragStart.day) return;

    dragCurrent = cell;
    render();
  }

  function handleMouseUp(e) {
    if (!isDragging) return;

    if (dragStart && dragCurrent && dragStart.day === dragCurrent.day) {
      const minHour = Math.min(dragStart.hour, dragCurrent.hour);
      const maxHour = Math.max(dragStart.hour, dragCurrent.hour);

      // Check for overlaps
      const overlaps = currentSessions.some(
        (s) =>
          s.day === dragStart.day &&
          !(maxHour < s.startHour || minHour >= s.endHour)
      );

      if (!overlaps && maxHour >= minHour) {
        const newSession = {
          id: crypto.randomUUID(),
          day: dragStart.day,
          startHour: minHour,
          startMinute: 0,
          endHour: maxHour + 1,
          endMinute: 0,
          recurring: false,
        };

        currentSessions.push(newSession);
        onChange(currentSessions);
      }
    }

    isDragging = false;
    dragStart = null;
    dragCurrent = null;
    render();
  }

  function handleContextMenu(e) {
    e.preventDefault();
    const cell = getCellFromEvent(e);
    if (!cell || !cell.sessionId) return;

    // Delete session
    currentSessions = currentSessions.filter((s) => s.id !== cell.sessionId);
    onChange(currentSessions);
    render();
  }

  // Touch handlers
  function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!cell?.classList.contains("schedule-cell")) return;

    const cellData = {
      day: parseInt(cell.dataset.day),
      hour: parseInt(cell.dataset.hour),
      sessionId: cell.dataset.sessionId,
    };

    if (cellData.sessionId) {
      // Short tap to toggle recurring, long press to delete
      cell.dataset.tapStart = Date.now();
      cell.dataset.longPressTimer = setTimeout(() => {
        currentSessions = currentSessions.filter(
          (s) => s.id !== cellData.sessionId
        );
        onChange(currentSessions);
        render();
      }, 500);
      return;
    }

    isDragging = true;
    dragStart = cellData;
    dragCurrent = cellData;
    render();
  }

  function handleTouchMove(e) {
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
    render();
  }

  function handleTouchEnd(e) {
    // Clear any long press timer and check for short tap to toggle recurring
    document.querySelectorAll("[data-long-press-timer]").forEach((el) => {
      clearTimeout(el.dataset.longPressTimer);

      // If tap was short (< 500ms), toggle recurring
      const tapStart = parseInt(el.dataset.tapStart);
      const tapDuration = Date.now() - tapStart;
      if (tapDuration < 500 && el.dataset.sessionId) {
        const session = currentSessions.find(s => s.id === el.dataset.sessionId);
        if (session) {
          session.recurring = !session.recurring;
          onChange(currentSessions);
          render();
        }
      }
    });

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

  // Initial render
  render();

  return { setSessions, getSessions, render };
}

// CSS for the schedule editor (injected once)
if (!document.getElementById("schedule-editor-styles")) {
  const style = document.createElement("style");
  style.id = "schedule-editor-styles";
  style.textContent = `
    .schedule-editor {
      width: 100%;
      overflow-x: auto;
    }

    .schedule-grid {
      display: flex;
      flex-direction: column;
      min-width: 320px;
      user-select: none;
    }

    .schedule-header,
    .schedule-row {
      display: grid;
      grid-template-columns: 48px repeat(7, 1fr);
      gap: 2px;
    }

    .schedule-header {
      margin-bottom: 4px;
    }

    .schedule-day-label {
      text-align: center;
      font-size: calc(12px * var(--sf, 1));
      color: var(--text-color-dimmed);
      padding: var(--025) 0;
    }

    .schedule-time-label {
      font-size: calc(10px * var(--sf, 1));
      color: var(--text-color-dimmed);
      text-align: right;
      padding-right: var(--025);
      line-height: 24px;
    }

    .schedule-cell {
      height: 24px;
      background: var(--slate-light);
      border-radius: 2px;
      cursor: pointer;
      transition: background-color 0.1s;
    }

    @media (prefers-color-scheme: dark) {
      .schedule-cell {
        background: var(--slate-dark);
      }
    }

    .schedule-cell:hover {
      background: var(--light-grey);
    }

    @media (prefers-color-scheme: dark) {
      .schedule-cell:hover {
        background: var(--slate);
      }
    }

    .schedule-cell-active {
      background: repeating-linear-gradient(
        45deg,
        var(--accent-color),
        var(--accent-color) 4px,
        transparent 4px,
        transparent 8px
      ) !important;
      cursor: pointer;
    }

    .schedule-cell-active.schedule-cell-recurring {
      background: var(--accent-color) !important;
    }

    .schedule-cell-dragging {
      background: var(--accent-color) !important;
      opacity: 0.6;
    }

    .schedule-cell-active::after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
    }
  `;
  document.head.appendChild(style);
}
