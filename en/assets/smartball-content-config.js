/*
 * Smart Golf Ball page copy-management entry point.
 * A future admin page can update these values without editing image assets.
 */
window.SMARTBALL_CONTENT_STORAGE_KEY = 'ginovo-smartball-content-en';
window.SMARTBALL_CONTENT_SCHEMA_KEY = 'ginovo-smartball-content-schema-en';
window.SMARTBALL_CONTENT_SCHEMA_VERSION = '20260912-en-v9';
window.SMARTBALL_CONTENT_DEFAULTS = {
  anatomyTitle: 'A Simulator Built Inside\nA Smart Golf Ball',
  anatomySubtitle: 'A Smart Golf Ball Engineered to Feel and Perform Like a Standard Golf Ball',
  anatomyLayerTitle: 'Layer',
  anatomyLayerDescription: 'Ionomer shock-absorbing structure\nfor enhanced durability',
  anatomyElastomerTitle: 'Elastomer',
  anatomyElastomerDescription: 'Optimized rebound and precision\ncontrol of core eccentricity.',
  anatomyShellTitle: 'Protective Shell',
  anatomyShellDescription: '',
  anatomyCoverTitle: 'Outer Cover',
  anatomyCoverDescription: 'Dimples minimize drag while maintaining\nthe official 42.67 mm ball diameter.',
  specTitle: '100% Achievement of Physical Specification Targets',
  specWeight: 'Weight: 45.93g',
  specSize: 'Diameter: 42.67mm',
  specRebound: 'Rebound: 72.1',
  specEccentricity: 'Eccentricity: 0.1mm',
  systemTitle: 'GINOVO Putting System',
  systemSubtitle: 'A Complete Smart-Golf System\nBuilt for Focused Putting Practice',
  systemDescription: 'Includes a Smart Golf Ball, wireless charger,\nputting mat, reflector and mobile stand.',
  chargerTitle: 'Smart Wireless Charging System',
  chargerSubtitle: 'A portable wireless charger you can use anywhere',
  chargerDeviceLabel: 'Wireless Charger',
  chargerBallLabel: 'Smart Golf Ball (1 ball)',
  chargerNote1: 'On-chip thermal management controls heat inside the capsule',
  chargerNote2: 'Three-color LED indicator provides clear charging status',
  distanceTitle: 'Repeatable, Quantitative Putting Practice by Target Distance and Green Speed',
  distancePoint1: 'Complete Putting Practice Without Distance Limits',
  distancePoint2: 'Build a measurable stroke through repetition toward your target distance',
  slopeTitle: 'Flexible Slope-Based Putting Practice Through Green Analysis',
  slopePoint1: 'Design your own slopes and build a measurable stroke through repetition',
  fieldTitle: 'Practice Distance and Slope Effects Freely on the Green',
  fieldSubtitle: 'Analyze slope effects and receive green-speed feedback in real green conditions',
  fieldKickerLine1: 'From Flexible Practice',
  fieldKickerAccent: 'to Precise On-Green Analysis',
  fieldSummary: 'Recreate the feel of a real green anytime, anywhere.',
  fieldFeature1Title: 'Putting Practice Without Location Limits',
  fieldFeature1Description: 'Practice freely on real greens, at training facilities or on a home putting mat.',
  fieldFeature2Title: 'Slope-Effect Analysis & Green-Speed Feedback',
  fieldFeature2Description: 'Precisely analyze how slope changes the ball trajectory and receive distance feedback calibrated to green speed.',
  fieldBadge1Title: 'ANYWHERE',
  fieldBadge1Description: 'Supports Field Greens & Multiple Mat Types',
  fieldBadge2Title: 'REAL - TIME',
  fieldBadge2Description: 'Real-Time Slope and Speed Data',
  battleTitle: 'Competitive Practice Through Online & Offline Match Modes',
  battleSubtitle: 'Use one GINOVO Smart Golf Ball for putting matches with family and friends or online opponents.',
  ctaEyebrow: 'Beyond Tech, Into Culture: The New Standard Powered by Data',
  ctaTitle: 'Beyond the Limits of Technology, We Build a New Golf Culture with Data.'
};
try {
  var savedSmartballContent = JSON.parse(localStorage.getItem(window.SMARTBALL_CONTENT_STORAGE_KEY) || '{}');
  if (localStorage.getItem(window.SMARTBALL_CONTENT_SCHEMA_KEY) !== window.SMARTBALL_CONTENT_SCHEMA_VERSION) {
    savedSmartballContent = {};
    localStorage.setItem(window.SMARTBALL_CONTENT_STORAGE_KEY, '{}');
    localStorage.setItem(window.SMARTBALL_CONTENT_SCHEMA_KEY, window.SMARTBALL_CONTENT_SCHEMA_VERSION);
  }
  var smartballContentMigrated = false;
  if (savedSmartballContent.anatomyTitle === 'A Smart Golf Ball Engineered to Feel and Perform Like a Standard Golf Ball') {
    savedSmartballContent.anatomyTitle = window.SMARTBALL_CONTENT_DEFAULTS.anatomyTitle;
    savedSmartballContent.anatomySubtitle = window.SMARTBALL_CONTENT_DEFAULTS.anatomySubtitle;
    smartballContentMigrated = true;
  }
  if (savedSmartballContent.specEccentricity === 'Eccentricity: 0.095%' || savedSmartballContent.specEccentricity === 'Eccentricity: 0.1%' || savedSmartballContent.specEccentricity === 'Eccentricity: 0.01mm') {
    savedSmartballContent.specEccentricity = window.SMARTBALL_CONTENT_DEFAULTS.specEccentricity;
    smartballContentMigrated = true;
  }
  if (smartballContentMigrated) localStorage.setItem(window.SMARTBALL_CONTENT_STORAGE_KEY, JSON.stringify(savedSmartballContent));
  window.SMARTBALL_CONTENT = Object.assign({}, window.SMARTBALL_CONTENT_DEFAULTS, savedSmartballContent);
} catch (_) {
  window.SMARTBALL_CONTENT = Object.assign({}, window.SMARTBALL_CONTENT_DEFAULTS);
}
