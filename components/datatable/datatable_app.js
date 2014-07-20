/**
 * Created by IntelliJ IDEA.
 * User: abhijeet.pa
 * Date: 16/07/14
 * Time: 12:42 PM
 * To change this template use File | Settings | File Templates.
 */

App = Ember.Application.create({
    LOG_TRANSITIONS:true,
    LOG_TRANSITIONS_INTERNAL:true,
    LOG_VIEW_LOOKUPS:true,
    LOG_ACTIVE_GENERATION:true
});

App.Router.map(function() {
    this.resource("application", { path:"/" });
});

//for using history location
//App.Router.reopen({
//    rootURL:'/em/components/datatable/',
//    location:'history'
//});

App.DataArray = Ember.A([{id:1,name:'WFHYMzonRD',age:57},{id:2,name:'QQNZwODygv',age:48},{id:3,name:'hOJdgwVnTR',age:71},{id:4,name:'AQFZeTQICH',age:44},{id:5,name:'qHVfkulGWt',age:38},{id:6,name:'GwBcsPWkIw',age:11},{id:7,name:'owfimOKUnb',age:47},{id:8,name:'ihMDsszLNg',age:21},{id:9,name:'piBeeLNBMc',age:77},{id:10,name:'RkkGVeTXFc',age:15},{id:11,name:'rFwJfixlrM',age:37},{id:12,name:'SRzDEapHXh',age:69},{id:13,name:'hNNmHKRJOj',age:31},{id:14,name:'lTutqGKcaC',age:72},{id:15,name:'zgyzwfxDXF',age:33},{id:16,name:'KRYvJIjSXu',age:61},{id:17,name:'sOcZzeZcYz',age:21},{id:18,name:'xZECwiAbzl',age:71},{id:19,name:'xGBgPuekgw',age:79},{id:20,name:'iwynvAmUJJ',age:72},{id:21,name:'nmqwMrVXkt',age:51},{id:22,name:'MzugEEnbEv',age:41},{id:23,name:'cISDVNmEGA',age:68},{id:24,name:'XWDoRBzlfm',age:60},{id:25,name:'zspeGqIbNL',age:59},{id:26,name:'FoFtBkabbX',age:78},{id:27,name:'ElQgLbmXMM',age:32},{id:28,name:'cQWszXfkIL',age:44},{id:29,name:'neayeczcae',age:29},{id:30,name:'QkZRwWEimG',age:80},{id:31,name:'iYygeJPQic',age:74},{id:32,name:'jAalacleqb',age:30},{id:33,name:'pTLmxUyeTH',age:14},{id:34,name:'sOibDYkGTu',age:19},{id:35,name:'UFhWQlnSAC',age:61},{id:36,name:'lOjgnoZUrs',age:58},{id:37,name:'zumxESrYam',age:51},{id:38,name:'hivtvnTYZf',age:63},{id:39,name:'jlaxlVODEo',age:78},{id:40,name:'RMDKdCKpgR',age:43},{id:41,name:'BkUPeTPjGY',age:39},{id:42,name:'HwGClkhzjY',age:26},{id:43,name:'MIposFvkeW',age:38},{id:44,name:'ZMzSCIyBeg',age:77},{id:45,name:'LIjWQJfOVR',age:42},{id:46,name:'lgQQBbVywU',age:24},{id:47,name:'VNMEmoIslt',age:11},{id:48,name:'upRdvGZndk',age:36},{id:49,name:'UaUVWsrRDn',age:51},{id:50,name:'qRQEAjQTkl',age:23},{id:51,name:'bpFHoSLylG',age:44},{id:52,name:'gBwzTncgSt',age:79},{id:53,name:'JYySOscaCd',age:31},{id:54,name:'hLEawdmcCs',age:51},{id:55,name:'YRymUFenDO',age:26},{id:56,name:'cGbvJbXNrf',age:43},{id:57,name:'WgVZsXCKCB',age:48},{id:58,name:'aOwFSKjHWl',age:29},{id:59,name:'XGXZEKrJin',age:67},{id:60,name:'dnibPSErvE',age:17},{id:61,name:'RkYCtFyETw',age:25},{id:62,name:'QwPANzJbpN',age:29},{id:63,name:'xOeqtvLXAD',age:20},{id:64,name:'zfBeEfXarO',age:41},{id:65,name:'gpkGYlWLAt',age:46},{id:66,name:'EKTawRBZZa',age:16},{id:67,name:'AeJGcKXRhe',age:18},{id:68,name:'sKeEGQearJ',age:60},{id:69,name:'lJhclhblmC',age:32},{id:70,name:'VisFfjMjqe',age:72},{id:71,name:'vIAmNADxlP',age:19},{id:72,name:'sRsATDMwTH',age:51},{id:73,name:'mnJwaTMfMi',age:64},{id:74,name:'nuBNXYZMfs',age:52},{id:75,name:'ySybEUVmzi',age:44},{id:76,name:'jFzcrEPAtc',age:73},{id:77,name:'UQSTPFZikx',age:11},{id:78,name:'IzFDuSdCrm',age:20},{id:79,name:'RozwdaPfUK',age:75},{id:80,name:'MDMrCUCaVl',age:44},{id:81,name:'BPUtSwLeEC',age:35},{id:82,name:'eZwfOCZyyM',age:13},{id:83,name:'keFfGFbReC',age:54},{id:84,name:'YWyvHDakWf',age:22},{id:85,name:'skXVkwtWyE',age:11},{id:86,name:'dKHJLyOneN',age:23},{id:87,name:'DjRgkbcpkv',age:46},{id:88,name:'iqLFKHeoIi',age:79},{id:89,name:'pRKNGYStiv',age:49},{id:90,name:'ZCMbEcmZDu',age:31},{id:91,name:'oaZWeoEmnU',age:15},{id:92,name:'YIKWBdeWGd',age:43},{id:93,name:'tedvqcYLsn',age:61},{id:94,name:'sjQHOdVJhT',age:34},{id:95,name:'RPSVTPBXoU',age:13},{id:96,name:'rqtupeMCQf',age:62},{id:97,name:'HMBKIkRBCJ',age:33},{id:98,name:'vElkgiybkQ',age:34},{id:99,name:'DkHIXkzcWg',age:66},{id:100,name:'DkrIXkzcWg',age:63}]);

App.ApplicationRoute = Ember.Route.extend({
    model:function(){
        return App.DataArray;
    }
});

App.ApplicationController=Ember.ArrayController.extend(Ember.DataTableMixin,{
    queryParams:['sortBy','order','search','page','itemsPerPage','filterBy'],
    queryParamsEnabled:true
});