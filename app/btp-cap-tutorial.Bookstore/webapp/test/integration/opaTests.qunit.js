sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'btpcaptutorial/Bookstore/test/integration/FirstJourney',
		'btpcaptutorial/Bookstore/test/integration/pages/ListOfBooksMain'
    ],
    function(JourneyRunner, opaJourney, ListOfBooksMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('btpcaptutorial/Bookstore') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheListOfBooksMain: ListOfBooksMain
                }
            },
            opaJourney.run
        );
    }
);