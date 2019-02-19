let data = ['John Due', 'Max', 'Guest3216598', 'Anonymous', 3214654, new Date()];

// Create some data, store it into an array and display the value and index
data.forEach(function(value, index) {
    // The right way to test if the data is a Date
    if(Object.prototype.toString.call(data[index]) === "[object Date]"){
        // Get just the year from Date
        console.log(data[index].getFullYear());
    }
});