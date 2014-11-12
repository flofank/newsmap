var feeds = [];

angular.module('feedReader', ['ngResource'])
    .factory('feedLoader', function($resource) {
        return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
            fetch: {
                method: 'JSONP',
                params: {
                    v: '1.0',
                    callback: 'JSON_CALLBACK'
                }
            }
        });
    })
    .service('feedList', function($rootScope, feedLoader) {
        this.get = function() {
            var feedSources = [
                {title: '20min', url: 'http://www.20min.ch/rss/rss.tmpl?type=channel&get=1'},
                {title: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss'},
                {title: 'Wired', url: 'http://feeds.wired.com/wired/index'}
            ];
            if (feeds.length === 0) {
                for (var i = 0; i < feedSources.length; i++) {
                    feedLoader.fetch({q: feedSources[i].url, num: 10}, {}, function (data) {
                        var feed = data.responseData.feed;
                        feeds.push(feed);
                    });
                }
            }
            return feeds;
        };
    })
    .controller('feedCtrl', function($scope, feedList) {
        $scope.feeds = feedList.get();
        $scope.$on('feedList', function(event, data) {
            $scope.feeds = data;
        });
    });
                