$(document).ready(function() {
    var highestCol = Math.min($('#intro-img1').height(),$('#intro-img2').height());
    $('.intro-img-container1').height(highestCol);
    highestCol = Math.min($('#intro-img3').height(),$('#intro-img4').height());
    $('.intro-img-container2').height(highestCol);
    highestCol = Math.min($('#intro-img5').height(),$('#intro-img6').height());
    $('.intro-img-container3').height(highestCol+20);

    $("a.color-changer").click(function(e) {
        e.preventDefault();
        if ($(this).attr('id') == 'various') {
            color = d3.scale.category20();
        } else {
            color = d3.scale.linear().range(["#4db6ac", "#009688"]);
        }
        
        for (var idx in movie_graphs) {
            var graph = movie_graphs[idx];
            graph.update_color(color);
        }
    });
});

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var color = d3.scale.category20();

var MovieGraph = function(data, arg1, arg2) {
    var arg1 = arg1;
    var arg2 = arg2;

    var get_label = function(param) {
        if (param == 'nu') return 'Naver user';
        else if (param == 'nc') return 'Naver critic';
        else if (param == 'cu') return 'Cine21 user';
        else if (param == 'cc') return 'Cine21 critic';
        else if (param == 'iu') return 'IMDb user';
        else if (param == 'ic') return 'IMDb critic';
    }

    var get_data = function(d, param) {
        if (param == 'nu') return d.naver_user / 10;
        else if (param == 'nc') return d.naver_critic / 10;
        else if (param == 'cu') return d.cine_user;
        else if (param == 'cc') return d.cine_critic;
        else if (param == 'iu') return d.imdb_user;
        else if (param == 'ic') return d.metacritic * 10;
    }

    var xValue = function(d) { return get_data(d, arg1); },
        xScale = d3.scale.linear().range([0, width]),
        xMap = function(d) { return xScale(xValue(d));},
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yValue = function(d) { return get_data(d, arg2);},
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function(d) { return yScale(yValue(d));},
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    var cValue = function(d) {
        var d1 = get_data(d, arg1);
        var d2 = get_data(d, arg2);
        return Math.floor(Math.abs(d1-d2));
    };

    this.get_cValue = function(d) { return cValue(d); }

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.get_svg = function() { return svg; }

    var tooltip = d3.select("#graph").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    xScale.domain([0, 10]);
    yScale.domain([0, 10]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(get_label(arg1));

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(get_label(arg2));

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr('opacity', 0.5)
        .style("fill", function(d) { return color(cValue(d));}) 
        .attr("visibility", function(d,i){
            if(get_data(d, arg1) <= 0 || get_data(d, arg2) <= 0 ) return "hidden";
        })
    .on("mouseover", function(d) {
        tooltip.transition()
        .duration(100)
        .style("opacity", 1.0);
    tooltip.html(d.title + "<br/> (" + xValue(d) 
        + ", " + yValue(d) + ")")
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28 - $(".splash-container").height()) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
        .duration(800)
        .style("opacity", 0);
    });

    this.update_color = function(color) {
        svg.selectAll(".dot")
            .style("fill", function(d) { return color(cValue(d));});
    }
};

var critics = [];
var cids = ['E20041463', 'E20041252', 'E20041291', 'E20041338', 'E20041283',
       'E20041590', 'E20041648', 'E20041279', 'C20030816', 'C20040204',
       'E20041228', 'E20041646', 'E20041565', 'E20041598', 'C20030805'];
var cnames = {'E20041217':'김용언','E20041648':'김성훈','E20041291':'이용철','E20041338':'황진미','E20041646':'이주현','E20041570':'고경태','C20040204':'김도훈','E20041598':'주성철','C20040203':'오정연','E20041330':'한동원','E20041214':'김소희','C20041001':'이다혜','E20041590':'장영엽','C20030805':'김봉석','E20041213':'김소영','C20030825':'박혜명','E20041237':'남다은','E20041252':'박평식','E20041279':'유지나','E20041273':'안정숙','E20041445':'하재봉','E20041464':'최하나','C20030808':'이성욱','E20041693':'김태훈','E20041694':'오세형','E20041717':'이후경','C20040801':'문석','E20041283':'이동진','E20041334':'홍성남','E20041390':'김지미','C20030818':'이영진','E20041368':'이명인','E20041369':'강한섭','E20041520':'이현경','E20041673':'송경원','E20041465':'정재혁','E20041301':'임범','E20041463':'강병진','C20030819':'정한석','E20041565':'이화정','C20030816':'김혜리','E20041719':'남민영','E20041678':'신두영','C20030813':'남동철','E20041269':'심영섭','E20041487':'안현진','E20041370':'김영진','E20041220':'김은형','E20041228':'김종철','E20041243':'달시 파켓','E20041488':'장미'};

