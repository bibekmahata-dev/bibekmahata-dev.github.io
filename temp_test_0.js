
    var window = { addEventListener: function() {} };
    var document = { getElementById: function() { return {}; }, querySelectorAll: function() { return []; }, addEventListener: function() {} };
    var navigator = { geolocation: { getCurrentPosition: function() {} } };
    var localStorage = { getItem: function() { return null; }, setItem: function() {}, removeItem: function() {} };
    var L = { tileLayer: function() { return { addTo: function() {} }; }, map: function() { return { setView: function() { return this; }, fitBounds: function() {}, flyTo: function() {}, invalidateSize: function() {}, addLayer: function() {}, removeLayer: function() {}, hasLayer: function() { return false; } }; }, divIcon: function() { return {}; }, marker: function() { return { addTo: function() { return this; }, bindPopup: function() { return this; }, openPopup: function() {} }; }, polyline: function() { return { addTo: function() { return this; }, getBounds: function() { return {}; } }; }, control: { zoom: function() { return { addTo: function() {} }; }, layers: function() { return { addTo: function() { return this; }, addOverlay: function() {} }; } } };
    var fetch = function() { return Promise.resolve({ json: function() { return Promise.resolve({}); }, text: function() { return Promise.resolve(''); } }); };
    var alert = function() {};
    
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Bengal Explorers",
        "alternateName": ["Bibek Mahata", "Bengal Explorers by Bibek Mahata", "Bibek Mahata Portal", "BengalExplorers"],
        "url": "https://bibekmahata-dev.github.io/",
        "author": {
            "@type": "Person",
            "name": "Bibek Mahata",
            "url": "https://bibekmahata-dev.github.io/about.html"
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://bibekmahata-dev.github.io/?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    
    