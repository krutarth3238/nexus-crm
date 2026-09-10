const db = require('../db/connection');

const dateLabel = (d) =>
  d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  });

async function stats(req, res) {
  const orgId = req.user.organizationId;

  const days = Math.min(
    90,
    Math.max(1, parseInt(req.query.days, 10) || 14)
  );

  const totals = db
    .prepare(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as openCount,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgressCount,
        SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closedCount
       FROM tickets
       WHERE organization_id = ?`
    )
    .get(orgId);

  const closedRows = db
    .prepare(
      `SELECT created_at, updated_at
       FROM tickets
       WHERE organization_id = ?
       AND status = 'Closed'`
    )
    .all(orgId);

  let avgResolutionHours = 0;

  if (closedRows.length) {
    const totalHours = closedRows.reduce((sum, r) => {
      const hours =
        (new Date(r.updated_at) -
          new Date(r.created_at)) /
        (1000 * 60 * 60);

      return sum + Math.max(0, hours);
    }, 0);

    avgResolutionHours =
      Math.round(
        (totalHours / closedRows.length) * 10
      ) / 10;
  }

  const dailyTrend = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(today);

    day.setDate(day.getDate() - i);

    const dayStart = new Date(
      day.setHours(0, 0, 0, 0)
    );

    const dayEnd = new Date(
      new Date(day).setHours(23, 59, 59, 999)
    );

    const opened = db
      .prepare(
        `SELECT COUNT(*) as c
         FROM tickets
         WHERE organization_id = ?
         AND created_at BETWEEN ? AND ?`
      )
      .get(
        orgId,
        dayStart.toISOString(),
        dayEnd.toISOString()
      );

    const closed = db
      .prepare(
        `SELECT COUNT(*) as c
         FROM tickets
         WHERE organization_id = ?
         AND status = 'Closed'
         AND updated_at BETWEEN ? AND ?`
      )
      .get(
        orgId,
        dayStart.toISOString(),
        dayEnd.toISOString()
      );

    dailyTrend.push({
      date: dateLabel(dayStart),
      count: opened.c,
      closed: closed.c,
    });
  }

  res.status(200).json({
    total: totals.total || 0,
    openCount: totals.openCount || 0,
    inProgressCount: totals.inProgressCount || 0,
    closedCount: totals.closedCount || 0,
    avgResolutionHours,
    dailyTrend,
  });
}

module.exports = {
  stats,
};
