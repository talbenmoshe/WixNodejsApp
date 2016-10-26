module.exports =  {
  getComponentUniqueId: function (keyParts) {
    return (keyParts.join('_')) || 'demo';
  }
};
