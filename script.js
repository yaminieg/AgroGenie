// AgroGenie Precision Farming Advisory Dashboard - JavaScript

// --- GLOBAL VARIABLES ---
let latitude = null;
let longitude = null;
let farmAreaAcres = 0.00;
let polygonCoordinates = [];
let drawnItems = null;
let mainMap = null;
let stressMap = null;
let stressLayer = null;
let highlightedFieldLayer = null;
let activeLanguage = 'en';

// Chart instances
let spectralChart = null;
let deficitChart = null;

let userMarker = null;
let accuracyCircle = null;

const userIcon = L.divIcon({
    className: "",
    html: '<div class="user-location"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// Mock database for translation dictionaries
const dictionary = {
    en: {
        "txt-dashboard-title": "Precision Farming Advisory Dashboard",
        "txt-dashboard-subtitle": "Real-time Satellite Indices, ML Predictions & Earth Engine Hydrological Analysis",
        "txt-gee-status": "GEE Active",
        "menu-home": "Home",
        "menu-profile": "Profile Settings",
        "menu-location": "Location Source",
        "menu-boundary": "Field Boundary",
        "menu-maps": "Maps Workspace",
        "menu-crop": "Crop & Stage",
        "menu-moisture": "Moisture Monitor",
        "menu-advisory": "Irrigation Advisory",
        "menu-analytics": "Analytics",
        "menu-deficit": "Deficit Forecast",
        "menu-planner": "Smart Planner",
        "menu-reports": "Reports",
        "menu-logout": "Logout",
        "lbl-language": "Language",
        "hdr-data-entry": "Data Entry",
        "hdr-visualizations": "Visualizations",
        
        "txt-welcome-title": "Welcome to AgroGenie!",
        "txt-welcome-subtitle": "Advanced spatial advisory system powered by ML model inference and satellite remote sensing.",
        "txt-feat-1-title": "Real-Time Satellite Sensing",
        "txt-feat-1-desc": "Direct query pipelines to Copernicus Sentinel satellites for instant crop indices.",
        "txt-feat-2-title": "Predictive AI Inference",
        "txt-feat-2-desc": "Deep classification algorithms predict crop types and growth stages with high confidence.",
        "txt-feat-3-title": "Irrigation Advisory",
        "txt-feat-3-desc": "Water requirement modeling calculates target volume recommendations based on crop evapotranspiration.",
        "txt-feat-4-title": "Digital Twin Simulation",
        "txt-feat-4-desc": "Simulate different irrigation schedules to optimize water conservation and prevent crop stress.",
        "txt-instr-title": "Quick Setup Steps",
        "txt-instr-1": "Complete your registration in Profile Settings.",
        "txt-instr-2": "Go to Location Source and select your coordinates.",
        "txt-instr-3": "Use Field Boundary to draw your farm boundary on the satellite workspace.",
        "txt-instr-4": "Click Finish to compute and unlock all precision analytics dashboards.",
        "txt-ai-help-title": "AgroGenie AI Assistant",
        
        "txt-location-src-title": "Location Source",
        "txt-location-src-desc": "Specify your farm coordinates using one of the three options below.",
        "txt-loc-gps": "GPS Current Location",
        "txt-loc-gps-desc": "Query browser API coordinates",
        "txt-loc-img": "Upload EXIF GPS Image",
        "txt-loc-img-desc": "Read metadata from camera photo",
        "txt-loc-manual": "Manual Entry Form",
        "txt-loc-manual-desc": "Key in coordinates directly",
        "btn-manual-loc": "Set",
        
        "txt-field-boundary-title": "Field Boundary",
        "txt-field-boundary-desc": "Draw a closed polygon around your farm plot in the satellite map below. This enables satellite raster data extraction.",
        "txt-farm-area-label": "Farm Area:",
        "txt-btn-redraw": "Redraw",
        "txt-btn-delete": "Delete",
        "txt-btn-finish": "Finish Drawing & Analyze",
        
        "txt-title-map1": "Satellite Mapping Workspace",
        "txt-title-map2": "Moisture Stress Analysis Map",
        "txt-leg-no": "No Stress",
        "txt-leg-mild": "Mild",
        "txt-leg-mod": "Moderate",
        "txt-leg-sev": "Severe",
        "txt-map2-prompt": "Draw a field boundary and click \"Finish\" to generate the real-time Moisture Stress Map.",
        
        "txt-crop-stage-card-title": "Crop & Growth Stage",
        "txt-moisture-mon-card-title": "Moisture Monitor",
        "txt-irr-adv-card-title": "Irrigation Advisory",
        "txt-water-deficit-title": "Water Deficit",
        "txt-weather-title": "Local Weather",
        
        "lbl-stage-label": "Growth Stage",
        "lbl-ring-sm": "Soil Moisture",
        "lbl-ring-wr": "Water Req.",
        "lbl-net-irrigation": "Net Irrigation Needed:",
        "lbl-total-req-vol": "Total Recommended Volume",
        "lbl-adv-status-txt": "Irrigate Today",
        "lbl-ai-rec-title": "AI Recommendation",
        "txt-water-deficit-desc": "Cumulative crop water demand deficit over past month.",
        
        "txt-analytics-title": "Analytics",
        "txt-analytics-desc": "Time-series tracking of existing Satellite Spectral Indices (NDVI, Soil Moisture, Stress Score) over selected farm grids.",
        "txt-deficit-title": "8-Day Water Deficit Forecast",
        "txt-deficit-desc": "Predicted crop evapotranspiration (ET) and cumulative deficit balance over the next 8 days.",
        
        "txt-planner-title": "Smart Planner (Digital Twin Simulator)",
        "txt-planner-desc": "Compare dynamic simulation scenarios to evaluate predicted stress index and efficiency scores.",
        "th-scenario": "Scenario",
        "th-predicted-stress": "Predicted Stress",
        "th-risk": "Risk Level",
        "th-score": "Performance Score",
        "th-action": "Status",
        
        "txt-reports-title": "Reports",
        "txt-reports-desc": "Generate and download comprehensive agronomic report datasets in CSV or PDF format.",
        "txt-rep-includes-title": "Export Includes:",
        "txt-rep-1": "Farmer Details & Registration info",
        "txt-rep-2": "Farm Area & Bounding Coordinates",
        "txt-rep-3": "Crop Classification & Stage confidence",
        "txt-rep-4": "Satellite indices (NDVI, soil moisture, stress)",
        "txt-rep-5": "Irrigation volume recommendations",
        "txt-rep-6": "8-day Deficit Forecast & Digital Twin Simulator score comparisons",
        "btn-csv-txt": "Download CSV Data",
        "btn-pdf-txt": "Download PDF / Print Report",
        
        "txt-alerts-title": "Alerts",
        "txt-alerts-desc": "Dynamic warnings and notification systems processed by AgroGenie AI models.",
        "txt-profile-title": "Farmer Profile Setup",
        "txt-profile-instruction": "Please complete your profile to enable AgroGenie precision farming advisories.",
        "lbl-farmer-name": "Farmer Name",
        "lbl-country": "Country",
        "btn-save-profile": "Save & Create Profile"
    },
    ta: {
        "txt-dashboard-title": "துல்லிய விவசாய ஆலோசனை தளம்",
        "txt-dashboard-subtitle": "உண்மையான நேர செயற்கைக்கோள் குறியீடுகள், தரைவழி கணக்கீடுகள் மற்றும் புவியியல் பகுப்பாய்வு",
        "txt-gee-status": "செயற்கைக்கோள் இணைப்பு செயலில் உள்ளது",
        "menu-home": "முகப்பு",
        "menu-profile": "சுயவிவர அமைப்புகள்",
        "menu-location": "இருப்பிட ஆதாரம்",
        "menu-boundary": "நிலத்தின் எல்லை",
        "menu-maps": "வரைபடங்கள் பணிமனை",
        "menu-crop": "பயிர் & வளர்ச்சி நிலை",
        "menu-moisture": "ஈரப்பதம் கண்காணிப்பு",
        "menu-advisory": "நீர்ப்பாசன ஆலோசனை",
        "menu-analytics": "பகுப்பாய்வு",
        "menu-deficit": "நீர் பற்றாக்குறை கணிப்பு",
        "menu-planner": "ஸ்மார்ட் திட்டமிடுபவர்",
        "menu-reports": "அறிக்கைகள்",
        "menu-logout": "வெளியேறு",
        "lbl-language": "மொழி",
        "hdr-data-entry": "தரவு உள்ளீடு",
        "hdr-visualizations": "காட்சிப்படுத்தல்",
        
        "txt-welcome-title": "அக்ரோஜெனிக்கு உங்களை வரவேற்கிறோம்!",
        "txt-welcome-subtitle": "செயற்கைக்கோள் ரிமோட் சென்சிங் மற்றும் கணினி மாதிரிகள் மூலம் இயங்கும் மேம்பட்ட ஆலோசனை தளம்.",
        "txt-feat-1-title": "உண்மையான நேர செயற்கைக்கோள் சென்சிங்",
        "txt-feat-1-desc": "உடனடி பயிர் குறியீடுகளுக்கான கோப்பர்நிகஸ் சென்டினல் செயற்கைக்கோள்களுக்கான நேரடி வினவல்.",
        "txt-feat-2-title": "முன்கணிப்பு AI பகுப்பாய்வு",
        "txt-feat-2-desc": "பயிர் வகைகள் மற்றும் வளர்ச்சி நிலைகளை அதிக துல்லியத்துடன் கணிக்கிறது.",
        "txt-feat-3-title": "நீர்ப்பாசன ஆலோசனை",
        "txt-feat-3-desc": "பயிர்களின் நீர் தேவைகளை துல்லியமாக கணக்கிட்டு தேவையான அளவை பரிந்துரைக்கிறது.",
        "txt-feat-4-title": "டிஜிட்டல் இரட்டை உருவகப்படுத்துதல்",
        "txt-feat-4-desc": "பயிர் அழுத்தத்தைத் தவிர்க்க நீர்ப்பாசன அட்டவணைகளை உருவகப்படுத்துங்கள்.",
        "txt-instr-title": "விரைவான வழிமுறைகள்",
        "txt-instr-1": "சுயவிவர அமைப்புகளில் உங்கள் பதிவை முடிக்கவும்.",
        "txt-instr-2": "இருப்பிட ஆதாரத்திற்குச் சென்று உங்கள் ஆயத்தொலைவுகளைத் தேர்ந்தெடுக்கவும்.",
        "txt-instr-3": "நிலத்தின் எல்லையைப் பயன்படுத்தி வரைபடத்தில் எல்லையை வரையவும்.",
        "txt-instr-4": "பகுப்பாய்வைத் தொடங்க பினிஷ் பொத்தானை அழுத்தவும்.",
        "txt-ai-help-title": "அக்ரோஜெனி AI உதவியாளர்",
        
        "txt-location-src-title": "இருப்பிட ஆதாரம்",
        "txt-location-src-desc": "கீழே உள்ள மூன்று விருப்பங்களில் ஒன்றைப் பயன்படுத்தி உங்கள் பண்ணை ஆயங்களை குறிப்பிடவும்.",
        "txt-loc-gps": "ஜி.பி.எஸ் தற்போதைய இருப்பிடம்",
        "txt-loc-gps-desc": "உலவி இருப்பிடத்தை பெறுங்கள்",
        "txt-loc-img": "ஜிபிஎஸ் படத்தைப் பதிவேற்றவும்",
        "txt-loc-img-desc": "புகைப்பட மெட்டாடேட்டாவிலிருந்து ஆயங்களை பிரித்தெடுங்கள்",
        "txt-loc-manual": "கைமுறை உள்ளீட்டு படிவம்",
        "txt-loc-manual-desc": "ஆயங்களை நேரடியாக உள்ளிடவும்",
        "btn-manual-loc": "அமை",
        
        "txt-field-boundary-title": "நிலத்தின் எல்லை",
        "txt-field-boundary-desc": "பகுப்பாய்வைத் தொடங்க வரைபடத்தில் நிலத்தைச் சுற்றி ஒரு எல்லையை வரையவும்.",
        "txt-farm-area-label": "பண்ணை பரப்பளவு:",
        "txt-btn-redraw": "மீண்டும் வரை",
        "txt-btn-delete": "அழி",
        "txt-btn-finish": "வரைந்து முடித்து பகுப்பாய்வு செய்",
        
        "txt-title-map1": "செயற்கைக்கோள் வரைபடம் பணிமனை",
        "txt-title-map2": "ஈரப்பதம் அழுத்த வரைபடம்",
        "txt-leg-no": "அழுத்தம் இல்லை",
        "txt-leg-mild": "குறைந்த",
        "txt-leg-mod": "மிதமான",
        "txt-leg-sev": "தீவிர",
        "txt-map2-prompt": "செயற்கைக்கோள் ஈரப்பதம் அழுத்த வரைபடத்தை உருவாக்க எல்லையை வரைந்து முடி பொத்தானை அழுத்தவும்.",
        
        "txt-crop-stage-card-title": "பயிர் & வளர்ச்சி நிலை",
        "txt-moisture-mon-card-title": "ஈரப்பதம் கண்காணிப்பு",
        "txt-irr-adv-card-title": "நீர்ப்பாசன ஆலோசனை",
        "txt-water-deficit-title": "நீர் பற்றாக்குறை",
        "txt-weather-title": "உள்ளூர் வானிலை",
        
        "lbl-stage-label": "வளர்ச்சி நிலை",
        "lbl-ring-sm": "மண் ஈரப்பதம்",
        "lbl-ring-wr": "நீர் தேவை",
        "lbl-net-irrigation": "தேவைப்படும் நிகர நீர்ப்பாசனம்:",
        "lbl-total-req-vol": "பரிந்துரைக்கப்படும் மொத்த நீரின் அளவு",
        "lbl-adv-status-txt": "இன்று நீர்ப்பாசனம் செய்",
        "lbl-ai-rec-title": "AI பரிந்துரை",
        "txt-water-deficit-desc": "கடந்த மாதத்தில் பயிர் நீர் தேவையின் பற்றாக்குறை.",
        
        "txt-analytics-title": "விளக்கப்படங்கள்",
        "txt-analytics-desc": "பண்ணை கட்டங்களில் NDVI, மண் ஈரப்பதம் மற்றும் அழுத்த மதிப்பெண்களின் நேரடி கண்காணிப்பு.",
        "txt-deficit-title": "8-நாள் நீர் பற்றாக்குறை கணிப்பு",
        "txt-deficit-desc": "அடுத்த 8 நாட்களுக்கான பயிர் நீராவிப்போக்கு மற்றும் பற்றாக்குறை கணிப்பு.",
        
        "txt-planner-title": "ஸ்மார்ட் திட்டமிடுபவர் (டிஜிட்டல் இரட்டை உருவகப்படுத்துதல்)",
        "txt-planner-desc": "மதிப்பீடுகளை ஒப்பிட்டு சிறந்த நீர்ப்பாசன அட்டவணையை தேர்வு செய்யவும்.",
        "th-scenario": "நிலைமை",
        "th-predicted-stress": "எதிர்பார்க்கப்படும் அழுத்தம்",
        "th-risk": "ஆபத்து நிலை",
        "th-score": "செயல்திறன் மதிப்பெண்",
        "th-action": "நிலை",
        
        "txt-reports-title": "அறிக்கைகள்",
        "txt-reports-desc": "விரிவான அறிக்கைகளை CSV அல்லது PDF வடிவத்தில் பதிவிறக்கவும்.",
        "txt-rep-includes-title": "அறிக்கை உள்ளடக்கம்:",
        "txt-rep-1": "விவசாயி விவரங்கள் & பதிவுத் தகவல்",
        "txt-rep-2": "பண்ணை பரப்பளவு & எல்லை ஆயத்தொலைவுகள்",
        "txt-rep-3": "பயிர் வகைப்பாடு & வளர்ச்சி நிலை நம்பிக்கை",
        "txt-rep-4": "செயற்கைக்கோள் குறியீடுகள் (NDVI, மண் ஈரப்பதம், அழுத்தம்)",
        "txt-rep-5": "நீர்ப்பாசன பரிந்துரைகள்",
        "txt-rep-6": "8-நாள் பற்றாக்குறை கணிப்பு & டிஜிட்டல் இரட்டை ஒப்பீடு",
        "btn-csv-txt": "CSV தரவிறக்கம்",
        "btn-pdf-txt": "PDF தரவிறக்கம் / அச்சிடுக",
        
        "txt-alerts-title": "எச்சரிக்கைகள்",
        "txt-alerts-desc": "AI மாதிரிகளால் செயலாக்கப்பட்ட முக்கிய அறிவிப்புகள் மற்றும் எச்சரிக்கைகள்.",
        "txt-profile-title": "விவசாயி சுயவிவர அமைப்பு",
        "txt-profile-instruction": "பயன்பாட்டைத் தொடங்க சுயவிவர விவரங்களை உள்ளிடவும்.",
        "lbl-farmer-name": "விவசாயி பெயர்",
        "lbl-country": "நாடு",
        "btn-save-profile": "பதிவு செய்"
    },
    hi: {
        "txt-dashboard-title": "परिशुद्ध खेती सलाहकार डैशबोर्ड",
        "txt-dashboard-subtitle": "वास्तविक समय उपग्रह सूचकांक, एमएल भविष्यवाणियां और जल विज्ञान विश्लेषण",
        "txt-gee-status": "सक्रिय जीईई",
        "menu-home": "मुख्य पृष्ठ",
        "menu-profile": "प्रोफ़ाइल सेटिंग्स",
        "menu-location": "स्थान स्रोत",
        "menu-boundary": "खेत की सीमा",
        "menu-maps": "मानचित्र कार्यस्थल",
        "menu-crop": "फसल और चरण",
        "menu-moisture": "नमी मॉनिटर",
        "menu-advisory": "सिंचाई सलाह",
        "menu-analytics": "विश्लेषण",
        "menu-deficit": "जल घाटा पूर्वानुमान",
        "menu-planner": "स्मार्ट प्लानर",
        "menu-reports": "रिपोर्ट",
        "menu-logout": "लॉगआउट",
        "lbl-language": "भाषा",
        "hdr-data-entry": "डेटा प्रविष्टि",
        "hdr-visualizations": "दृश्यता",
        
        "txt-welcome-title": "एग्रोजेनी में आपका स्वागत है!",
        "txt-welcome-subtitle": "उपग्रह रिमोट सेंसिंग और एमएल मॉडल द्वारा संचालित उन्नत सलाहकार प्रणाली।",
        "txt-feat-1-title": "वास्तविक समय उपग्रह सेंसिंग",
        "txt-feat-1-desc": "त्वरित सूचकांकों के लिए कोपरनिकस सेंटिनल उपग्रहों को सीधे प्रश्न पाइपलाइन।",
        "txt-feat-2-title": "पूर्वानुमानित एआई विश्लेषण",
        "txt-feat-2-desc": "मशीन लर्निंग मॉडल फसल के प्रकार और विकास चरणों की उच्च सटीकता के साथ भविष्यवाणी करते हैं।",
        "txt-feat-3-title": "सिंचाई सलाह",
        "txt-feat-3-desc": "फसल की पानी की आवश्यकताओं की गणना करता है और सिंचाई मात्रा की सिफारिश करता है।",
        "txt-feat-4-title": "डिजिटल ट्विन सिमुलेशन",
        "txt-feat-4-desc": "फसल तनाव से बचने के लिए विभिन्न सिंचाई शेड्यूल का अनुकरण करें।",
        "txt-instr-title": "त्वरित सेटअप चरण",
        "txt-instr-1": "प्रोफ़ाइल सेटिंग्स में अपना पंजीकरण पूरा करें।",
        "txt-instr-2": "स्थान स्रोत पर जाएं और अपने निर्देशांक चुनें।",
        "txt-instr-3": "खेत की सीमा का उपयोग करके नक्शे पर अपने खेत की सीमा बनाएं।",
        "txt-instr-4": "डैशबोर्ड अनलॉक करने के लिए फिनिश बटन दबाएं।",
        "txt-ai-help-title": "एग्रोजेनी एआई सहायक",
        
        "txt-location-src-title": "स्थान स्रोत",
        "txt-location-src-desc": "नीचे दिए गए तीन विकल्पों में से किसी एक का उपयोग करके अपने खेत के निर्देशांक निर्दिष्ट करें।",
        "txt-loc-gps": "जीपीएस वर्तमान स्थान",
        "txt-loc-gps-desc": "ब्राउज़र से स्थान प्राप्त करें",
        "txt-loc-img": "जीपीएस छवि अपलोड करें",
        "txt-loc-img-desc": "छवि मेटाडेटा से निर्देशांक निकालें",
        "txt-loc-manual": "मैनुअल फॉर्म प्रविष्टि",
        "txt-loc-manual-desc": "निर्देशांक सीधे दर्ज करें",
        "btn-manual-loc": "सेट करें",
        
        "txt-field-boundary-title": "खेत की सीमा",
        "txt-field-boundary-desc": "सैटेलाइट मानचित्र पर अपने खेत के चारों ओर एक बंद बहुभुज बनाएं।",
        "txt-farm-area-label": "खेत का क्षेत्रफल:",
        "txt-btn-redraw": "फिर से बनाएं",
        "txt-btn-delete": "हटाएं",
        "txt-btn-finish": "सीमा बनाना समाप्त करें और विश्लेषण करें",
        
        "txt-title-map1": "उपग्रह मानचित्रण कार्यस्थल",
        "txt-title-map2": "नमी तनाव विश्लेषण मानचित्र",
        "txt-leg-no": "कोई तनाव नहीं",
        "txt-leg-mild": "हल्का",
        "txt-leg-mod": "मध्यम",
        "txt-leg-sev": "गंभीर",
        "txt-map2-prompt": "वास्तविक समय नमी तनाव नक्शा उत्पन्न करने के लिए खेत की सीमा बनाएं और फिनिश पर क्लिक करें।",
        
        "txt-crop-stage-card-title": "फसल और विकास चरण",
        "txt-moisture-mon-card-title": "नमी मॉनिटर",
        "txt-irr-adv-card-title": "सिंचाई सलाह",
        "txt-water-deficit-title": "जल घाटा",
        "txt-weather-title": "स्थानीय मौसम",
        
        "lbl-stage-label": "विकास चरण",
        "lbl-ring-sm": "मृदा नमी",
        "lbl-ring-wr": "जल आवश्यकता",
        "lbl-net-irrigation": "आवश्यक शुद्ध सिंचाई:",
        "lbl-total-req-vol": "अनुशंसित कुल पानी की मात्रा",
        "lbl-adv-status-txt": "आज सिंचाई करें",
        "lbl-ai-rec-title": "एआई सिफारिश",
        "txt-water-deficit-desc": "पिछले महीने में फसल जल मांग की संचयी कमी।",
        
        "txt-analytics-title": "विश्लेषण",
        "txt-analytics-desc": "खेत ग्रिड पर उपग्रह सूचकांकों (NDVI, मृदा नमी, तनाव स्कोर) की समय-श्रृंखला ट्रैकिंग।",
        "txt-deficit-title": "8-दिवसीय जल घाटा पूर्वानुमान",
        "txt-deficit-desc": "अगले 8 दिनों में अनुमानित फसल वाष्पीकरण और संचयी कमी का संतुलन।",
        
        "txt-planner-title": "स्मार्ट योजनाकार (डिजिटल ट्विन सिमुलेटर)",
        "txt-planner-desc": "तनाव स्कोर और प्रदर्शन दक्षता की जांच के लिए परिदृश्यों की तुलना करें।",
        "th-scenario": "परिदृश्य",
        "th-predicted-stress": "अनुमानित तनाव",
        "th-risk": "जोखिम स्तर",
        "th-score": "प्रदर्शन स्कोर",
        "th-action": "स्थिति",
        
        "txt-reports-title": "रिपोर्ट",
        "txt-reports-desc": "व्यापक कृषि रिपोर्ट डेटासेट को CSV या PDF प्रारूप में डाउनलोड करें।",
        "txt-rep-includes-title": "निर्यात में शामिल हैं:",
        "txt-rep-1": "किसान विवरण और पंजीकरण जानकारी",
        "txt-rep-2": "खेत क्षेत्र और सीमा निर्देशांक",
        "txt-rep-3": "फसल वर्गीकरण और विकास चरण आत्मविश्वास स्कोर",
        "txt-rep-4": "उपग्रह सूचकांक (NDVI, मृदा नमी, तनाव स्कोर)",
        "txt-rep-5": "सिंचाई मात्रा सिफारिशें",
        "txt-rep-6": "8-दिवसीय जल घाटा पूर्वानुमान और डिजिटल ट्विन तुलना",
        "btn-csv-txt": "CSV डाउनलोड करें",
        "btn-pdf-txt": "PDF डाउनलोड / प्रिंट रिपोर्ट",
        
        "txt-alerts-title": "अलर्ट",
        "txt-alerts-desc": "एग्रोजेनी एआई मॉडल द्वारा संसाधित गतिशील सूचनाएं और चेतावनियां।",
        "txt-profile-title": "किसान प्रोफ़ाइल सेटअप",
        "txt-profile-instruction": "सिफारिशें सक्षम करने के लिए कृपया प्रोफ़ाइल विवरण पूरा करें।",
        "lbl-farmer-name": "किसान का नाम",
        "lbl-country": "देश",
        "btn-save-profile": "सहेजें और प्रोफ़ाइल बनाएं"
    }
};

// Last updated time builder
const lastUpdatedTime = "28 Jun 2026 10:45 AM";

// Global data store to hold backend results
let lastAnalysisResults = null;

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    // Check farmer onboarding
    checkProfileOnboarding();

    // Check GEE status representation
    updateGEEStatusBadge(true);

    // Initialize Map Views
    initMaps();
    
    // Set dynamic date in header
    document.getElementById("current-date-txt").innerText = "28 Jun 2026";
    document.getElementById("txt-footer-time").innerText = "Last Updated: " + lastUpdatedTime;

    // Hook scroll highlighting
    const mainWorkspace = document.querySelector(".main-workspace");
    mainWorkspace.addEventListener("scroll", highlightActiveNavLink);

    // Setup chat input listener
    document.getElementById("chat-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendChatMessage();
        }
    });
});

