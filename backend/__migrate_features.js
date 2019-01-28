/* eslint-disable */

/*
  First we migrate the layers.
*/
var layersStore = {};
var featuresStore = {};

db.sitemaplayers.remove({})
db.sitemaps.find().forEach(sitemap => {
  sitemap.layers.forEach(layer => {
    if (!layer) return

    const insert = {
      createdAt: new Date(),
      updatedAt: null,

      siteId : sitemap.siteId,
      name : layer.name,
      index : layer.index,
    }

    db.sitemaplayers.insert(insert)
    var layerId = db.sitemaplayers.findOne(insert)._id; // previous id
    layersStore[layer.id] = layerId;
  })
})

/*
  Then we migrate the features and attach them to new layers by
  updating id.
*/
db.sitemapfeatures.remove({})
db.sitemaps.find().forEach(sitemap => {
  sitemap.features.forEach(feature => {
    if (!feature) return

    const props = feature.properties;
    delete feature.properties;

    const insert = {
      createdAt: new Date(),
      updatedAt: null,

      geojson: feature,

      title : props.title || null,
      color : props.color || null,
      index : props.index || null,
      repairType : props.repairType || null,
      surfaceType : props.surfaceType || null,
      trafficType : props.trafficType || null,
      pci : props.pci || null,
      restripeAffectedArea : props.restripeAffectedArea || null,
      fillAsphaltCrack : props.fillAsphaltCrack || null,

      concreteCrackFill: props.concreteCrackFill || null,
      inputConcreteCrackFill: props.inputConcreteCrackFill || null,

      inputArea : props.inputArea || null,
      inputAsphalt : props.inputAsphalt || null,

      siteId : sitemap.siteId || null,
      layerId : layersStore[props.layerId] || null
    }

    db.sitemapfeatures.insert(insert)
    var inserted = db.sitemapfeatures.findOne(insert);
    featuresStore[props.id] = inserted._id; // previous id
  })
})

db.sitemaps.find().forEach(sitemap => {
  sitemap.features.forEach(feature => {
    if (!feature) return

    const props = feature.properties;
    delete feature.properties;

    if (props && props.zone && props.zone.id) {
      var f = db.sitemapfeatures.findOne(featuresStore[props.id]);
      const zoneId = featuresStore[props.zone.id];
      if (zoneId) {
        db.sitemapfeatures.update({ _id: f._id }, { $set: { zoneId: zoneId } });
      }
    }
  })
})
