const FareHistory = require('../models/FareHistory');

const DEFAULTS = {
  baseFare: 150,
  perKmRate: 25,
  emergencyMultipliers: {
    Low: 1.0,
    Medium: 1.3,
    Critical: 1.7,
  },
};

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function calculateFare({ bookingId, distanceKm, emergencyLevel, overrides = {}, userId }) {
  const baseFare = overrides.baseFare ?? DEFAULTS.baseFare;
  const perKmRate = overrides.perKmRate ?? DEFAULTS.perKmRate;
  const emergencyMultiplier = overrides.emergencyMultiplier ?? DEFAULTS.emergencyMultipliers[emergencyLevel] ?? 1;

  const variableComponent = perKmRate * (distanceKm || 0);
  const estimatedFare = roundCurrency((baseFare + variableComponent) * emergencyMultiplier);

  // Record history
  const history = await FareHistory.create({
    bookingId,
    calculatedBy: userId,
    context: {
      distanceKm,
      emergencyLevel,
      baseFare,
      perKmRate,
      emergencyMultiplier,
    },
    estimatedFare,
  });

  return { estimatedFare, breakdown: { baseFare, perKmRate, emergencyMultiplier }, historyId: history._id };
}

module.exports = {
  calculateFare,
  DEFAULTS,
};
