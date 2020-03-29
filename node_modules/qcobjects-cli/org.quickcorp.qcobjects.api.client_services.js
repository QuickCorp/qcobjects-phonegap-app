'use strict';

Package('org.quickcorp.qcobjects.api.client_services', [
  Class('QuickCorpCloud', Service, {
    name: 'quickcorp_cloud',
    external: true,
    useHTTP2:true,
    cached: false,
    method: 'post',
    headers: {
      'Origin': 'localhost',
      'Content-Type': 'application/json',
      '::method':'post'
    },
    basePath: 'https://cloud.quickcorp.org/',
    url: '',
    withCredentials: false,
    _new_: function(o) {
      // service instantiated
      this.headers['Authorization'] = `Basic token`;
      this.url = this.basePath + o.apiMethod;
      this.data = o.data;
    },
    done: function(service,standardResponse) {
      // service loaded
      logger.debug(standardResponse);
    },
    fail: function (e){
        logger.debug(e);
    }
  })
]);
