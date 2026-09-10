const db = require('../db/connection');

// Atomically issues the next per-organization ticket number,
// e.g. TKT-001, TKT-002...
function nextTicketId(organizationId) {
    const tx = db.transaction((orgId) => {
        let row = db
            .prepare(
                'SELECT next_number FROM ticket_counters WHERE organization_id = ?'
            )
            .get(orgId);

        if (!row) {
            db.prepare(
                'INSERT INTO ticket_counters (organization_id, next_number) VALUES (?, ?)'
            ).run(orgId, 1);

            row = { next_number: 1 };
        }

        const num = row.next_number;

        db.prepare(
            'UPDATE ticket_counters SET next_number = ? WHERE organization_id = ?'
        ).run(num + 1, orgId);

        return `TKT-${String(num).padStart(3, '0')}`;
    });

    return tx(organizationId);
}

module.exports = { nextTicketId };