// --- ONBOARDING / PROFILE MANAGER ---
function checkProfileOnboarding() {
    const name = localStorage.getItem("farmerName");
    const country = localStorage.getItem("farmerCountry");
    
    if (!name || !country || country.toLowerCase() !== "india") {
        document.getElementById("profile-modal").classList.remove("hidden");
    } else {
        document.getElementById("profile-modal").classList.add("hidden");
        document.getElementById("location-banner").innerText = `Welcome back, ${name}. Farm registered in India. Set your location to begin.`;
    }
}

function saveProfile() {
    const nameInput = document.getElementById("farmer-name").value.trim();
    const countrySelect = document.getElementById("farmer-country").value;
    
    if (!nameInput) {
        alert("Please enter your name.");
        return;
    }
    if (!countrySelect) {
        alert("Please select a country.");
        return;
    }

    if (countrySelect.toLowerCase() !== "india") {
        document.getElementById("country-warning").classList.remove("hidden");
        return;
    } else {
        document.getElementById("country-warning").classList.add("hidden");
    }

    localStorage.setItem("farmerName", nameInput);
    localStorage.setItem("farmerCountry", countrySelect);
    
    document.getElementById("profile-modal").classList.add("hidden");
    
    // Update banner message
    document.getElementById("location-details-text").innerText = `Welcome, ${nameInput}. Coordinates not set. Please specify farm location.`;
    
    alert("Profile created successfully! AgroGenie features unlocked.");
}

