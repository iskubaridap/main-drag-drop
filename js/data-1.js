var data = new Object();
var data2 = new Object();
var data3 = new Object();
var data4 = new Object();

data.dragObj = new Object();
data.dropObj = new Object();

data2.dragObj = new Object();
data2.dropObj = new Object();

data3.dragObj = new Object();
data3.dropObj = new Object();

data4.dragObj = new Object();
data4.dropObj = new Object();

data.dragObj.items = [
    {
        id: 'item1',
        text: 'Where does a rep find the P+ Policy?'
    },{
        id: 'item2',
        text: 'John selected &quot;Apply P+ Policy&quot; but nothing changed. Why?'
    },{
        id: 'item3',
        text: 'What is the difference between Assets and Entitlements?'
    },{
        id: 'item4',
        text: 'How often do assets need to be renewed?'
    },{
        id: 'item5',
        text: 'Where can a rep find and download the McAfee Price Book?'
    }
];
data.dropObj.items = [
    {
        id: 'item1',
        text: 'CPQ'
    },{
        id: 'item2',
        text: 'Prices might not change if the product quantity is not high enough.'
    },{
        id: 'item3',
        text: 'Assets are owned, and Entitlements need to be renewed.'
    },{
        id: 'item4',
        text: 'Never'
    },{
        id: 'item5',
        text: 'There are two places, under Tools in the Sales Portal and under Custom Links on the SFDC home page'
    }
];

data2.dragObj.items = [
    {
        id: 'item1',
        text: 'Why is it necessary to pick my region for the Price Book?'
    },{
        id: 'item2',
        text: 'How often should the Price Book be downloaded?'
    },{
        id: 'item3',
        text: 'What is a&quot; P+ SKU&quot;?'
    },{
        id: 'item4',
        text: 'What is the CRM Score?'
    },{
        id: 'item5',
        text: 'In the Opportunity view, which column should be enabled and why?'
    }
];
data2.dropObj.items = [
    {
        id: 'item1',
        text: 'There are specific products and pricing per region.	'
    },{
        id: 'item2',
        text: 'Quarterly – due to Price Book addendums'
    },{
        id: 'item3',
        text: 'Common product suites that allow higher price banding when combined'
    },{
        id: 'item4',
        text: 'An aggregate score that considers deal size changes, forecast stages, and activity'
    },{
        id: 'item5',
        text: 'Customer Product Interest – to ensure it is filled out'
    }
];

data3.dragObj.items = [
    {
        id: 'item1',
        text: 'What do the different colored tasks in the Forecast screen mean?'
    },{
        id: 'item2',
        text: 'Why would a rep add an account as a favorite when there are lists already?'
    },{
        id: 'item3',
        text: 'How can an opportunity be marked as a favorite?'
    },{
        id: 'item4',
        text: 'What is the main purpose of sales stages?'
    },{
        id: 'item5',
        text: 'What is the difference between a sales stage and a forecast stage?'
    }
];
data3.dropObj.items = [
    {
        id: 'item1',
        text: 'Green shows complete, yellow shows caution, and red shows overdue.'
    },{
        id: 'item2',
        text: 'It facilitates quickly navigating to the top accounts anywhere in SFDC.'
    },{
        id: 'item3',
        text: 'In Salesforce, search for the opportunity, and click the top-right corner star to mark it.'
    },{
        id: 'item4',
        text: 'The ability to show leaders where the opportunity is in the sales cycle'
    },{
        id: 'item5',
        text: 'A sales stage is where the opportunity is in the sales cycle, and a forecast stage is where I feel the deal is in my forecast.'
    }
];

data4.dragObj.items = [
    {
        id: 'item1',
        text: 'When I click the POST link in Salesforce, it does not work. Why?'
    },{
        id: 'item2',
        text: 'How often should POST be reviewed?'
    },{
        id: 'item3',
        text: 'What does CPQ mean?'
    },{
        id: 'item4',
        text: 'What does the icon "thumbs up" mean?'
    },{
        id: 'item5',
        text: 'I have added a new product to my renewal opportunity. How can I co-term so that all product entitlements expire the same day?'
    }
];
data4.dropObj.items = [
    {
        id: 'item1',
        text: 'You need to be inside a McAfee office or connected via VPN.'
    },{
        id: 'item2',
        text: 'Every day, especially during quarter end'
    },{
        id: 'item3',
        text: 'Configure, Price, Quote'
    },{
        id: 'item4',
        text: 'Shows list of upsell / cross-sell opportunities'
    },{
        id: 'item5',
        text: 'Go to the line item of the new product. Scroll to the End Date column. Type in the same date as the other entitlements End dates. Click Reprice.'
    }
];