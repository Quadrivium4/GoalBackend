var queryDate = function(date) {
    var date1 = new Date(date);
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + 1);
    return {
        $and: [
            {
                date: {
                    $gte: date1.getTime()
                }
            },
            {
                date: {
                    $lt: date2.getTime()
                }
            }
        ]
    };
};
var queryWeek = function(date) {
    var date1 = new Date(date);
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + 7);
    return {
        $and: [
            {
                date: {
                    $gte: date1.getTime()
                }
            },
            {
                date: {
                    $lt: date2.getTime()
                }
            }
        ]
    };
};
export { queryDate, queryWeek };