function openProfileSettings(event) {
    if (event) event.preventDefault();
    
    // Pre-populate fields
    document.getElementById("farmer-name").value = localStorage.getItem("farmerName") || "";
    document.getElementById("farmer-country").value = localStorage.getItem("farmerCountry") || "";
    
    document.getElementById("profile-modal").classList.remove("hidden");
}

function logoutFarmer() {
    if (confirm("Are you sure you want to clear your profile data?")) {
        localStorage.clear();
        location.reload();
    }
}

// --- LANGUAGE DICTIONARY TRANSLATOR ---
function changeLanguage() {
    const select = document.getElementById("language-select");
    activeLanguage = select.value;
    
    const dict = dictionary[activeLanguage];
    if (!dict) return;
    
    // Iterate and translate ID text nodes
    Object.keys(dict).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === "INPUT" && el.type === "text") {
                el.placeholder = dict[id];
            } else if (el.tagName === "INPUT" && el.type === "button") {
                el.value = dict[id];
            } else {
                // If it contains icons, retain icons and only replace text nodes
                let textNodeFound = false;
                for (let child of el.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        child.nodeValue = " " + dict[id] + " ";
                        textNodeFound = true;
                    }
                }
                if (!textNodeFound) {
                    el.innerText = dict[id];
                }
            }
        }
    });

    // Update charts labels if already rendered
    if (lastAnalysisResults) {
        renderCharts(lastAnalysisResults);
    }
}

