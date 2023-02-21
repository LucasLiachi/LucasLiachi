/********************************************************
    @Publish Web Attributes
********************************************************/

PublishWebAttributes = {
    useTheme: false,                        // Personalize your export styles use theme builder for bizagi and copy the css file in /libs/css/theme.css
    preserveHTML: true,                     // Preserve your properties / description and attributes html format
    showPublishDate: false,                 // Show your publish date
    subNavigation: false,                   // Show a subnavigation bar for properties
    showPerformersList: false,              // Show a performers link
    maxLenghtTableViewDescription: 125,     // Number of characters in description
    maxLenghtDescription: 800,               // Number of characters in description dialog
    ie8:{
        draggable: false,
        diagramsSupported: 38
    }
};


/********************************************************
    @Theme Definition Colors (works with less)

    (http://lesscss.org/usage/#browser-support)
    Just for modern browsers
    IE9+,  Firefox and Chrome Last Versions
********************************************************/

ThemeColors = {
    "@header": "rgb(255, 165, 0)",
    "@header-border": "rgb(213, 138, 0)",
    "@header-link": "rgb(255, 255, 255)",
    "@navigation": "rgb(255, 238, 208)",
    "@navigation-border": "rgb(255, 215, 144)",
    "@navigation-link": "rgb(167, 107, 0)",
    "@content": "rgb(253, 251, 247)",
    "@content-border": "rgb(213, 138, 0)",
    "@content-text": "rgb(75, 48, 0)"
};