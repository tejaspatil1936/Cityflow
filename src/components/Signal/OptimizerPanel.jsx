import { useState } from 'react';
import { getColor } from '../../utils/congestion';

export default function OptimizerPanel({ recommendations, onRun, running }) {
    return (
        <div className="panel">
            <div className="panel-header">
                <h3 className="panel-title">Signal Optimizer</h3>
                <button
                    className={`btn btn-primary${running ? ' btn-loading' : ''}`}
                    onClick={onRun}
                    disabled={running}
                >
                    {running ? 'Running...' : 'Run Optimizer'}
                </button>
            </div>

            {recommendations.length === 0 && !running && (
                <p className="panel-empty">Click "Run Optimizer" to get signal timing recommendations.</p>
            )}

            {running && (
                <div className="panel-loading">
                    <div className="spinner" />
                    <span>Analysing junctions...</span>
                </div>
            )}

            {!running && recommendations.length > 0 && (
                <div className="recommendation-list">
                    {recommendations.map(r => (
                        <div key={r.id} className="recommendation-card">
                            <div className="rec-name">{r.name}</div>
                            <div className="rec-timing">
                                <span className="rec-old">{r.old_green}s</span>
                                <span className="rec-arrow"> → </span>
                                <span className="rec-new">{r.new_green}s</span>
                                <span className="rec-tag">green</span>
                            </div>
                            <div className="rec-route">{r.alternate}</div>
                            <div className="rec-projected">
                                Projected: {r.projected_score}% congestion
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