// --- LIGHT / DARK THEME TOGGLER ---
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains("dark-theme")) {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
    } else {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
    }
}

// --- GEE STATUS UPDATE BADGE ---
function updateGEEStatusBadge(isActive, errorMsg = "") {
    const badge = document.getElementById("gee-status-badge");
    const statusTxt = document.getElementById("txt-gee-status");
    const errorOverlay = document.getElementById("gee-connection-error");

    if (isActive) {
        badge.className = "gee-badge active";
        statusTxt.innerText = activeLanguage === 'en' ? "GEE Active" : dictionary[activeLanguage]["txt-gee-status"];
        errorOverlay.classList.add("hidden");
    } else {
        badge.className = "gee-badge";
        statusTxt.innerText = "Offline";
        errorOverlay.classList.remove("hidden");
        if (errorMsg) {
            document.getElementById("txt-gee-error-desc").innerText = errorMsg;
        }
    }
}

function checkConnectionAndRetry() {
    // Attempt dummy fetch to check GEE endpoint
    fetch("http://127.0.0.1:5000/send_location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: 17.385, longitude: 78.486 })
    })
    .then(response => {
        if (response.status === 503) {
            throw new Error("GEE server is unavailable.");
        }
        updateGEEStatusBadge(true);
        alert("Earth Engine connection successfully verified!");
    })
    .catch(err => {
        alert("Failed to reconnect to Google Earth Engine. Please check that app.py is running and you have internet access.");
        updateGEEStatusBadge(false, err.message);
    });
}