var Critic = function(cid) {
    this.cid = cid;
    this.name = "";
    this.reviews = [];

    this.set_name = function(name) { this.name = name; };
};

var movie_dict = {};
var movie_graphs = [];
var critic_list;
var critic_graphs = [];

d3.csv("/carpedm20/critic/static/movie.csv", function(error, data) {
    for (var idx in data) {
        var movie = data[idx];
        movie_dict[movie.cine] = movie;
    }

    options = [['nu', 'nc'], ['cu', 'cc'], ['iu', 'ic'], ['nc', 'ic']];

    for (var idx in options) {
        var option = options[idx];
        movie_graphs.push(new MovieGraph(data, option[0], option[1]));
    }

    d3.csv("/carpedm20/critic/static/critics.csv", function(error, data) {
        critic_list = data;

        for (var idx in cids) {
            cid = cids[idx];
            critic = new Critic(cid);

            for (var jdx in data) {
                var c = data[jdx];
                if (c.cid == cid) {
                    critic.reviews.push(c);
                }
            }

            critics.push(critic);
            critic_graphs.push(new CriticGraph(critic, 'nu'));
        }
    });
});

var CriticGraph = function(critic, arg2) {
    var critic = critic;
    var arg2 = arg2;

    var get_label = function(param) {
        if (param == 'nu') return 'Naver user';
        else if (param == 'nc') return 'Naver critic';
        else if (param == 'cu') return 'Cine21 user';
        else if (param == 'cc') return 'Cine21 critic';
        else if (param == 'iu') return 'IMDb user';
        else if (param == 'ic') return 'IMDb critic';
    }

    var get_data = function(d, param) {
        if (param == 'nu') return d.naver_user / 10;
        else if (param == 'nc') return d.naver_critic / 10;
        else if (param == 'cu') return d.cine_user;
        else if (param == 'cc') return d.cine_critic;
        else if (param == 'iu') return d.imdb_user;
        else if (param == 'ic') return d.metacritic * 10;
    }

    var xValue = function(d) { return d.rating; },
        xScale = d3.scale.linear().range([0, width]),
        xMap = function(d) { return xScale(xValue(d));},
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yValue = function(d) {
            var value = get_data(movie_dict[d.mid], arg2);
            return value;
        },
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function(d) { return yScale(yValue(d));},
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    var cValue = function(d) {
        var d1 = d.rating;
        var d2 = get_data(movie_dict[d.mid], arg2);
        return Math.floor(Math.abs(d1-d2));
    };

    this.get_cValue = function(d) { return cValue(d); }

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.get_svg = function() { return svg; }

    var tooltip = d3.select("#graph").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    xScale.domain([0, 10]);
    yScale.domain([0, 10]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(cnames[critic.cid]);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(get_label(arg2));

    svg.selectAll(".dot")
        .data(critic.reviews)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr('opacity', 0.5)
        .style("fill", function(d) { return color(cValue(d));}) 
        .attr("visibility", function(d,i){
            var value = get_data(movie_dict[d.mid], arg2);
            if(value <= 0 ) return "hidden";
        })
    .on("mouseover", function(d) {
        tooltip.transition()
        .duration(100)
        .style("opacity", 1.0);
    tooltip.html(d.title + "<br/> (" + xValue(d) 
        + ", " + yValue(d) + ")")
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28 - $(".splash-container").height()) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
        .duration(800)
        .style("opacity", 0);
    });

    this.update_color = function(color) {
        svg.selectAll(".dot")
            .style("fill", function(d) { return color(cValue(d));});
    }
};

