module.exports =  {
  getComponentUniqueId: function (parsedInstance,compId) {

    return (parsedInstance.instanceId + '_' + compId) || 'demo';
  }
};