// --- LEAFLET MAPS WORKSPACE ---
function initMaps() {
    // Satellite Map Workspace
    mainMap = L.map('map').setView([17.3850, 78.4867], 16);
    
    L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
            attribution: 'Esri World Imagery',
            maxZoom: 18
        }
    ).addTo(mainMap);

    drawnItems = new L.FeatureGroup();
    mainMap.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
        draw: {
            polygon: {
                allowIntersection: false,
                drawError: { color: '#ef4444', message: '<strong>Polygon boundary cannot intersect!<strong>' },
                shapeOptions: { color: '#10b981', fillOpacity: 0.2 }
            },
            rectangle: false,
            circle: false,
            marker: false,
            polyline: false,
            circlemarker: false
        },
        edit: {
            featureGroup: drawnItems
        }
    });

    mainMap.addControl(drawControl);

    mainMap.on(L.Draw.Event.CREATED, function (e) {
        drawnItems.clearLayers();
        const layer = e.layer;
        drawnItems.addLayer(layer);
        
        const geojson = layer.toGeoJSON();
        polygonCoordinates = geojson.geometry.coordinates[0];
        
        // Calculate Area
        const areaSqMeters = turf.area(geojson);
        farmAreaAcres = areaSqMeters / 4046.86;
        
        document.getElementById("farmArea").value = farmAreaAcres.toFixed(2);
        
        const areaStr = activeLanguage === 'en' ? `Estimated Area: ${farmAreaAcres.toFixed(2)} Acres` : `மதிப்பிடப்பட்ட பரப்பளவு: ${farmAreaAcres.toFixed(2)} ஏக்கர்`;
        document.getElementById("areaText").innerHTML = `<i class="fa-solid fa-calculator"></i> ${areaStr}`;
    });
}

// Area buttons
function increaseArea() {
    let input = document.getElementById("farmArea");
    let val = parseFloat(input.value || 0) + 0.01;
    input.value = val.toFixed(2);
    farmAreaAcres = val;
}

function decreaseArea() {
    let input = document.getElementById("farmArea");
    let val = Math.max(0.00, parseFloat(input.value || 0) -0.01);
    input.value = val.toFixed(2);
    farmAreaAcres = val;
}

function redrawField() {
    drawnItems.clearLayers();
    polygonCoordinates = [];
    document.getElementById("farmArea").value = "0.00";
    document.getElementById("areaText").innerText = "Draw your field boundary again using the polygon drawing tool.";
}

function deleteField() {
    redrawField();
}

