$(function() {

    // Chart effective rating
    function effectiveness(results) {
        // Collect age results
        var data = {};
        for (var i = 0, l = results.length; i < l; i++) {
            var effectivenessResponse = results[i].responses[0];
            var k = String(effectivenessResponse.answer);
            if (!data[k]) data[k] = 1;
            else data[k]++;
        }

        // Assemble for graph
        var labels = Object.keys(data);
        var dataSet = [];
        for (var k in data)
            dataSet.push(data[k]);

        // Render chart
        var ctx = document.getElementById('effectivenessChart').getContext('2d');
        var effectivenessChart = new Chart(ctx).Bar({
            labels: labels,
            datasets: [{
                label: 'Effectiveness',
                data: dataSet
            }]
        });
    }

    function prepairedness(results) {
        // Collect age results
        var data = {};
        for (var i = 0, l = results.length; i < l; i++) {
            var prepairednessResponse = results[i].responses[1];
            var k = String(prepairednessResponse.answer);
            if (!data[k]) data[k] = 1;
            else data[k]++;
        }

        // Assemble for graph
        var labels = Object.keys(data);
        var dataSet = [];
        for (var k in data)
            dataSet.push(data[k]);

        // Render chart
        var ctx = document.getElementById('prepairednessChart').getContext('2d');
        var prepairednessChart = new Chart(ctx).Bar({
            labels: labels,
            datasets: [{
                label: 'Prepairedness',
                data: dataSet
            }]
        });
    }

        function confidence(results) {
        // Collect age results
        var data = {};
        for (var i = 0, l = results.length; i < l; i++) {
            var confidenceResponse = results[i].responses[2];
            var k = String(confidenceResponse.answer);
            if (!data[k]) data[k] = 1;
            else data[k]++;
        }

        // Assemble for graph
        var labels = Object.keys(data);
        var dataSet = [];
        for (var k in data)
            dataSet.push(data[k]);

        // Render chart
        var ctx = document.getElementById('confidenceChart').getContext('2d');
        var confidenceChart = new Chart(ctx).Bar({
            labels: labels,
            datasets: [{
                label: 'Confidence',
                data: dataSet
            }]
        });
    }

    // Chart yes/no responses to lemur question
    // function lemurs(results) {
    //     // Collect lemur kicking results
    //     var yes = 0,
    //         no = 0;
    //     for (var i = 0, l = results.length; i < l; i++) {
    //         var lemurResponse = results[i].responses[1];
    //         lemurResponse.answer ? yes++ : no++;
    //     }

    //     var ctx = document.getElementById('lemurChart').getContext('2d');
    //     var ageChart = new Chart(ctx).Pie([{
    //         value: yes,
    //         label: 'Yes',
    //         color: 'green',
    //         highlight: 'gray'
    //     }, {
    //         value: no,
    //         label: 'No',
    //         color: 'red',
    //         highlight: 'gray'
    //     }]);
    // }

    // poor man's html template for a response table row
    function row(response) {
        var tpl = '<tr><td>';
        tpl += response.answer || 'pending...' + '</td>';
        if (response.recordingUrl) {
            tpl += '<td><a target="_blank" href="' + response.recordingUrl + '"><i class="fa fa-play"></i></a></td>';
        } else {
            tpl += '<td>N/A</td>';
        }
        tpl += '</tr>';
        return tpl;
    }

    // add text responses to a table
    function freeText1(results) {
        var $responses = $('#feedbackResponses');
        var content = '';
        for (var i = 0, l = results.length; i < l; i++) {
            var feedbackResponse = results[i].responses[3];
            content += row(feedbackResponse);
        }
        $responses.append(content);
    }

        // add text responses to a table
    function freeText2(results) {
        var $responses = $('#confusionResponses');
        var content = '';
        for (var i = 0, l = results.length; i < l; i++) {
            var confusionResponse = results[i].responses[4];
            content += row(confusionResponse);
        }
        $responses.append(content);
    }

    // Load current results from server
    $.ajax({
        url: '/results',
        method: 'GET'
    }).done(function(data) {
        // Update charts and tables
        $('#total').html(data.results.length);
        prepairedness(data.results);
        effectiveness(data.results);
        confidence(data.results);
        freeText1(data.results);
        freeText2(data.results);
    }).fail(function(err) {
        console.log(err);
        alert('failed to load results data :(');
    });
});