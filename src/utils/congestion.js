export function getSeverity(score) {
    if (score > 70) return 'high';
    if (score > 40) return 'moderate';
    return 'low';
}

export function getColor(score) {
    if (score > 70) return '#EF4444';
    if (score > 40) return '#F59E0B';
    return '#22C55E';
}

export function getLabel(score) {
    if (score > 70) return 'High';
    if (score > 40) return 'Moderate';
    return 'Low';
}

export function runOptimizer(junctions) {
    return junctions
        .filter(j => j.congestion_score > 65)
        .map(j => ({
            id: j.id,
            name: j.name,
            old_green: j.signal_green_current,
            new_green: j.recommended_green || j.signal_green_current + 15,
            alternate: j.alternate_route,
            projected_score: Math.max(0, j.congestion_score - 18)
        }));
}