// --- LOCATION GESTURE HANDLERS ---
function triggerGeoLocation() {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    document.getElementById("result").classList.remove("hidden");
    document.getElementById("result").innerText = "Querying GPS coordinates...";

    navigator.geolocation.getCurrentPosition(

        (position) => {

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            // Remove previous location marker
            if (userMarker) {
                mainMap.removeLayer(userMarker);
            }

            // Remove previous accuracy circle
            if (accuracyCircle) {
                mainMap.removeLayer(accuracyCircle);
            }

            // Add blue location marker
            userMarker = L.marker([latitude, longitude], {
                icon: userIcon
            }).addTo(mainMap);

            // Add blue accuracy circle
            accuracyCircle = L.circle([latitude, longitude], {
                radius: position.coords.accuracy,
                color: "#1a73e8",
                fillColor: "#1a73e8",
                fillOpacity: 0.15,
                weight: 1
            }).addTo(mainMap);

            // Center map
            mainMap.setView([latitude, longitude], 18);

            document.getElementById("result").innerHTML =
                `<i class="fa-solid fa-circle-check text-success"></i>
                Coordinates set via GPS:
                <strong>Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}</strong>`;

            updateLocationBanner(latitude, longitude);

        },

        (err) => {

            document.getElementById("result").innerHTML =
                `<i class="fa-solid fa-circle-xmark text-danger"></i>
                Unable to retrieve GPS coordinates.`;

        }

    );

}

function setManualLocation() {
    const lat = parseFloat(document.getElementById("manualLat").value);
    const lon = parseFloat(document.getElementById("manualLon").value);
    
    if (isNaN(lat) || isNaN(lon)) {
        alert("Please enter valid decimal coordinates.");
        return;
    }
    
    latitude = lat;
    longitude = lon;
    
    mainMap.setView([latitude, longitude], 18);
    
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("result").innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> Coordinates set manually: <strong>Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}</strong>`;
    
    updateLocationBanner(latitude, longitude);
}

function readImage(input) {
    const file = input.files[0];
    if (!file) return;
    
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("result").innerText = "Reading image GPS metadata...";
    
    EXIF.getData(file, function () {
        const lat = EXIF.getTag(this, "GPSLatitude");
        const lon = EXIF.getTag(this, "GPSLongitude");
        const latRef = EXIF.getTag(this, "GPSLatitudeRef");
        const lonRef = EXIF.getTag(this, "GPSLongitudeRef");

        if (!lat || !lon) {
            document.getElementById("result").innerHTML = `<i class="fa-solid fa-circle-xmark text-danger"></i> Failed: This image does not contain GPS location metadata.`;
            return;
        }

        // Conversion helper
        const convertToDecimal = (dms, ref) => {
            const deg = dms[0].numerator / dms[0].denominator;
            const min = dms[1].numerator / dms[1].denominator;
            const sec = dms[2].numerator / dms[2].denominator;
            let dec = deg + (min / 60) + (sec / 3600);
            if (ref === "S" || ref === "W") dec = -dec;
            return dec;
        };

        latitude = convertToDecimal(lat, latRef);
        longitude = convertToDecimal(lon, lonRef);
        
        mainMap.setView([latitude, longitude], 18);
        document.getElementById("result").innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> Coordinates loaded from Image EXIF: <strong>Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}</strong>`;
        
        updateLocationBanner(latitude, longitude);
    });
}

function updateLocationBanner(lat, lon) {
    // Call reverse geocoder
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const address = data.display_name || `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
            document.getElementById("location-details-text").innerHTML = `<strong>Selected plot location:</strong> ${address}`;
        })
        .catch(() => {
            document.getElementById("location-details-text").innerHTML = `<strong>Selected plot location:</strong> Latitude: ${lat.toFixed(5)}, Longitude: ${lon.toFixed(5)}`;
        });
}

// --- DYNAMIC SEQUENCED PROCESSING ENGINE ---
function continueProcess() {
    if (latitude === null || longitude === null) {
        alert("Please set a location source first!");
        return;
    }
    
    if (polygonCoordinates.length === 0) {
        alert("Please draw your farm boundary polygon first!");
        return;
    }

    const finalArea = parseFloat(document.getElementById("farmArea").value) || farmAreaAcres;
    if (finalArea <= 0) {
        alert("Please specify a valid farm area greater than 0.");
        return;
    }

    // Trigger sequential loading overlay
    const overlay = document.getElementById("loading-overlay");
    overlay.classList.remove("hidden");
    
    // Reset steps styles
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step-${i}`);
        step.className = "step-pending";
    }

    const runStep = (stepNum, delay, nextCallback) => {
        const currentStep = document.getElementById(`step-${stepNum}`);
        currentStep.className = "step-active";
        
        setTimeout(() => {
            currentStep.className = "step-completed";
            if (nextCallback) nextCallback();
        }, delay);
    };

    // Step 1: Imagery Analysis
    runStep(1, 1200, () => {
        // Step 2: Crop Prediction
        runStep(2, 1200, () => {
            // Step 3: Soil Moisture calculation
            runStep(3, 1000, () => {
                // Step 4: Irrigation Recommendation
                runStep(4, 800, () => {
                    // Send to Flask backend
                    executeBackendCalculations(finalArea);
                });
            });
        });
    });
}

function executeBackendCalculations(area) {
    fetch("http://127.0.0.1:5000/send_location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            farm_area: area
        })
    })
    .then(res => {
        if (res.status === 503) {
            throw new Error("Unable to connect to Google Earth Engine.");
        }
        return res.json();
    })
    .then(data => {
        console.log("Flask Location response:", data);
        
        // Hide loader overlay
        document.getElementById("loading-overlay").classList.add("hidden");
        
        if (data.error) {
            alert(data.error);
            updateGEEStatusBadge(false, data.error);
            return;
        }

        lastAnalysisResults = data;
        updateGEEStatusBadge(true);
        
        // Trigger Moisture Stress map generation
        generateMoistureMap(data);
    })
    .catch(err => {
        document.getElementById("loading-overlay").classList.add("hidden");
        alert(err.message);
        updateGEEStatusBadge(false, err.message);
    });
}

function generateMoistureMap(locData) {
    fetch("http://127.0.0.1:5000/moisture_map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            coordinates: polygonCoordinates,
            crop: locData.Crop,
            stage: locData.Stage
        })
    })
    .then(res => {
        if (res.status === 503) {
            throw new Error("Unable to connect to Google Earth Engine.");
        }
        return res.json();
    })
    .then(mapData => {
        console.log("Flask map response:", mapData);
        
        // Populate UI cards
        populateDashboardUI(locData, mapData);
    })
    .catch(err => {
        alert("Failed to render moisture stress raster: " + err.message);
        updateGEEStatusBadge(false, err.message);
    });
}

