!function($){var e=$.sammy("#app",function(){this.use("Template"),this.around(function(e){var t=this;e()}),this.get("#/",function(e){$("#step2").hide();var t=location.href.toLowerCase();e.app.swap(""),e.render("templates/help.template",{}).appendTo(e.$element()).then(function(){$(".iman").click(function(){var e=HelpDelegate.getInstance();e.handleStep1Click(AppModel.MAN)}),$(".iwoman").click(function(){var e=HelpDelegate.getInstance();e.handleStep1Click(AppModel.WOMAN)}),$(".ifamily").click(function(){var e=HelpDelegate.getInstance();e.handleStep1Click(AppModel.FAMILY)}),$(".ianon").click(function(){var e=HelpDelegate.getInstance();e.handleStep1Click(AppModel.ANONYMOUS)}),$(".housing").click(function(){$(this).data("selected",!0);var e=HelpDelegate.getInstance();e.handleStep2Click(AppModel.ANONYMOUS)}),$(".food").click(function(){var e=HelpDelegate.getInstance();e.handleStep2Click(AppModel.ANONYMOUS)}),$(".hygine").click(function(){var e=HelpDelegate.getInstance();e.handleStep2Click(AppModel.ANONYMOUS)}),$(".casemgmt").click(function(){var e=HelpDelegate.getInstance();e.handleStep2Click(AppModel.ANONYMOUS)}),$(".employment").click(function(){var e=HelpDelegate.getInstance();e.handleStep2Click(AppModel.ANONYMOUS)}),$(".money").click(function(){var e=HelpDelegate.getInstance();e.handleStep2Click(AppModel.ANONYMOUS)}),$(".other").click(function(){var e=HelpDelegate.getInstance();e.handleStep2Click(AppModel.ANONYMOUS)})})}),this.get("#/about/",function(e){console.log("ets"),e.app.swap(""),e.render("templates/about.template",{}).appendTo(e.$element())}),this.get("#/help2/",function(e){alert("asdf");var t=location.href.toLowerCase();e.app.swap(""),e.render("templates/help2.template",{}).appendTo(e.$element()).then(function(){alert("asdf")})})});$(function(){e.run("#/")})}(jQuery);