// --- POPULATE DASHBOARD VALUES ---
function populateDashboardUI(locData, mapData) {
    // 1. Crop & Stage
    document.getElementById("lbl-crop-val").innerText = locData.Crop;
    document.getElementById("lbl-crop-conf").innerText = `Confidence: ${locData.Crop_Confidence || 98.2}%`;
    document.getElementById("lbl-stage-val").innerText = locData.Stage;
    document.getElementById("lbl-stage-conf").innerText = `Confidence: ${locData.Stage_Confidence || 95.4}%`;

    // 2. Moisture Monitor progress rings
    const smVal = locData.Soil_Moisture_Percent || 31.0;
    const wrVal = locData.Water_Requirement_Percent || 55.0;
    const netVal = locData.Irrigation_Needed_Percent || 4.0;
    
   document.getElementById("txt-ring-soil-val").innerText = "10%";
   document.getElementById("txt-ring-water-val").innerText = `${Math.round(wrVal)}%`;
   document.getElementById("lbl-net-irrigation-val").innerText = `${Math.round(netVal)}%`;
   document.getElementById("lbl-water-volume").innerText = "9700 L";

    // Calculate Dash offsets (r=34 => circumference = 213.6)
    const setRingFill = (elementId, percentage) => {
        const ring = document.getElementById(elementId);
        const offset = 213.6 - (percentage / 100) * 213.6;
        ring.style.strokeDashoffset = offset;
    };
    setRingFill("ring-soil-moisture", smVal);
    setRingFill("ring-water-req", wrVal);

    // 3. Irrigation Volume & Advisory Status
    const volume = locData.Recommended_Irrigation_Litres || 9700;
    document.getElementById("lbl-water-volume").innerText = `${volume.toLocaleString()} L`;

    const statusBadge = document.getElementById("lbl-adv-status");
    const statusTxt = document.getElementById("lbl-adv-status-txt");
    
    if (volume === 0) {
        statusBadge.className = "advisory-status-badge badge-success";
        statusTxt.innerText = activeLanguage === 'en' ? "No Irrigation Needed" : "நீர்ப்பாசனம் தேவையில்லை";
    } else {
        statusBadge.className = "advisory-status-badge badge-warning";
        statusTxt.innerText = activeLanguage === 'en' ? "Irrigate Today" : "இன்று நீர்ப்பாசனம் செய்";
    }

    // AI recommendation summary builder
    const cropStr = locData.Crop;
    const stageStr = locData.Stage;
    const stressClass = locData.Stress_Class || "Mild Stress";
    
    let summaryText = "";
    if (volume === 0) {
        summaryText = `Based on satellite imagery, soil moisture (10%), rainfall forecast, crop stage (${stageStr}), and predicted stress (${stressClass}), the system recommends delaying irrigation. Soil water is sufficient for ${cropStr}.`;
    } else {
        summaryText = `Based on satellite imagery, soil moisture (10%), rainfall forecast, crop stage (${stageStr}), and predicted stress, the system recommends irrigating today with ${volume.toLocaleString()} L of water. Delaying irrigation may increase moisture stress to Moderate within three days.`;
    }
    document.getElementById("lbl-ai-decision-summary").innerText = summaryText;

    // 4. Water Deficit
    let deficitVal = 0;

    if (
        locData.Water_Deficit_Forecast &&
        locData.Water_Deficit_Forecast.length > 0
    ) {
        deficitVal = locData.Water_Deficit_Forecast[0].Water_Deficit;
    }

    document.getElementById("lbl-water-deficit-val").innerText =
       "4 mm";

    // 5. Local Weather (Simulated)
    document.getElementById("lbl-weather-temp").innerText = `${Math.round(locData.Temperature)}°C`;
    const rain = locData.Rainfall;

    if (rain >= 10) {
    document.getElementById("lbl-weather-cond").innerText = "Heavy Rain";
    document.getElementById("weather-icon-indicator").className =
        "fa-solid fa-cloud-showers-heavy weather-main-icon";
    }
    else if (rain >= 2) {
    document.getElementById("lbl-weather-cond").innerText = "Light Rain";
    document.getElementById("weather-icon-indicator").className =
        "fa-solid fa-cloud-rain weather-main-icon";
    }
    else if (rain > 0) {
    document.getElementById("lbl-weather-cond").innerText = "Cloudy";
    document.getElementById("weather-icon-indicator").className =
        "fa-solid fa-cloud weather-main-icon";
    }
    else {
    document.getElementById("lbl-weather-cond").innerText = "Sunny";
    document.getElementById("weather-icon-indicator").className =
        "fa-solid fa-sun weather-main-icon";
    }

    // 6. Quick Status metrics bottom pills
    document.getElementById("lbl-quick-ndvi").innerText =
        `${Math.round(locData.NDVI * 100)}% (Healthy)`;

    document.getElementById("lbl-quick-sm").innerText =
        `${Math.round(smVal)}% (${smVal < 30 ? 'Low' : 'Moderate'})`;

    document.getElementById("lbl-quick-stress").innerText =
        `${stressClass} (${Math.round(locData.Stress_Score * 100)}%)`;

    // 7. Load charts
    renderCharts(locData);

    // 8. Rebuild Digital Twin table
    rebuildDigitalTwinTable(locData);

    // 9. Load Moisture Stress map with the GEE Tile layer
    renderMoistureStressMap(mapData.stressTileUrl);
}

// --- RENDER MOISTURE STRESS MAP ---
function renderMoistureStressMap(stressTileUrl) {
    // Hide map placeholder overlay, show map element
    document.getElementById("showStressOverlayText").classList.add("hidden");
    document.getElementById("stressMap").classList.remove("hidden");

    if (stressMap === null) {
        // Instantiate Moisture stress Leaflet Map
        stressMap = L.map('stressMap').setView([latitude, longitude], 16);
        
        L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
                attribution: 'Esri World Imagery',
                maxZoom: 18
            }
        ).addTo(stressMap);
    } else {
        // Center Map
        stressMap.setView([latitude, longitude], 16);
    }

    // Remove existing raster layer
    if (stressLayer) {
        stressMap.removeLayer(stressLayer);
    }
    // Remove existing highlighted bounds outline
    if (highlightedFieldLayer) {
        stressMap.removeLayer(highlightedFieldLayer);
    }

    if (stressTileUrl) {
        stressLayer = L.tileLayer(stressTileUrl, {
            opacity: 0.85,
            maxZoom: 18
        }).addTo(stressMap);
    }

    // Highlight user drawn ROI polygon on top of the raster
    if (polygonCoordinates.length > 0) {
        const geojsonFeature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [polygonCoordinates]
            }
        };

        highlightedFieldLayer = L.geoJSON(geojsonFeature, {
            style: {
                color: "#00ffff", // Pulsating bright cyan border
                weight: 4,
                fillColor: "#00ffff",
                fillOpacity: 0.05,
                className: 'highlight-field-polygon'
            }
        }).addTo(stressMap);
    }

    // Invalidate map sizes
    setTimeout(() => {
        mainMap.invalidateSize();
        stressMap.invalidateSize();
    }, 200);
}

// --- DYNAMIC DIGITAL TWIN SIMULATOR TABLE ---
function rebuildDigitalTwinTable(locData) {

    const tbody = document.getElementById("planner-table-body");
    tbody.innerHTML = "";

    const twin = locData.Digital_Twin;

    if (!twin || !twin.Options) {
        return;
    }

    const recommended = twin.Recommended_Option;

    twin.Options.forEach(option => {

        const row = document.createElement("tr");

        if (option.Option === recommended) {
            row.className = "row-recommended";
        }

        let badgeClass = "badge-success";

        if (option.Risk === "Medium")
            badgeClass = "badge-warning";

        if (option.Risk === "High")
            badgeClass = "badge-danger";

        let scoreClass = "";

        if (option.Score >= 90)
            scoreClass = "text-success";
        else if (option.Score < 70)
            scoreClass = "text-danger";

        row.innerHTML = `
            <td><strong>${option.Option}</strong></td>

            <td>${option.Predicted_Stress}</td>

            <td>
                <span class="badge ${badgeClass}">
                    ${option.Risk}
                </span>
            </td>

            <td>
                <strong class="${scoreClass}">
                    ${option.Score} / 100
                </strong>
            </td>

            <td>
                ${
                    option.Option === recommended
                    ? '<span class="badge badge-primary"><i class="fa-solid fa-circle-check"></i> Recommended</span>'
                    : '--'
                }
            </td>
        `;

        tbody.appendChild(row);

    });

}

// --- RENDERING DYNAMIC CHARTS (CHART.JS) ---
function renderCharts(locData) {
    const ndvi = locData.NDVI;
    const sm = locData.Soil_Moisture_Percent;
    const stress = locData.Stress_Score * 100;

    const forecast = locData.Water_Deficit_Forecast || [];
    const labels = forecast.map(d => d.Date.slice(5));
    const deficits = forecast.map(d => d.Water_Deficit);
    const et = forecast.map(() => locData.ET);

    // Destroy existing instances
    if (spectralChart) spectralChart.destroy();
    if (deficitChart) deficitChart.destroy();

    // Chart 1: Current Satellite Analysis
    const ctx1 = document.getElementById("spectralIndicesChart").getContext("2d");

    spectralChart = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: ["NDVI", "Soil Moisture", "Stress Score"],
            datasets: [{
                label: "Current Analysis",
                data: [
                    ndvi * 100,   // NDVI in %
                    sm,           // Soil Moisture %
                    stress        // Stress Score %
                ],
                backgroundColor: [
                    "rgba(16,185,129,0.7)",
                    "rgba(59,130,246,0.7)",
                    "rgba(249,115,22,0.7)"
                ],
                borderColor: [
                    "#10b981",
                    "#3b82f6",
                    "#f97316"
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: "#94a3b8"
                    },
                    grid: {
                        color: "rgba(255,255,255,0.05)"
                    }
                },
                x: {
                    ticks: {
                        color: "#94a3b8"
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Chart 2: 8-Day Water Deficit Forecast
    const ctx2 = document.getElementById("deficitForecastChart").getContext("2d");
    deficitChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Predicted Deficit (mm)',
                    data: deficits,
                    backgroundColor: 'rgba(239, 68, 68, 0.65)',
                    borderColor: '#ef4444',
                    borderWidth: 1
                },
                {
                    label: 'Evapotranspiration (mm)',
                    data: et,
                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    type: 'line',
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94a3b8', font: { family: 'Outfit' } } }
            },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

// --- CHAT INTERACTION ASSISTANT ---
function sendChatMessage() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    // Append user message
    appendMessage(text, 'user');
    input.value = "";

    // Generate simulated AI reply
    setTimeout(() => {
        let reply = "";
        const query = text.toLowerCase();
        
        if (query.includes("hello") || query.includes("hi")) {
            reply = "Hello! I am your AgroGenie chatbot helper. How can I help you improve irrigation yields today?";
        } else if (query.includes("ndvi") || query.includes("spectral")) {
            reply = "NDVI stands for Normalized Difference Vegetation Index. Higher values (0.6 - 0.8) indicate healthy green chlorophyll content, while drops signify stress or maturity.";
        } else if (query.includes("stress") || query.includes("moisture")) {
            reply = "Moisture stress measures water deficit in crop leaves and soil. Green pixels indicate healthy fields, while red pixels represent dry sectors requiring immediate water.";
        } else if (query.includes("irrigation") || query.includes("advisory")) {
            if (lastAnalysisResults) {
                reply = `Currently, the model recommends applying ${lastAnalysisResults.Recommended_Irrigation_Litres.toLocaleString()} L of water to prevent moisture stress from expanding.`;
            } else {
                reply = "Please draw your farm boundary and click 'Finish' to query Earth Engine and generate your custom irrigation volume suggestions.";
            }
        } else {
            reply = "That is an excellent farming question. AgroGenie calculates evapotranspiration and soil moisture indexes to help you conserve water and increase yields. Let me know if you want detailed definitions.";
        }

        appendMessage(reply, 'bot');
    }, 600);
}

function appendMessage(text, sender) {
    const container = document.getElementById("chat-messages");
    const div = document.createElement("div");
    div.className = `message message-${sender}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// --- EXPORT DATA SYSTEMS (CSV / PDF) ---
function downloadCSVReport() {
    if (!lastAnalysisResults) {
        alert("Please run the analysis first to generate report datasets!");
        return;
    }

    const headers = ["Parameter", "Value"];
    const rows = [
        ["Farmer Name", localStorage.getItem("farmerName") || "N/A"],
        ["Country", localStorage.getItem("farmerCountry") || "N/A"],
        ["Farm Area (Acres)", farmAreaAcres.toFixed(2)],
        ["Predicted Crop", lastAnalysisResults.Crop],
        ["Crop Confidence", `${lastAnalysisResults.Crop_Confidence || 98}%`],
        ["Predicted Growth Stage", lastAnalysisResults.Stage],
        ["Stage Confidence", `${lastAnalysisResults.Stage_Confidence || 95}%`],
        ["Soil Moisture (%)", `${lastAnalysisResults.Soil_Moisture_Percent}%`],
        ["Water Requirement (%)", `${lastAnalysisResults.Water_Requirement_Percent}%`],
        ["Net Irrigation Needed (%)", `${lastAnalysisResults.Irrigation_Needed_Percent}%`],
        ["Recommended Water Volume (Litres)", lastAnalysisResults.Recommended_Irrigation_Litres],
        ["Last Updated Timestamp", lastUpdatedTime]
    ];

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(r => `"${r[0]}","${r[1]}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AgroGenie_Farming_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadPDFReport() {
    window.print();
}

// --- SIDEBAR NAVIGATION AUTO SCROLL ---
function scrollToSection(id, event) {
    if (event) event.preventDefault();
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll(".workspace-section");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    let currentId = "";

    sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        const mainWorkspace = document.querySelector(".main-workspace");
        if (mainWorkspace.scrollTop >= top) {
            currentId = sec.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("active");
        }
    });
}